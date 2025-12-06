import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  BatchGetCommand
} from "@aws-sdk/lib-dynamodb";
import {User, UserDto} from "tweeter-shared";
import {userDAOInterface} from "../../dao/DAOinterfaces/userDAOInterface";
import * as bcrypt from 'bcryptjs';

export class DynamoUserDAO implements userDAOInterface {
    private readonly tableName = "users";
    private readonly client: DynamoDBDocumentClient;

    constructor(){
        const dynamoClient = new DynamoDBClient({region: "us-west-2"});
        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }
    async registerUser(
        userDto: UserDto, hashedPassword: string, imageUrl?: string): Promise<void> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: {
                alias: userDto.alias,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                hashedPassword: hashedPassword,
                imageUrl: imageUrl || null,
                followerCount: 0,
                followeeCount: 0
            },
            ConditionExpression: "attribute_not_exists(alias)"
        });
        await this.client.send(command);
    }

    async validateUserCredentials(
        userAlias: string,
        hashedPassword: string
    ): Promise<{user: UserDto | null, isValid: boolean}> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: {alias: userAlias}
        });
        const response = await this.client.send(command);
        if (!response.Item) {
            return {user: null, isValid: false};
        }
        const user = {
            alias: response.Item.alias,
            firstName: response.Item.firstName,
            lastName: response.Item.lastName,
            imageUrl: response.Item.imageUrl || undefined
        }

        const isValid = await bcrypt.compare(hashedPassword, response.Item.hashedPassword);
        return {user, isValid};
    }

    async getUserByAlias(userAlias: string): Promise<UserDto | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: {alias: userAlias}
        });
        const response = await this.client.send(command);
        if (!response.Item) {
            return null;
        }
        return {
            alias: response.Item.alias,
            firstName: response.Item.firstName,
            lastName: response.Item.lastName,
            imageUrl: response.Item.imageUrl || undefined
        };
    }

    async getUserByAliasWithCounts(
        userAlias: string
    ): Promise<any> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: {alias: userAlias}
        });
        console.log("Getting user with counts for alias: " + userAlias);
        const response = await this.client.send(command);
        if (!response.Item) {
            return null;
        }
        return response.Item;
    }

    async incrementFollowers(alias: string): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: {alias: alias},
            UpdateExpression: "set followerCount = if_not_exists(followerCount, :start) + :inc",
            ExpressionAttributeValues: {
                ":inc": 1,
                ":start": 0
            }
        });
        await this.client.send(command);
    }  
    async decrementFollowers(alias: string): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,    
            Key: {alias: alias},
            UpdateExpression: "set followerCount = if_not_exists(followerCount, :start) - :dec",
            ExpressionAttributeValues: {
                ":dec": 1,
                ":start": 0
            }
        });
        await this.client.send(command);
    }
    async incrementFollowee(alias: string): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: {alias: alias},
            UpdateExpression: "set followeeCount = if_not_exists(followeeCount, :start) + :inc",
            ExpressionAttributeValues: {
                ":inc": 1,
                ":start": 0
            }
        });
        await this.client.send(command);
    }
    async decrementFollowee(alias: string): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,    
            Key: {alias: alias},
            UpdateExpression: "set followeeCount = if_not_exists(followeeCount, :start) - :dec",
            ExpressionAttributeValues: {
                ":dec": 1,
                ":start": 0
            }
        });
        await this.client.send(command);
    }

    async batchGetUsers(aliases: string[]): Promise<UserDto[]> {
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