import {PostItemRequest, StatusDto, TweeterResponse} from "tweeter-shared"
import { StatusService } from "../../model/server/StatusService";
import { DynamoAuthDAO } from "../../dao/dynamodb/DynamoAuthDAO";
import { AuthenticationService } from "../../model/server/AuthenticationService";
import { dynamoFactory } from "../../factory/dynamoFactory";

export const handler = async(request: PostItemRequest<StatusDto>): Promise<TweeterResponse> => {
    const factory = new dynamoFactory();
        const authService = new AuthenticationService(factory.createAuthenticationDAO());
        const isAuthorized = await authService.isAuthorized(request.token, request.userAlias);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }
    const statusService = new StatusService(factory.createStatusDAO());
    await statusService.postStatus(request.token, request.item!);
    return {
        success: true,
        message: null,
    }
}