import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter{
     public get view(){
        return super.view as AuthenticationView;
    }

    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        this.doFailureReportingOperation(async () => {
          this.authenticateThenNavigate(alias, password, rememberMe, "", "", originalUrl);
        }, "log user in")  
      };

      protected async authenticateUser(alias: string, password: string): Promise<[User, AuthToken]> {
        return this.userService.login(alias, password);
    }

      protected navigate(originalUrl?: string, user?: User): void {
        if (!!originalUrl) {
            this.view.navigate(originalUrl);
          } else {
            this.view.navigate(`/feed/${user!.alias}`);
          }
    }
}