import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
  BatchWriteCommandInput,
  QueryCommandInput
} from "@aws-sdk/lib-dynamodb";

import { StatusDto, UserDto } from "tweeter-shared";
import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { statusDAOInterface } from "../../dao/DAOinterfaces/statusDAOInterface";
import { PostSegmentDto } from "tweeter-shared";
import { DynamoFollowDAO } from "./DynamoFollowDAO";

export class DynamoStatusDAO implements statusDAOInterface {
    private readonly storyTable = 'story';
  private readonly feedTable = 'feed';
    private readonly client: DynamoDBDocumentClient;
    private readonly followDAO: DynamoFollowDAO;

    constructor(){
        const dynamoClient = new DynamoDBClient({region: "us-west-2"});
        this.client = DynamoDBDocumentClient.from(dynamoClient);
        this.followDAO = new DynamoFollowDAO();
    }

    async postStatus(status: StatusDto): Promise<void> {

        const timestamp = status.timestamp;

        await this.client.send(new PutCommand({
            TableName: this.storyTable,
            Item: {
                user_alias: status.user.alias,
                timestamp: timestamp,
                post: status.post,
                segments: status.segments
            }
        }));

        const followers = await this.followDAO.getAllFollowers(status.user.alias);
        if (followers.length === 0) {
            return;
        }

        const feedWrites = followers.map(follower => ({
            PutRequest: {
                Item: {
                    user_alias: follower.alias,
                    timestamp: timestamp,
                    post: status.post,
                    user: {
                        alias: status.user.alias,
                        firstName: status.user.firstName,
                        lastName: status.user.lastName,
                        imageUrl: status.user.imageUrl
                    },
                    segments: status.segments
                }
            }
        }));

        const BATCH_SIZE = 25;
        const batches = [];
        for (let i = 0; i < feedWrites.length; i += BATCH_SIZE) {
            batches.push(feedWrites.slice(i, i + BATCH_SIZE));
        }

        for(const batch of batches) {
            await this.client.send(new BatchWriteCommand({
                RequestItems: {
                    [this.feedTable]: batch
                }
            }));    
        }
        
    }

    async getStoryItems(
        userAlias: string,
        limit: number,
        lastStatus? : StatusDto | null): Promise<{statuses: StatusDto[], hasMore: boolean}> {

        const params: QueryCommandInput = {
            TableName: this.storyTable,
            KeyConditionExpression: "user_alias = :ua",
            ExpressionAttributeValues: {
                ":ua": userAlias
            },
            Limit: limit,
            ScanIndexForward: false
        };

        if(lastStatus) {
            params.ExclusiveStartKey = {
                user_alias: userAlias,
                timestamp: lastStatus.timestamp
            };
        }
        const data = await this.client.send(new QueryCommand(params));

        const statuses: StatusDto[] = (data.Items ?? []).map(item => ({
        
            user: item.user as UserDto,
            post: item.post,
            timestamp: item.timestamp,
            segments: item.segments as PostSegmentDto[]
        }));

        return {statuses, hasMore: data.LastEvaluatedKey ? true : false}
    }
    
    async getFeedItems(
        userAlias: string,
        limit: number,
        lastStatus? : StatusDto | null): Promise<{statuses: StatusDto[], hasMore: boolean}> {
            const params: any = {
                TableName: this.feedTable,
                KeyConditionExpression: "user_alias = :ua",
                ExpressionAttributeValues: {
                    ":ua": userAlias
                },
                Limit: limit,
                ScanIndexForward: false
            };

            if(lastStatus) {
                params.ExclusiveStartKey = {
                    user_alias: userAlias,
                    timestamp: lastStatus.timestamp
                };
            }
            const data = await this.client.send(new QueryCommand(params));

            const statuses: StatusDto[] = (data.Items ?? []).map(item => ({
                user: item.user as UserDto,
                post: item.post,
                timestamp: item.timestamp,
                segments: item.segments as PostSegmentDto[]
            }));

            return {statuses, hasMore: data.LastEvaluatedKey ? true : false}
    }

}





