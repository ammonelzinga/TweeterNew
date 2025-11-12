import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";

export class FollowService{
     public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };
    
      public async loadMoreFollowees (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);

      };

    private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]>  {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }


      public async getIsFollowerStatus (
        token: string,
        userAlias: string,
        selectedUserAlias: string
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
      };


      public async getFolloweeCount (
        token: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(userAlias);
      };


      public async getFollowerCount (
        token: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(userAlias);
      };


      public async follow (
        token: string,
        userToFollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        //const followerCount = await this.getFollowerCount(token, userToFollow);
        //const followeeCount = await this.getFolloweeCount(token, userToFollow);
        
        //What is Follow supposed to actually return? Just void?
        return [1, 1];
      };



      public async unfollow (
        token: string,
        userToUnfollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        //const followerCount = await this.getFollowerCount(token, userToUnfollow);
        //const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    
        return [1,1];
      };
}