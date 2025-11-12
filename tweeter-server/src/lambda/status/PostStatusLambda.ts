import {PostItemRequest, StatusDto, TweeterResponse} from "tweeter-shared"
import { StatusService } from "../../model/server/StatusService";

export const handler = async(request: PostItemRequest<StatusDto>): Promise<TweeterResponse> => {
    const statusService = new StatusService();
    await statusService.postStatus(request.token, request.item!);
    return {
        success: true,
        message: null,
    }
}