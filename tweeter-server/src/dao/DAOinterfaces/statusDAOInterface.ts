import {StatusDto} from "tweeter-shared";
export interface statusDAOInterface {
    getStoryItems(
        userAlias: string,
        limit: number,
        lastStatus? : StatusDto | null
    ): Promise<{statuses: StatusDto[], hasMore: boolean}>;
    getFeedItems(
        userAlias: string,
        limit: number,
        lastStatus? : StatusDto | null
    ): Promise<{statuses: StatusDto[], hasMore: boolean}>;
    postStatus(
        status: StatusDto
    ): Promise<void>;
}