import { FollowService } from "../../model/server/FollowService";
import {BooleanResponse, UserPairRequest} from "tweeter-shared";

export const handler = async(request: UserPairRequest): Promise<BooleanResponse> => {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(request.token, request.userAlias, request.selectedUserAlias );
    return {
        success: true,
        message: null,
        isTrue: isFollower
    }
}