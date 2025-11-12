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
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./components/presenter/FolloweePresenter";
import { FollowerPresenter } from "./components/presenter/FollowerPresenter";
import { FeedPresenter } from "./components/presenter/FeedPresenter";
import { StoryPresenter } from "./components/presenter/StoryPresenter";
import ItemScroller, { itemProps } from "./components/mainLayout/ItemScroller";
import { PagedItemView } from "./components/presenter/PagedItemPresenter";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { StatusService } from "./components/modelANDservice/service/StatusService";
import { FollowService } from "./components/modelANDservice/service/FollowService";
import { Status, User } from "tweeter-shared";

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
        element={<ItemScroller<Status, StatusService>
          key ={`feed-${displayedUser!.alias}`}
          presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
           itemComponentGenerator={(itemProp: itemProps<Status>) => {
                const currentItem= itemProp.item;
              return <StatusItem item={currentItem} featureUrl="feed" />}}
        />
        } 
        />
        <Route
         path="story/:displayedUser" 
        element={<ItemScroller<Status, StatusService>
          key={`story-${displayedUser!.alias}`}
           presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
          itemComponentGenerator={(itemProp: itemProps<Status>) => {
                const currentItem= itemProp.item;
              return <StatusItem item={currentItem} featureUrl="story" />}}
        />
        } 
        />
        <Route path="followees/:displayedUser" 
        element={<ItemScroller<User, FollowService>
        key={`followees-${displayedUser!.alias}`}
        presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
        itemComponentGenerator={(itemProp: itemProps<User>) => {
                const currentItem= itemProp.item;
              return <UserItem user={currentItem} featurePath="/followees" />}} 
            />
          }
        />
        <Route path="followers/:displayedUser" 
        element={<ItemScroller<User, FollowService>
        key={`followers-${displayedUser!.alias}`}
        presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
        itemComponentGenerator={(itemProp: itemProps<User>) => {
                const currentItem= itemProp.item;
              return <UserItem user={currentItem} featurePath="/followers" />}} 
            />
          }
        />
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
