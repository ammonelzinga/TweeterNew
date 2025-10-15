import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { To, NavigateOptions } from "react-router-dom";


export interface LoginView{
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, 
    navigate: (to: To, options?: NavigateOptions) => void, 
    displayErrorMessage: (message: string) => void
}

export class LoginPresenter{
    private _isLoading = false;
    private _view: LoginView;
    private userService: UserService;
    public constructor(view: LoginView){
        this._view = view;
        this.userService = new UserService;
    }
    public get view(){
        return this._view;
    }
    public set view(value: LoginView){
        this._view = value;
    }
    public get isLoading(){
        return this._isLoading;
    }
    public set isLoading(value: boolean){
        this._isLoading = value;
    }

    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        try {
          this.isLoading = (true);
    
          const [user, authToken] = await this.userService.login(alias, password);
    
          this._view.updateUserInfo(user, user, authToken, rememberMe);
    
          if (!!originalUrl) {
            this._view.navigate(originalUrl);
          } else {
            this._view.navigate(`/feed/${user.alias}`);
          }
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          this._isLoading = false;
        }
      };
}