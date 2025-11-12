import {
  AuthenticateResponse,
  BooleanResponse,
  LoginRequest,
  NumberResponse,
  PagedItemRequest,
    PagedItemResponse,
    PostItemRequest,
    RegisterRequest,
    Status,
    StatusDto,
    TweeterRequest,
    TweeterResponse,
    User,
    UserDto,
    UserPairRequest,
    UserResponse,
  } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator/ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://2wcpnst6z6.execute-api.us-west-2.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    private handleError(response: TweeterResponse){
      console.error(response);
      throw new Error(response.message!);
    }

    private convertUserDto(response: PagedItemResponse<UserDto>): User[] | null{
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
          : null;
      return items;
    }

    private convertStatusDto(response: PagedItemResponse<StatusDto>): Status[] | null{
      const items: Status[] | null =
        response.success && response.items
          ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
          : null;
      return items;
    }

    private handleItemError<t, u>(response: PagedItemResponse<t>, items: u[] | null, itemString: string): [u[], boolean]{
      if (response.success) {
        if (items == null) {
          throw new Error(`No ${itemString} found`);
        } else {
          return [items, response.hasMore];
        }
    }
    else {
      throw this.handleError(response);}
  }
  
  
    public async getMoreFollowees(
      request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedItemRequest<UserDto>,
        PagedItemResponse<UserDto>
      >(request, "/followee/list");
  
      const items: User[] | null = this.convertUserDto(response); 
      return this.handleItemError(response, items, "followees");
    }


    public async getMoreFollowers(
      request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedItemRequest<UserDto>,
        PagedItemResponse<UserDto>
      >(request, "/follower/list");
  
      const items: User[] | null = this.convertUserDto(response); 
      return this.handleItemError(response, items, "followers");
    }


    public async getMoreFeedItems(
      request: PagedItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedItemRequest<StatusDto>,
        PagedItemResponse<StatusDto>
      >(request, "/feed/list");
  
      const items: Status[] | null = this.convertStatusDto(response); 
      return this.handleItemError(response, items, "feed items");
    }


    public async getMoreStoryItems(
      request: PagedItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedItemRequest<StatusDto>,
        PagedItemResponse<StatusDto>
      >(request, "/story/list");
  
      const items: Status[] | null = this.convertStatusDto(response); 
      return this.handleItemError(response, items, "story items");
    }




    public async getFolloweeCount(
      request: TweeterRequest
    ): Promise<number> {
      const response = await this.clientCommunicator.doPost<
        TweeterRequest,
        NumberResponse
      >(request, "/followee/count");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const count: number | null = response.count
      // Handle errors    
      if (response.success) {
        if (count == null) {
          throw new Error(`No followee count`);
        } else {
          return count;
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }


    public async getFollowerCount(
      request: TweeterRequest
    ): Promise<number> {
      const response = await this.clientCommunicator.doPost<
        TweeterRequest,
        NumberResponse
      >(request, "/follower/count");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const count: number | null = response.count;
      // Handle errors    
      if (response.success) {
        if (count == null) {
          throw new Error(`No follower count`);
        } else {
          return count;
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



    public async getIsFollowerStatus(
      request: UserPairRequest
    ): Promise<boolean> {
      const response = await this.clientCommunicator.doPost<
        UserPairRequest,
        BooleanResponse
      >(request, "/follower/status");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const value: boolean | null = response.isTrue;
      // Handle errors    
      if (response.success) {
        if (value == null) {
          throw new Error(`No follower checked`);
        } else {
          return value;
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



    public async follow(
      request: UserPairRequest
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        UserPairRequest,
        NumberResponse
      >(request, "/follower/follow");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      if (response.success) {

      }
     else {
      console.error(response);
      throw new Error(response.message!);
    }
    }



    public async unfollow(
      request: UserPairRequest
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        UserPairRequest,
        NumberResponse
      >(request, "/follower/unfollow");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      // Handle errors    
      if (response.success) {
          
        }
       else {
        console.error(response);
        throw new Error(response.message!);
      }
    }


    public async postStatus(
      request: PostItemRequest<StatusDto>
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        PostItemRequest<StatusDto>,
        TweeterResponse
      >(request, "/story/post");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      // Handle errors    
      if (response.success) {

        }
       else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



    public async register(
      request: RegisterRequest
    ): Promise<[User, string]> {
      const response = await this.clientCommunicator.doPost<
        RegisterRequest,
        AuthenticateResponse
      >(request, "/user/register");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const user: User | null =
        response.success && response.userDto
          ? User.fromDto(response.userDto)
          : null;
      // Handle errors    
      if (response.success) {
        if (user == null) {
          throw new Error(`No user registered`);
        } else {
          return [user, response.token];
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }

    public async login(
      request: LoginRequest
    ): Promise<[User, string]> {
      const response = await this.clientCommunicator.doPost<
        LoginRequest,
        AuthenticateResponse
      >(request, "/user/login");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const user: User | null =
        response.success && response.userDto
          ? User.fromDto(response.userDto)
          : null;
      // Handle errors    
      if (response.success) {
        if (user == null) {
          throw new Error(`No user found`);
        } else {
          return [user, response.token];
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }


    public async logout(
      request: TweeterRequest
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        TweeterRequest,
        TweeterResponse
      >(request, "/user/logout");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      // Handle errors    
      if (response.success) {

      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



    public async getUser(
      request: TweeterRequest
    ): Promise<User> {
      const response = await this.clientCommunicator.doPost<
        TweeterRequest,
        UserResponse
      >(request, "/user/get");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const user: User | null =
        response.success && response.userDto
          ? User.fromDto(response.userDto)
          : null;
      // Handle errors    
      if (response.success) {
        if (user == null) {
          throw new Error(`No user found`);
        } else {
          return user;
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }


  }