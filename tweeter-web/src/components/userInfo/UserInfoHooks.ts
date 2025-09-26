import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";

export const useUserInfo = () => useContext(UserInfoContext);
export const useUserInfoActions = () => useContext(UserInfoActionsContext);