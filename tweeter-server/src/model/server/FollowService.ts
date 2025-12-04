import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { followDAOInterface } from "../../dao/DAOinterfaces/followDAOInterface";

export class FollowService{
      constructor(
        private followDAO: followDAOInterface
      ) {}

     public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        const {followers, hasMore} = await this.followDAO.getFollowers(userAlias, pageSize, lastItem?.alias);
        return [followers, hasMore];
      };
    
      public async loadMoreFollowees (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        const {followees, hasMore} = await this.followDAO.getFollowees(userAlias, pageSize, lastItem?.alias);
        return [followees, hasMore];
      };

      public async getIsFollowerStatus (
        token: string,
        userAlias: string,
        selectedUserAlias: string
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return this.followDAO.getFollowStatus(userAlias, selectedUserAlias);
      };


      public async getFolloweeCount (
        token: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return this.followDAO.getFolloweeCount(userAlias);
      };


      public async getFollowerCount (
        token: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return this.followDAO.getFollowerCount(userAlias);
      };


      public async follow (
        token: string,
        userToFollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        await this.followDAO.follow(token, userToFollow);
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];
      };



      public async unfollow (
        token: string,
        userToUnfollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        await this.followDAO.unfollow(token, userToUnfollow);
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
      };
}