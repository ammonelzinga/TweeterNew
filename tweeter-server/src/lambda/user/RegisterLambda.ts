import { AuthenticateResponse, RegisterRequest} from "tweeter-shared";
import { UserService } from "../../model/server/UserService";


export const handler = async(request: RegisterRequest): Promise<AuthenticateResponse> => {
    const userService = new UserService();
    const [userDto, token] = await userService.register(request.firstName, request.lastName, request.userAlias, request.password, 
        request.imageStringBase64, request.imageFileExtension);
    return {
        success: true,
        message: null,
        userDto: userDto,
        token: token
    }
}