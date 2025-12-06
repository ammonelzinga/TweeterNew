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
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        console.log("Getting followee count for " + userAlias);
        return this.followDAO.getFolloweeCount(userAlias);
      };


      public async getFollowerCount (
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        console.log("Getting follower count for " + userAlias);
        return this.followDAO.getFollowerCount(userAlias);
      };


      public async follow (
        currentUserAlias: string,
        userToFollow: string
      ): Promise<void> {
        await this.followDAO.follow(currentUserAlias, userToFollow);
        console.log(currentUserAlias + " followed " + userToFollow);
      };



      public async unfollow (
        currentUserAlias: string,
        userToUnfollow: string
      ): Promise<void> {
        await this.followDAO.unfollow(currentUserAlias, userToUnfollow);

      };
}