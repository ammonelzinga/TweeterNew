//Assuming that the presenter does not handle checking to see if the post status and clear buttons should be disabled or not
//should isLoading be put in the presenter?

import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../modelANDservice/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export class PostStatusPresenter extends Presenter<MessageView>{
    private statusService: StatusService;

    public constructor(view: MessageView){
        super(view);
        this.statusService = new StatusService();
    }
    public get view(): MessageView{
        return super.view as MessageView;
    }

    public async submitPost (event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
          event.preventDefault();
          
      this.doFailureReportingOperation(async () => {
        const postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);
          const status = new Status(post, currentUser!, Date.now());
          await this.statusService.postStatus(authToken!, status);
          this.view.deleteMessage(postingStatusToastId);
          this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status");
          
      };

}