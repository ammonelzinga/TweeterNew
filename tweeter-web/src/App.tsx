import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { UserItemView } from "./components/presenter/UserItemPresenter";
import { FolloweePresenter } from "./components/presenter/FolloweePresenter";
import { FollowerPresenter } from "./components/presenter/FollowerPresenter";
import { FeedPresenter } from "./components/presenter/FeedPresenter";
import { StatusItemView } from "./components/presenter/StatusItemPresenter";
import { StoryPresenter } from "./components/presenter/StoryPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" 
        element={<StatusItemScroller
          key ={`feed-${displayedUser!.alias}`}
          presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
          //loadItems={loadMoreFeedItems}
          //itemDescription="feed"
          featureUrl="feed"
        />} />
        <Route path="story/:displayedUser" 
        element={<StatusItemScroller
          key={`story-${displayedUser!.alias}`}
           presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
          //loadItems={loadMoreStoryItems}
          //itemDescription="story"
          featureUrl="story" 
        />} />
        <Route path="followees/:displayedUser" 
        element={<UserItemScroller 
        key={`followees-${displayedUser!.alias}`}
        presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
        //loadItems={loadMoreFollowees} 
        //itemDescription="followees" 
        featureUrl="/followees" />} />
        <Route path="followers/:displayedUser" 
        element={<UserItemScroller
        key={`followers-${displayedUser!.alias}`}
         presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
        //loadItems={loadMoreFollowers} 
        //itemDescription="followers" 
        featureUrl="/followers" />} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
