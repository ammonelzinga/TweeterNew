//Assuming that the presenter does not handle checking to see if the post status and clear buttons should be disabled or not
//should isLoading be put in the presenter?

import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../modelANDservice/service/StatusService";

export interface PostStatusView{
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string, duration: number) => string,
    deleteMessage: (id: string) => void
}

export class PostStatusPresenter{
    private  _view: PostStatusView;
    private statusService: StatusService;
    private _isLoading: boolean = false;
    public constructor(view: PostStatusView){
        this._view = view;
        this.statusService = new StatusService();
    }
    public get view(){
        return this._view;
    }

    public get isLoading(){
        return this._isLoading;
    }
    public set isLoading(value: boolean){
        this._isLoading = value;
    }

    public async submitPost (event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
        event.preventDefault();
        const postingStatusToastId = this._view.displayInfoMessage("Posting status...", 0);
        try {
          this._isLoading = true;
          
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.statusService.postStatus(authToken!, status);
    
          this._view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        } finally {
          this._view.deleteMessage(postingStatusToastId);
          this._isLoading = false;
        }
      };

}