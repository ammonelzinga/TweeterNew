import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../modelANDservice/service/UserService";


export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<PagedItemView<T>>{
    private _service: U;
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;
    private userService: UserService = new UserService();

    public constructor(view: PagedItemView<T>){
        super(view);
        this._service = this.createService();
    }

    protected abstract createService(): U;

    protected get service(){
        return this._service;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    protected get lastItem(): T | null {
        return this._lastItem;
    }

    protected set lastItem(item: T | null){
        this._lastItem = item;
    }

    public reset(){
        this.lastItem = (null);
        this.hasMoreItems = (true);
    }

     public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    }

    public async loadMoreItems (authToken: AuthToken, user: User){
            this.doFailureReportingOperation(async () => {
                if(this.hasMoreItems){
                const [newItems, hasMoreItems] = await this.getMoreItems(
                  authToken,
                  user
                );
                this.hasMoreItems = hasMoreItems;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
              }
            }, this.getItemDescription());
          };
    
    protected abstract getMoreItems(authToken: AuthToken, user: User): Promise<[T[], boolean]>;

    protected abstract getItemDescription(): string;
}