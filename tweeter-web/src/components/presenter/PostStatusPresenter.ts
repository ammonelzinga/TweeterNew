//Assuming that the presenter does not handle checking to see if the post status and clear buttons should be disabled or not
//should isLoading be put in the presenter?

import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../modelANDservice/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView{
    clearPost:(event: React.MouseEvent) => void,
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
    private _statusService: StatusService;
    private _post: string = "";

    public constructor(view: PostStatusView){
        super(view);
        this._statusService = new StatusService();
    }
    public get view(): PostStatusView{
        return super.view as PostStatusView;
    }

    public get statusService(): StatusService {
        return this._statusService;
    }

    public get post(): string {
        return this._post;
    }

    public async submitPost (event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
          event.preventDefault();
          this._post = post;
      this.doFailureReportingOperation(async () => {
        const postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);
          const status = new Status(post, currentUser!, Date.now());
          try {await this.statusService.postStatus(authToken!, status);
          this.view.deleteMessage(postingStatusToastId);
          this.view.clearPost(event);
          this.view.displayInfoMessage("Status posted!", 2000);}
          catch (error){
            this.view.deleteMessage(postingStatusToastId);
            throw error;
          }
        }, "post the status");
          
      };

}