import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";

import { PagedItemPresenter, PagedItemView } from "../presenter/PagedItemPresenter";

export interface itemProps<T>{
    item: T
}

interface Props<T, U> {
  presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>;
  itemComponentGenerator: (item: itemProps<T>) => JSX.Element;
}


const ItemScroller = <T,U>(props: Props<T, U>) => {
  const {displayErrorMessage} = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const { displayedUser: displayedUserAliasParam } = useParams();


   const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) =>
      setItems((prevItems) => [...prevItems, ...newItems]),
    displayErrorMessage: displayErrorMessage 

  }
  const presenter = useRef<PagedItemPresenter<T,U> | null>(null)
  if(!presenter.current) {
    presenter.current = props.presenterGenerator(listener);
  }

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenter.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);


  const reset = async () => {
    setItems(() => []);
    presenter.current!.reset();
  }

 
  
  const loadMoreItems = async () => {
    presenter.current!.loadMoreItems(authToken!, displayedUser!);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item: T, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <props.itemComponentGenerator item = {item}/>

          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
