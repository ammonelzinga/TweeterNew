import { DynamoAuthDAO } from "../../dao/dynamodb/DynamoAuthDAO";
import { dynamoFactory } from "../../factory/dynamoFactory";
import { AuthenticationService } from "../../model/server/AuthenticationService";
import { FollowService } from "../../model/server/FollowService";
import {NumberResponse, TweeterResponse, UserPairRequest} from "tweeter-shared";

export const handler = async(request: UserPairRequest): Promise<TweeterResponse> => {
    const factory = new dynamoFactory();
        const authService = new AuthenticationService(factory.createAuthenticationDAO());
        const isAuthorized = await authService.isAuthorized(request.token, request.userAlias);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }
    const followService = new FollowService(factory.createFollowDAO());
    await followService.unfollow(request.userAlias, request.selectedUserAlias);
    return {
        success: true,
        message: null,
    }
}