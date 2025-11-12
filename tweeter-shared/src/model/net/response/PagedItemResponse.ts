import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<t> extends TweeterResponse{
    readonly items: t[] | null;
    readonly hasMore: boolean
}