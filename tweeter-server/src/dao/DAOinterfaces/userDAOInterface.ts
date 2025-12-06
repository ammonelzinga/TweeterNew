import {UserDto} from "tweeter-shared";

export interface userDAOInterface {
    registerUser(
        user: UserDto,
        hashedPassword: string, 
        imageUrl?: string
    ): Promise<void>;

    validateUserCredentials(
        userAlias: string,
        hashedPassword: string
    ): Promise<{user: UserDto | null, isValid: boolean}>;

    getUserByAlias(
        userAlias: string
    ): Promise<UserDto | null>;

    getUserByAliasWithCounts(
        userAlias: string
    ): Promise<any>;

    incrementFollowers(alias: string): Promise<void>;
    decrementFollowers(alias: string): Promise<void>;
    incrementFollowee(alias: string): Promise<void>;
    decrementFollowee(alias: string): Promise<void>;

    batchGetUsers(aliases: string[]): Promise<UserDto[]>;

}

