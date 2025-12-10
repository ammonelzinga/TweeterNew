import { SQSEvent, Context } from "aws-lambda";
import { StatusService } from "../../model/server/StatusService";
import { dynamoFactory } from "../../factory/dynamoFactory";

export const handler = async (event: SQSEvent, context: Context) => {
    const factory = new dynamoFactory();
    const statusService = new StatusService(factory.createStatusDAO());

    const FEED_TABLE_NAME = process.env.FEED_TABLE_NAME!;

    interface FeedBatchMessage {
        user_alias: string;
        status: any;
    }

    for (const record of event.Records) {
        const feedBatchMessage: FeedBatchMessage = JSON.parse(record.body);
        try{await statusService.writeStatusToFeed(
            feedBatchMessage.user_alias,
            feedBatchMessage.status
        );} catch (e) {
            console.error(`Error writing status to feed for user ${feedBatchMessage.user_alias}:`, e);
        }
    }

}


