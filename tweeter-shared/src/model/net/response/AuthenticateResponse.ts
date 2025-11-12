import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthenticateResponse extends TweeterResponse{
    token: string, 
    userDto: UserDto | null
}

