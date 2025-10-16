import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationPresenterView extends View{
    setDisplayedUser: (user: User) => void,
    navigate: (location: string) => void
}

export class UserNavigationPresenter extends Presenter<UserNavigationPresenterView> {

    private userService: UserService;
    public constructor(view: UserNavigationPresenterView){
        super(view);
        this.userService = new UserService;
    }
    public extractAlias (value: string): string{
        const index = value.indexOf("@");
        return value.substring(index);
      };

    public async getUser (
                authToken: AuthToken,
                alias: string
              ): Promise<User | null> {
                return this.userService.getUser(authToken, alias);
              };

    public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User, featurePath: string): Promise<void> {
        event.preventDefault();
        this.doFailureReportingOperation(async () => {
          const alias = this.extractAlias(event.target.toString());
          const toUser = await this.userService.getUser(authToken!, alias);
          if (toUser) {
          if (!toUser.equals(currentUser!)) {
           this.view.setDisplayedUser(toUser);
           this.view.navigate(`${featurePath}/${toUser.alias}`);
          } else {
            this.view.setDisplayedUser(currentUser!);
          }
         }
        }, "get user");
      }
}