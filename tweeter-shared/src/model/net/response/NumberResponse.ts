import { TweeterResponse } from "./TweeterResponse";

export interface NumberResponse extends TweeterResponse{
    count: number,
    secondCount?: number
}