import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields  from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../presenter/LoginPresenter";
import {AuthenticationView} from "../../presenter/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const[isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
    const { displayErrorMessage} = useMessageActions();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };
const listener: AuthenticationView = {
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage
  }

 const presenterRef = useRef<LoginPresenter | null>(null);
 if (!presenterRef.current) {
    presenterRef.current = props.presenter ?? new LoginPresenter(listener);
 }

  //Create a new presenter whenver 'remeberMe' is updated so it will have a listener witht the correct 'rememberMe' value
  useEffect(() => {
    presenterRef.current = props.presenter ?? new LoginPresenter(listener);
  }, [rememberMe]);

  const doLogin = async () => {
     setIsLoading(true);
    await presenterRef.current?.doLogin(alias, password, rememberMe, props.originalUrl);
    setIsLoading(false);
  };

  const inputFieldFactory = () => {
    return (
      <>
         <AuthenticationFields
         authenticationFunction = {loginOnEnter}
         alias = {alias}
        setAlias = {setAlias}
        setPassword = {setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
