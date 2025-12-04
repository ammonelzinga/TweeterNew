import { AuthToken } from "tweeter-shared";
import { authenticationDAOInterface } from "../../dao/DAOinterfaces/authenticationDAOInterface";


export class AuthenticationService {
    private SESSION_TIME = 1000 * 60 * 10; // 10 minutes

    constructor(private authoDAO: authenticationDAOInterface) {}
    
    async isAuthorized(tokenString: string, userAlias: string): Promise<boolean> {
        const authToken = await this.authoDAO.getAuthToken(tokenString, userAlias);
        if (!authToken) {
            throw new Error("Invalid auth token");
        }

        const currentTime = Date.now();
        if (currentTime - authToken.timestamp > this.SESSION_TIME) {
            await this.authoDAO.deleteAuthToken(tokenString);
            throw new Error("Auth token has expired");
        }

        await this.authoDAO.updateAuthTimestamp(tokenString);
        return true; 
    }

    async createAuthToken(userAlias: string): Promise<string> {
        const authToken = AuthToken.Generate();
        await this.authoDAO.putAuthToken(authToken, userAlias);
        return authToken.token;
    }

    async deleteAuthToken(tokenString: string): Promise<void> {
        await this.authoDAO.deleteAuthToken(tokenString);
    }
}
