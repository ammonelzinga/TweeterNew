import {PostItemRequest, StatusDto, TweeterResponse} from "tweeter-shared"
import { StatusService } from "../../model/server/StatusService";
import { DynamoAuthDAO } from "../../dao/dynamodb/DynamoAuthDAO";
import { AuthenticationService } from "../../model/server/AuthenticationService";
import { dynamoFactory } from "../../factory/dynamoFactory";
import { FollowService } from "../../model/server/FollowService";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { FanoutMessage } from "../sharedInterfaces/FanoutMessage";

export const handler = async(request: PostItemRequest<StatusDto>): Promise<TweeterResponse> => {
    const factory = new dynamoFactory();
        const authService = new AuthenticationService(factory.createAuthenticationDAO());
        const isAuthorized = await authService.isAuthorized(request.token, request.userAlias);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }
    const statusService = new StatusService(factory.createStatusDAO());
    const followService = new FollowService(factory.createFollowDAO());
    
    const sqsClient = new SQSClient({region: "us-west-2"});
    const STATUS_QUEUE_URL = process.env.STATUS_QUEUE_URL!;

        if (!request.item) {
            return {
                success: false,
                message: "No status item provided",
            }
        }
    await statusService.postStatus(request.token, request.item!);

    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: STATUS_QUEUE_URL,
            MessageBody: JSON.stringify({
                statusId: request.item?.timestamp,
                user_alias: request.userAlias,
                status: request.item
            })

        })
    );
    return {
        success: true,
        message: null,
    }
}