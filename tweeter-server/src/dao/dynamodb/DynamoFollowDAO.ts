import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { User, UserDto } from "tweeter-shared";
import {Follow} from "tweeter-shared";
import {followDAOInterface} from "../../dao/DAOinterfaces/followDAOInterface";
import { userDAOInterface } from "../DAOinterfaces/userDAOInterface";
import { DynamoUserDAO } from "./DynamoUserDAO";
export class DynamoFollowDAO implements followDAOInterface {
    private readonly tableName = "follows";
    private readonly followTableIndex = "follows_index";
    private readonly client: DynamoDBDocumentClient;
    private readonly userDAO: userDAOInterface

    constructor(){
        const dynamoClient = new DynamoDBClient({region: "us-west-2"});
        this.client = DynamoDBDocumentClient.from(dynamoClient);
        this.userDAO = new DynamoUserDAO
    }  

    async getFollowees(followerAlias: string, 
        limit: number = 10,
        lastFolloweeAlias?: string | undefined
        ): 
    Promise<{followees: UserDto[]; hasMore: boolean;}> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :f",
            ExpressionAttributeValues: {
                ":f": followerAlias
            },
            Limit: limit
        };

        if(lastFolloweeAlias) {
            params.ExclusiveStartKey = {
                follower_handle: followerAlias,
                followee_handle: lastFolloweeAlias
            };
        }

        const data = await this.client.send(new QueryCommand(params));
        const aliases: string[] = data.Items ? data.Items.map(item => item.followee_handle) : [];
        const hasMore = data.LastEvaluatedKey ? true : false;

        const followees = await this.batchGetUsers(aliases);
        return {followees, hasMore};
    }

    async getFollowers(followeeAlias: string,
        limit: number = 10,
        lastFollowerAlias?: string | undefined
        ): Promise<{followers: UserDto[]; hasMore: boolean;}> {
        const params: any = {
            TableName: this.tableName,
            IndexName: this.followTableIndex,
            KeyConditionExpression: "followee_handle = :f",
            ExpressionAttributeValues: {
                ":f": followeeAlias
            },
            Limit: limit
        };
        if(lastFollowerAlias) {
            params.ExclusiveStartKey = {
                followee_handle: followeeAlias,
                follower_handle: lastFollowerAlias
            };
        }
        const data = await this.client.send(new QueryCommand(params));
        const aliases: string[] = data.Items ? data.Items.map(item => item.follower_handle) : [];
        const hasMore = data.LastEvaluatedKey ? true : false;

        const users = await this.batchGetUsers(aliases);
        return {followers: users, hasMore};
    }

    async getFollowStatus(followerAlias: string, followeeAlias: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias
            }
        };
        const data = await this.client.send(new GetCommand(params));
        return !!data.Item;
    }

    async getFolloweeCount(userAlias: string): Promise<number> {
        const user = await this.userDAO.getUserByAliasWithCounts(userAlias);
        return user ? user.followeeCount : 0;
    }

    async getFollowerCount(userAlias: string): Promise<number> {
        const user = await this.userDAO.getUserByAliasWithCounts(userAlias);
        return user ? user.followerCount : 0;
    }

    async follow(followerAlias: string, followeeAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias
            }
        };
        await this.client.send(new PutCommand(params));
        await this.userDAO.incrementFollowee(followerAlias);
        await this.userDAO.incrementFollowers(followeeAlias);
    }

    async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias
            }
        };
        await this.client.send(new DeleteCommand(params));
        await this.userDAO.decrementFollowee(followerAlias);
        await this.userDAO.decrementFollowers(followeeAlias);
    }

    async getAllFollowers(followeeAlias: string): Promise<UserDto[]> {
        const allFollowers: UserDto[] = [];
        let lastFollowerAlias: string | undefined = undefined;
        let hasMore = true;

        while (hasMore) {
            const page = await this.getFollowers(followeeAlias, 25, lastFollowerAlias);
            allFollowers.push(...page.followers);

            if (page.followers.length > 0) {
                lastFollowerAlias = page.followers[page.followers.length - 1].alias;
            }
            hasMore = page.hasMore;
        }
        return allFollowers;
    }

    private async batchGetUsers(aliases: string[]): Promise<UserDto[]> {
        if (aliases.length === 0) {
            return [];
        }
        const keys = aliases.map(alias => ({ alias }));
        const params = {
            RequestItems: {
                "users": {
                    Keys: keys
                }
            }
        };
        const batchResult = await this.client.send(new BatchGetCommand(params));
        const users: UserDto[]  = (batchResult.Responses?.users ?? []).map(u => ({
        alias: u.alias,
        firstName: u.firstName,
        lastName: u.lastName,
        imageUrl: u.imageUrl
            }));

        return users;
    }
}
