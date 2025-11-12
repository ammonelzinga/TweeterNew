import { FollowService } from "../../model/server/FollowService";
import {NumberResponse, TweeterResponse, UserPairRequest} from "tweeter-shared";

export const handler = async(request: UserPairRequest): Promise<TweeterResponse> => {
    const followService = new FollowService();
    const [one, two] = await followService.follow(request.token, request.userAlias);
    return {
        success: true,
        message: null,
    }
}