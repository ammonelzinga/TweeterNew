import {authenticationDAOInterface} from "../../dao/DAOinterfaces/authenticationDAOInterface";
import {AuthToken} from "tweeter-shared";
import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

export class DynamoAuthDAO implements authenticationDAOInterface {

    private readonly tableName = "auth_tokens";
    private readonly client: DynamoDBDocumentClient;

    constructor(){
        const dynamoClient = new DynamoDBClient({region: "us-west-2"});
        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }
    async putAuthToken(token: AuthToken, userAlias: string): Promise<void> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: {
                "token": token.token,
                "userAlias": userAlias,
                "timestamp": token.timestamp
            }
        });
        await this.client.send(command);
    }

    async getAuthToken(tokenString: string, userAlias: string): Promise<AuthToken | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: {token: tokenString}
        });

        const response = await this.client.send(command);
        if (!response.Item || response.Item.userAlias !== userAlias) {
            return null;
        }

        return new AuthToken(response.Item.token , Number(response.Item.timestamp));
    }

    async deleteAuthToken(tokenString: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: {token: tokenString}
        });
        await this.client.send(command);
    }

    //using the #ts stuff in case dynamodb has a timestamp reserved word, seemed like a good idea so stuck with it
    async updateAuthTimestamp(tokenString: string): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: {token: tokenString},
            UpdateExpression: "SET #ts = :newTimestamp",
            ExpressionAttributeNames: {
                "#ts": "timestamp"
            },
            ExpressionAttributeValues: {
                ":newTimestamp": Date.now()
            }
        });
        await this.client.send(command);
    }
}