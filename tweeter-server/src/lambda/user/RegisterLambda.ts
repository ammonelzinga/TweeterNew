import { AuthenticateResponse, RegisterRequest} from "tweeter-shared";
import { UserService } from "../../model/server/UserService";
import { dynamoFactory } from "../../factory/dynamoFactory";


export const handler = async(request: RegisterRequest): Promise<AuthenticateResponse> => {
    const factory = new dynamoFactory();
    const userService = new UserService(factory.createUserDAO(), 
    factory.createAuthenticationDAO(), factory.createProfileImageDAO());
    //I am assuming registration does not need authorization check until after they are registered, so doing it there
    const [userDto, token] = await userService.register(request.firstName, request.lastName, request.userAlias, request.password, 
        request.imageStringBase64, request.imageFileExtension);
    return {
        success: true,
        message: null,
        userDto: userDto,
        token: token
    }
}