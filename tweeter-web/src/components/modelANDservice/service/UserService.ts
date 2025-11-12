import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService{
      private serverFacade = new ServerFacade();
      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[User, AuthToken]>{
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
    
        const RegisterRequest = {
          token: "unecessary",
          firstName: firstName,
          lastName: lastName,
          userAlias: alias,
          password: password,
          imageStringBase64: imageStringBase64,
          imageFileExtension: imageFileExtension

        }
        const [user, token] = await this.serverFacade.register(RegisterRequest);
        const tokenAuth = new AuthToken(token, Date.now());
        return [user, tokenAuth];
      };


      public async login(
        alias: string,
        password: string
      ): Promise<[User, AuthToken]>{
        
        const LoginRequest = {
          token: "unecessary",
          userAlias: alias,
          password: password,

        }
        const [user, token] = await this.serverFacade.login(LoginRequest);
        const tokenAuth = new AuthToken(token, Date.now());
        return [user, tokenAuth];
      };


      public async logout (authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        //await new Promise((res) => setTimeout(res, 1000));

        const TweeterRequest = {
          token: authToken.token,
          userAlias: "unecessary"
        }

        await this.serverFacade.logout(TweeterRequest);
      };


      public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        const TweeterRequest = {
          token: authToken.token,
          userAlias: alias,
        }

        const user = await this.serverFacade.getUser(TweeterRequest);
        return user;
      };


      
}