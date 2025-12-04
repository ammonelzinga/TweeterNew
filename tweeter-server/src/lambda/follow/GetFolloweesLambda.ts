import {PagedItemRequest, PagedItemResponse, UserDto} from "tweeter-shared"
import { FollowService } from "../../model/server/FollowService";
import { DynamoAuthDAO } from "../../dao/dynamodb/DynamoAuthDAO";
import { AuthenticationService } from "../../model/server/AuthenticationService";
import { dynamoFactory } from "../../factory/dynamoFactory";

export const handler = async(request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    const factory = new dynamoFactory();
        const authService = new AuthenticationService(factory.createAuthenticationDAO());
        const isAuthorized = await authService.isAuthorized(request.token, request.userAlias);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }
    const followService = new FollowService(factory.createFollowDAO());
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}