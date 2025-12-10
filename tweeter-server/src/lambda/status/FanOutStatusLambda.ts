import {PostItemRequest, StatusDto, TweeterResponse} from "tweeter-shared"
import { StatusService } from "../../model/server/StatusService";
import { DynamoAuthDAO } from "../../dao/dynamodb/DynamoAuthDAO";
import { AuthenticationService } from "../../model/server/AuthenticationService";
import { dynamoFactory } from "../../factory/dynamoFactory";
import { FollowService } from "../../model/server/FollowService";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { SQSEvent } from "aws-lambda";
import { max } from "date-fns";

export const handler = async (event: SQSEvent) => {
    const factory = new dynamoFactory();
    const statusService = new StatusService(factory.createStatusDAO());
    const followService = new FollowService(factory.createFollowDAO());

    const sqsClient = new SQSClient({region: "us-west-2"});
    
    const FEED_BATCH_QUEUE_URL = process.env.FEED_BATCH_QUEUE_URL!;
    const BATCH_SIZE = 25;
    const MAX_SQS_BATCH = 10;
    const CONCURRENT_BATCHES = 3;
    const PAGE_DELAY_MS = 50;

    interface FanoutMessage {
        statusId: number;
        user_alias: string;
        status: StatusDto;
    }

    for (const record of event.Records) {
        const fanoutMessage: FanoutMessage = JSON.parse(record.body);
       
        try {
            for await (const followerspage of followService.getFollowersPaginated(fanoutMessage.user_alias, BATCH_SIZE)) {
                const batchPromises: Promise<any>[] = [];

                for (let i = 0; i < followerspage.length; i += MAX_SQS_BATCH) {
                    const batchFollowers = followerspage.slice(i, i + MAX_SQS_BATCH);
                    const entries = batchFollowers.map((follower, index) => ({
                        Id: `${fanoutMessage.statusId}-${i}-${index}`,
                        MessageBody: JSON.stringify({
                            user_alias: follower.alias,
                            status: fanoutMessage.status
                        })
                    }));
                
                    batchPromises.push(sqsClient.send(
                        new SendMessageBatchCommand({
                            QueueUrl: FEED_BATCH_QUEUE_URL,
                            Entries: entries
                        })
                    ));
                }

                for (let j = 0; j < batchPromises.length; j += CONCURRENT_BATCHES) {
                    const concurrentBatches = batchPromises.slice(j, j + CONCURRENT_BATCHES);
                    await Promise.all(concurrentBatches);
                }
            }
        }
        catch (e) {
            console.error(`Error sending feed batch messages for status  ${fanoutMessage.statusId} for user ${fanoutMessage.user_alias}:`, e);
        }
    }
}