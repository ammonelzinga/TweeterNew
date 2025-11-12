import { FollowService } from "../../model/server/FollowService";
import { NumberResponse, TweeterRequest} from "tweeter-shared";

export const handler = async(request: TweeterRequest): Promise<NumberResponse> => {
    const followService = new FollowService();
    const count = await followService.getFolloweeCount(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        count: count
    }
}