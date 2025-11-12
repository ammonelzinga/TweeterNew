import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest{
    firstName: string,
    lastName: string,
    imageStringBase64: string,
    imageFileExtension: string
}