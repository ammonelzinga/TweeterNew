import { StatusDto } from "tweeter-shared";

export interface FanoutMessage {
    user_alias: string;
    status: StatusDto;
}