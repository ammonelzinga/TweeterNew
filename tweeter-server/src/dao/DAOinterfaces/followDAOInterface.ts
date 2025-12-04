import {UserDto} from "tweeter-shared";

export interface followDAOInterface {
    getFollowees(
        followerAlias: string,
        limit: number,
        lastFolloweeAlias?: string
    ): Promise<{followees: UserDto[], hasMore: boolean}>;
    getFollowers(
        followeeAlias: string,
        limit: number,
        lastFollowerAlias?: string
    ): Promise<{followers: UserDto[], hasMore: boolean}>;  
    getFollowStatus(
        followerAlias: string,
        followeeAlias: string
    ): Promise<boolean>;
    getFolloweeCount(
        userAlias: string
    ): Promise<number>;
    getFollowerCount(
        userAlias: string
    ): Promise<number>;
    follow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void>;
    unfollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void>;
    getAllFollowers(
        followeeAlias: string
    ): Promise<UserDto[]>;
}