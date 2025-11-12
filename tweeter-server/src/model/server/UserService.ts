import { Buffer } from "buffer";
import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";

export class UserService{
    
      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string,
        imageFileExtension: string
      ): Promise<[UserDto, string]>{
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        /*const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");*/
          //convert imageStringBase64 to userImageBytes Uint8array??
    
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid registration");
        }

        const userDto = user.dto;
    
        return [userDto, FakeData.instance.authToken.token];
      };


      public async login(
        alias: string,
        password: string
      ): Promise<[UserDto, string]>{
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
        const userDto = user.dto;
        return [userDto, FakeData.instance.authToken.token];
      };


      public async logout (token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        //await new Promise((res) => setTimeout(res, 1000));
      };


      public async getUser (
        token: string,
        alias: string
      ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
        const user = FakeData.instance.findUserByAlias(alias);
        if(user === null){
            throw new Error("User not found");
        }
        return user.dto;
      };


      
}