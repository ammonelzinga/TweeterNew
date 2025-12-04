import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { statusDAOInterface } from "../../dao/DAOinterfaces/statusDAOInterface";

export class StatusService{
      constructor(
        private statusDAO: statusDAOInterface,
      ) {}

    public async loadMoreStoryItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        const {statuses, hasMore} = await this.statusDAO.getStoryItems(userAlias, pageSize, lastItem);
        return [statuses, hasMore];
      };
  
      public async loadMoreFeedItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        const {statuses, hasMore} = await this.statusDAO.getFeedItems(userAlias, pageSize, lastItem);
        return [statuses, hasMore];
      };

      public async postStatus (
        token: string,
        newStatus: StatusDto
      ): Promise<void> {
        await this.statusDAO.postStatus(newStatus);
      };
}