import { FollowService } from "../../model/server/FollowService";
import { NumberResponse, TweeterRequest} from "tweeter-shared";
import {AuthenticationService} from "../../model/server/AuthenticationService";
import {DynamoAuthDAO} from "../../dao/dynamodb/DynamoAuthDAO";
import { dynamoFactory } from "../../factory/dynamoFactory";

export const handler = async(request: TweeterRequest): Promise<NumberResponse> => {
    const factory = new dynamoFactory();
    const authService = new AuthenticationService(factory.createAuthenticationDAO());
    const isAuthorized = await authService.isAuthorized(request.token, request.userAlias);
    if (!isAuthorized) {
        throw new Error("Unauthorized");
    }
    const followService = new FollowService(factory.createFollowDAO());
    const count = await followService.getFolloweeCount(request.userAlias);
    return {
        success: true,
        message: null,
        count: count
    }
}