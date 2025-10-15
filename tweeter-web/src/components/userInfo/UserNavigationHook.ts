import { AuthToken, User } from "tweeter-shared";

import {useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserNavigationPresenterView, UserNavigationPresenter } from "../presenter/UserNavigationPresenter";


interface UserNavigation {
    navigateToUser: (
        event: React.MouseEvent,
        featurePath: string
    ) => Promise<void>;
    extractAlias: (
        value: string
    ) => string;
    getUser: (
        authToken: AuthToken,
        alias: string
    ) => Promise<User | null>;
}

const useUserNavigationHook= (): UserNavigation =>{

    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();

     const listener: UserNavigationPresenterView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage, 
      navigate: navigate
    }
    const presenter = new UserNavigationPresenter(listener);

    const extractAlias = (value: string): string => {
          return presenter.extractAlias(value);
        };
      
        const getUser = async (
          authToken: AuthToken,
          alias: string
        ): Promise<User | null> => {
          return presenter.getUser(authToken, alias);
        };

    return {
    navigateToUser : async (event: React.MouseEvent, featurePath: string): Promise<void> => {
    presenter.navigateToUser(event, authToken!, displayedUser!, featurePath);
  },
    
      extractAlias : extractAlias,
    
       getUser : getUser,

    };
};

export default useUserNavigationHook;

