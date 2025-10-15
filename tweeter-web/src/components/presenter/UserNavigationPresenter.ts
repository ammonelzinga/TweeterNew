import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";

export interface UserNavigationPresenterView{
    setDisplayedUser: (user: User) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void,
    navigate: (location: string) => void
}


export class UserNavigationPresenter {

    private view: UserNavigationPresenterView;
    private userService: UserService;
    public constructor(view: UserNavigationPresenterView){
        this.view = view;
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
    
        try {
          const alias = this.extractAlias(event.target.toString());
    
          const toUser = await this.userService.getUser(authToken!, alias);
    
          if (toUser) {
          if (!toUser.equals(currentUser!)) {
           this.view.setDisplayedUser(toUser);
           this.view.navigate(`${featurePath}/${toUser.alias}`);
          }
         }
       } catch (error) {
        this.view.displayErrorMessage(
         `Failed to get user because of exception: ${error}`
       );
    }
      }
}