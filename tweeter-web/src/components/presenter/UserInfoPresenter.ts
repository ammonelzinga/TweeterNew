import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../modelANDservice/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView{
    setDisplayedUser: (user: User) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView>{
    private _isFollower = false;
    private _isFollowee = false;
    private _followeeCount = 0;
    private _followerCount = 0;
    private followService = new FollowService();
    private _isLoading: boolean = false;

    public constructor(view: UserInfoView){
        super(view);
    }

    public get isLoading(){
        return this._isLoading;
    }
    public set isLoading(value: boolean){
        this._isLoading = value;
    }

    public get isFollower(){
        return this._isFollower;
    }

    public get isFollowee(){
        return this._isFollowee;
    }
    public get followeeCount(){
        return this._followeeCount;
    }
    public get followerCount(){
        return this._followerCount;
    }

    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => { 
          if (currentUser === displayedUser) {
          this._isFollower = (false);
        } else {
          this._isFollower = (
            await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }
        this.view.setDisplayedUser(displayedUser);}, "determine follower status");
      };
    
      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => {
          this._followeeCount = (await this.followService.getFolloweeCount(authToken, displayedUser));
        this.view.setDisplayedUser(displayedUser);}, "get followees count");   
      };
    
    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
      ){
        this.doFailureReportingOperation(async () => {
          this._followerCount = (await this.followService.getFollowerCount(authToken, displayedUser));
        this.view.setDisplayedUser(displayedUser);}, "get followers count");      
      };
    
      public async followDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
        
        this.doFailureReportingOperation(async () => {
          const toastId = this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 2000);
          const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
          );
    
          this._isFollower = (true);
          this._followerCount =(followerCount);
          this._followeeCount = (followeeCount);
        this.view.setDisplayedUser(displayedUser);
       this.view.deleteMessage(toastId);}, "follow user");
       
      };
    
    
      public async unfollowDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
        
        this.doFailureReportingOperation(async () => {
          const toastId = this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`, 2000);
          const [followerCount, followeeCount] = await this.followService.unfollow(authToken!,displayedUser!
          );
          this._isFollower = (false);
          this._followerCount = (followerCount);
          this._followeeCount = (followeeCount);
        this.view.setDisplayedUser(displayedUser);
      this.view.deleteMessage(toastId);}, "unfollow user");
        
      };



}