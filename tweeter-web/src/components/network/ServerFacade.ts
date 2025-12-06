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
      return this.getMorePagedItems<UserDto, User>(request, "/followee/list", this.convertUserDto, "followees");
    }


    public async getMoreFollowers(
      request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
      return this.getMorePagedItems<UserDto, User>(request, "/follower/list", this.convertUserDto,"followers");
    }


    public async getMoreFeedItems(
      request: PagedItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
      return this.getMorePagedItems<StatusDto, Status>(request, "/feed/list", this.convertStatusDto,"feed items");
    }


    public async getMoreStoryItems(
      request: PagedItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
      return this.getMorePagedItems<StatusDto, Status>(request,"/story/list",this.convertStatusDto,"story items");
    }

    private async getMorePagedItems<Tdto, Titem>(
      request: PagedItemRequest<Tdto>,
      url: string,
      convertFunction: (response: PagedItemResponse<Tdto>) => Titem[] | null,
      description: string
    ): Promise<[Titem[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedItemRequest<Tdto>,
        PagedItemResponse<Tdto>
      >(request, url);

      const items: Titem[] | null = convertFunction(response); 
      return this.handleItemError(response, items, description);
    }


    public async getFolloweeCount(request: TweeterRequest): Promise<number> {
      return this.getCount(request, "/followee/count", "followee");
    }


    public async getFollowerCount(request: TweeterRequest): Promise<number> {
      return this.getCount(request, "/follower/count", "follower");
    }

    private async getCount(request: TweeterRequest, url: string, description: string): Promise<number> {
      const response = await this.clientCommunicator.doPost<TweeterRequest,NumberResponse>(request, url);
      const count: number | null = response.count;
      if (response.success) {
        if (count == null) {
          throw new Error(`No ${description} count`);
        } else {
            return count;
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? `Error getting ${description} count`);
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



    public async follow(request: UserPairRequest): Promise<void> {
      return this.followORunfollow(request,"/follower/follow","follow");
    }

    public async unfollow(request: UserPairRequest): Promise<void> {
      return this.followORunfollow(request,"/follower/unfollow","unfollow");
    }

    private async followORunfollow(request: UserPairRequest,url: string,description: string): Promise<void> {
      const response = await this.clientCommunicator.doPost<UserPairRequest, NumberResponse>(request, url);

      if(!response.success){
        console.error(response);
        throw new Error(response.message ?? `Error during ${description}`);
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
      request: RegisterRequest): Promise<[User, string]> {
      return this.doAuthRequest<RegisterRequest, AuthenticateResponse>(request,"/user/register", "registration. Try a different alias or login.");
    }

    public async login(
      request: LoginRequest): Promise<[User, string]> {
      return this.doAuthRequest<LoginRequest, AuthenticateResponse>(request,"/user/login", "login. Try double checking your alias and password");
    }

    private async doAuthRequest<Trequest extends TweeterRequest, Tresponse extends AuthenticateResponse>
    (request: Trequest, url: string, description: string): Promise<[User, string]>{
      const response = await this.clientCommunicator.doPost<Trequest, Tresponse>(request, url);
      const user: User | null =
        response.success && response.userDto
          ? User.fromDto(response.userDto)
          : null;
      if (response.success) {
        if (user == null) {
          throw new Error(`No user found`);
        } else {
          return [user, response.token];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? `Error during ${description}`);
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