import { TweeterRequest } from "./TweeterRequest";

export interface PostItemRequest<t> extends TweeterRequest{
    readonly item: t | null
}