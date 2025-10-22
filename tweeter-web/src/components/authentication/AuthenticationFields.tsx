
interface Props {
    authenticationFunction: (event: React.KeyboardEvent<HTMLElement>)=>void;
    alias: string;
    setAlias: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const AuthenticationFields = (props: Props) => {
    
    return(
    <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            aria-label="alias"
            placeholder="name@example.com"
            onKeyDown={props.authenticationFunction}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            aria-label="password"
            placeholder="Password"
            onKeyDown={props.authenticationFunction}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
};

export default AuthenticationFields;