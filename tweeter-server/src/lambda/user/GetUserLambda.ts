import {TweeterRequest, UserResponse} from "tweeter-shared";
import { UserService } from "../../model/server/UserService";


export const handler = async(request: TweeterRequest): Promise<UserResponse> => {
    const userService = new UserService();
    const userDto= await userService.getUser(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        userDto: userDto,
    }
}