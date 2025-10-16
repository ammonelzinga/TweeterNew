import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../modelANDservice/service/UserService";

export interface AuthenticationView extends View{
    updateUserInfo: (currentUser: User,displayedUser: User | null,authToken: AuthToken,remember: boolean) => void, 
    navigate: (location: string) => void,
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView>{
    private _userService: UserService;

    public constructor(view: AuthenticationView){
        super(view);
        this._userService = new UserService();

    }
    protected get userService(){
        return this._userService;
    }

    protected async authenticateThenNavigate (alias: string, password: string, rememberMe: boolean, firstName: string, lastName: string, originalUrl?: string){
        const [user, authToken] = await this.authenticateUser(alias, password, firstName, lastName);
        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.navigate(originalUrl, user);
    }

    protected abstract authenticateUser(alias: string, password: string, firstName: string, lastName: string): Promise<[User, AuthToken]>;

    protected abstract navigate(originalUrl?: string, user?: User): void;

}