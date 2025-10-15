import { AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";

export interface LogoutView{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => string,
    deleteMessage:(id: string) => void,
    clearUserInfo:() => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void,
    navigate: (location: string) => void
}


export class LogoutPresenter{
    private userService: UserService;
    private view: LogoutView;
    public constructor(view: LogoutView){
        this.view = view;
        this.userService = new UserService();
    }

    public async logOut (authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
        
        try {
          await this.userService.logout(authToken!);

          this.view.deleteMessage(loggingOutToastId);
          this.view.clearUserInfo();
          this.view.navigate("/login");
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
}