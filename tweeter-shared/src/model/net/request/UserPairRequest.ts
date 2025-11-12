import { TweeterRequest } from "./TweeterRequest";

export interface UserPairRequest extends TweeterRequest{
    selectedUserAlias: string
}