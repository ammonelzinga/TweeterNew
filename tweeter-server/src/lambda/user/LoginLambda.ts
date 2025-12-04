import { AuthenticateResponse, LoginRequest} from "tweeter-shared";
import { UserService } from "../../model/server/UserService";
import { dynamoFactory } from "../../factory/dynamoFactory";


export const handler = async(request: LoginRequest): Promise<AuthenticateResponse> => {
    const factory = new dynamoFactory();
    const userService = new UserService(factory.createUserDAO(), 
    factory.createAuthenticationDAO(), factory.createProfileImageDAO());
    //I am assuming login does not need authorization check until after they are logged in, so doing it there
    const [userDto, token] = await userService.login(request.userAlias, request.password);
    
    return {
        success: true,
        message: null,
        userDto: userDto,
        token: token
    }
}