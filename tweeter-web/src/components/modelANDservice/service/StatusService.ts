import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService{
    private serverFacade = new ServerFacade();
    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        let currentStatusDto: StatusDto | null = null;
                if(lastItem != null){
                  currentStatusDto = lastItem.dto;
                }
                const pagedItemRequest = 
                {
                  token: authToken.token,
                  userAlias: userAlias,
                  pageSize: pageSize,
                  lastItem: currentStatusDto
                }
                // TODO: Replace with the result of calling server
          return this.serverFacade.getMoreStoryItems(pagedItemRequest);
      };
  
      public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        let currentStatusDto: StatusDto | null = null;
                if(lastItem != null){
                  currentStatusDto = lastItem.dto;
                }
                const pagedItemRequest = 
                {
                  token: authToken.token,
                  userAlias: userAlias,
                  pageSize: pageSize,
                  lastItem: currentStatusDto
                }
                // TODO: Replace with the result of calling server
          return this.serverFacade.getMoreFeedItems(pagedItemRequest);
      };

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
        let statusDto: StatusDto | null = null;
        if(newStatus != null){
          statusDto = newStatus.dto;
        }
        const PostItemRequest = 
                {
                  token: authToken.token,
                  userAlias: "unessecary",
                  item: statusDto
                }
                // TODO: Replace with the result of calling server
          return this.serverFacade.postStatus(PostItemRequest);
      };
}