import { TweeterRequest } from "./TweeterRequest";

export interface LoginRequest extends TweeterRequest{
    password: string
}