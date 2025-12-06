import { Buffer } from "buffer";
import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { userDAOInterface } from "../../dao/DAOinterfaces/userDAOInterface";
import { authenticationDAOInterface } from "../../dao/DAOinterfaces/authenticationDAOInterface";
import { profileImageDAOInterface } from "../../dao/DAOinterfaces/profileImageDAOInterface";
import { AuthenticationService } from "./AuthenticationService";

export class UserService{

      private authService: AuthenticationService;
      constructor(
        private userDAO: userDAOInterface,
        private authDAO: authenticationDAOInterface,
        private profileImageDAO: profileImageDAOInterface
      ) {
        this.authService = new AuthenticationService(this.authDAO);
      }
    
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
        const fileName = `${alias}_` + uuid() + '.' + imageFileExtension;
        const imageUrl = await this.profileImageDAO.uploadProfileImage(
            fileName, imageStringBase64
        );
        const user = {
          alias: alias,
          firstName: firstName,
          lastName: lastName,
          password: password,
          imageUrl: imageUrl
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userDAO.registerUser(
            user, hashedPassword, imageUrl
        );
        const authToken = await this.authService.createAuthToken(alias);
        if (!authToken) {
          throw new Error("[Bad Request] Invalid registration");
        }
    
        return [user, authToken];
      };


      public async login(
        alias: string,
        password: string
      ): Promise<[UserDto, string]>{
        // TODO: Replace with the result of calling the server
        
        const {user, isValid} = await this.userDAO.validateUserCredentials(
            alias, password
        );
        if (!isValid || user === null) {
          throw new Error("[Bad Request] Invalid alias or password");
        }
        const authToken = await this.authService.createAuthToken(alias);
        if (!authToken) {
          throw new Error("[Bad Request] Invalid login");
        }
        return [user, authToken];
      };


      public async logout (token: string): Promise<void> {
        this.authService.deleteAuthToken(token);
      };


      public async getUser (
        token: string,
        alias: string
      ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
        const user = await this.userDAO.getUserByAlias(alias);
        if(user === null){
            throw new Error("[Bad Request] User not found");
        }
        return user;
      };

      
}

