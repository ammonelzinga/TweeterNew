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

        const followees = await this.userDAO.batchGetUsers(aliases);
        const followeesByAlias = new Map(followees.map(user => [user.alias, user]));
        const orderedFollowees = aliases.map(alias => followeesByAlias.get(alias)!).filter(Boolean);
        return {followees: orderedFollowees, hasMore};
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

        const users = await this.userDAO.batchGetUsers(aliases);
        const usersByAlias = new Map(users.map(user => [user.alias, user]));
        const orderedUsers = aliases.map(alias => usersByAlias.get(alias)!).filter(Boolean);
    
        return {followers: orderedUsers, hasMore};
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
        console.log("Getting followee count for " + userAlias);
        const user = await this.userDAO.getUserByAliasWithCounts(userAlias);
        return user ? user.followeeCount : 0;
    }

    async getFollowerCount(userAlias: string): Promise<number> {
        console.log("Getting follower count for " + userAlias);
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

    //async generator version for the sqs hopefully rcu will be okay and stop erroring out
        async *getFollowersPaginated(followeeAlias: string, batchSize: number = 25)  {
            let lastKey: {follower_handle: string; followee_handle:string} | undefined = undefined;
            let hasMore = true;
            while (hasMore) {
                const params: any = {
                    TableName: this.tableName,
                    IndexName: this.followTableIndex,
                    KeyConditionExpression: "followee_handle = :f",
                    ExpressionAttributeValues: {
                        ":f": followeeAlias
                    },
                    Limit: batchSize,
                    ExclusiveStartKey: lastKey,
                };

                const result = await this.client.send(new QueryCommand(params));
                const followers: UserDto[] = (result.Items || []).map(item => ({
                    alias: item.follower_handle,
                    firstName: item.firstName || "",
                    lastName: item.lastName || "",
                    imageUrl: item.imageUrl || ""
                }));
                yield followers;
                lastKey = result.LastEvaluatedKey as {follower_handle: string; followee_handle:string} | undefined;
                hasMore = !!lastKey;
            }
        }

    
}
