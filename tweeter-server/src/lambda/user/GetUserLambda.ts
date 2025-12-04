import {TweeterRequest, UserResponse} from "tweeter-shared";
import { UserService } from "../../model/server/UserService";
import { DynamoAuthDAO } from "../../dao/dynamodb/DynamoAuthDAO";
import { AuthenticationService } from "../../model/server/AuthenticationService";
import { dynamoFactory } from "../../factory/dynamoFactory";


export const handler = async(request: TweeterRequest): Promise<UserResponse> => {
    const factory = new dynamoFactory();
        const authService = new AuthenticationService(factory.createAuthenticationDAO());
        const isAuthorized = await authService.isAuthorized(request.token, request.userAlias);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }
    const userService = new UserService(factory.createUserDAO(), 
    factory.createAuthenticationDAO(), factory.createProfileImageDAO());
    const userDto= await userService.getUser(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        userDto: userDto,
    }
}