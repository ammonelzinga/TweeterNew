
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserItemPresenter, UserItemView } from "../presenter/UserItemPresenter";

export const PAGE_SIZE = 10;


interface Props {
  featureUrl: string;
  presenterGenerator: (view: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {

  const {displayErrorMessage} = useMessageActions();
  const [items, setItems] = useState<User[]>([]);
  const [newItems, setNewItems] = useState<User[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: UserItemView = {
    addItems: (newItems: User[]) =>
      setNewItems(newItems), 
    displayErrorMessage: displayErrorMessage 

  }

  const presenter = useRef<UserItemPresenter | null>(null)
  if(!presenter.current) {
    presenter.current = props.presenterGenerator(listener);
  }
  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
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
  }, [displayedUser]);

    // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if(changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if(newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems])

   const reset = async () => {
    setItems([]);
    setNewItems([]);
   
    setChangedDisplayedUser(true);

    presenter.current!.reset();
  }

  

  const loadMoreItems = async () => {
    presenter.current!.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
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
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem user={item} featurePath={props.featureUrl} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
