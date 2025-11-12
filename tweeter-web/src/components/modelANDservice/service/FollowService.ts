import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService{
    private serverFacade = new ServerFacade();
     public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        let currentUserDto: UserDto | null = null;
        if(lastItem != null){
          currentUserDto = lastItem.dto;
        }
        const pagedItemRequest = 
        {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: currentUserDto
        }
        // TODO: Replace with the result of calling server
        return this.serverFacade.getMoreFollowers(pagedItemRequest);
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        let currentUserDto: UserDto | null = null;
        if(lastItem != null){
          currentUserDto = lastItem.dto;
        }
        const pagedItemRequest = 
        {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: currentUserDto
        }
        //console.log("Last Item", lastItem?.firstName);
        return this.serverFacade.getMoreFollowees(pagedItemRequest);
      };

      public async getIsFollowerStatus (
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        const UserPairRequest = 
        {
          token: authToken.token,
          userAlias: user.alias,
          selectedUserAlias: selectedUser.alias
        }
        return this.serverFacade.getIsFollowerStatus(UserPairRequest);
      };


      public async getFolloweeCount (
        authToken: AuthToken,
        user: User,
      ): Promise<number> {
        const TweeterRequest = 
        {
          token: authToken.token,
          userAlias: user.alias,
        }
        return this.serverFacade.getFolloweeCount(TweeterRequest);
      };


      public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        const TweeterRequest = 
        {
          token: authToken.token,
          userAlias: user.alias,
        }
        return this.serverFacade.getFollowerCount(TweeterRequest);
      };


      public async follow (
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        const UserPairRequest = 
        {
          token: authToken.token,
          userAlias: "ISthisNECESSARY",
          selectedUserAlias: userToFollow.alias
        }

        await this.serverFacade.follow(UserPairRequest);

        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
    
        return [followerCount, followeeCount];
      };



      public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));
    
        const UserPairRequest = 
        {
          token: authToken.token,
          userAlias: "ISthisNECESSARY",
          selectedUserAlias: userToUnfollow.alias
        }

        await this.serverFacade.unfollow(UserPairRequest);

        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
    
        return [followerCount, followeeCount];
      };
}