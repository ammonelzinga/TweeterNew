import { AuthenticateResponse, LoginRequest} from "tweeter-shared";
import { UserService } from "../../model/server/UserService";


export const handler = async(request: LoginRequest): Promise<AuthenticateResponse> => {
    const userService = new UserService();
    const [userDto, token] = await userService.login(request.userAlias, request.password);
    return {
        success: true,
        message: null,
        userDto: userDto,
        token: token
    }
}