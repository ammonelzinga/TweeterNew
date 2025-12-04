import {AuthToken} from "tweeter-shared";

export interface authenticationDAOInterface {
    putAuthToken(token: AuthToken, userAlias: string): Promise<void>;
    getAuthToken(tokenString: string, userAlias: string): Promise<AuthToken | null>;
    deleteAuthToken(tokenString: string): Promise<void>;
    updateAuthTimestamp(tokenString: string): Promise<void>;

}