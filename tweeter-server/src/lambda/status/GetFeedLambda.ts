import {PagedItemRequest, PagedItemResponse, StatusDto} from "tweeter-shared"
import { StatusService } from "../../model/server/StatusService";

export const handler = async(request: PagedItemRequest<StatusDto>): Promise<PagedItemResponse<StatusDto>> => {
    const statusService = new StatusService();
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}