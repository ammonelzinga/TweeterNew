import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";

export interface StatusItemView{
    addItems: (newItems: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter{
    private _hasMoreItems = true;
     private userService: UserService;
        private _lastItem: Status | null = null;
        
        private _view: StatusItemView;
    
        protected constructor(view: StatusItemView){
                this._view = view;
                this.userService = new UserService();
            }
        protected get view(){
            return this._view;
        }
        public get hasMoreItems(){
            return this._hasMoreItems;
        }
        protected set hasMoreItems(value: boolean){
            this._hasMoreItems = value;
        }
        protected get lastItem(){
            return this._lastItem;
        }
        protected set lastItem(value: Status | null){
            this._lastItem = value;
        }
        reset() {
            this.lastItem = (null);
            this._hasMoreItems = (true);
        }
        public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
                return this.userService.getUser(authToken, alias);
            }
        public abstract loadMoreItems (authToken: AuthToken, userAlias: string): void; 
}