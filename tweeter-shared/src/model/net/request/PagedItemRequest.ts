import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<t> extends TweeterRequest{
    readonly pageSize: number,
    readonly lastItem: t | null
}