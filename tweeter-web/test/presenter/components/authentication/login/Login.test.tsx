import { MemoryRouter } from "react-router-dom";
import Login from "../../../../../src/components/authentication/login/Login";
import {render, screen} from "@testing-library/react"
import {userEvent} from "@testing-library/user-event";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {instance, mock, verify} from "@typestrong/ts-mockito";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../../src/components/presenter/LoginPresenter";

library.add(fab);
describe("Login Component", () => {
    it("starts with the sign in button disabled", () => {
        // Test implementation goes here
        const {signInButton} = renderLoginAndGetElement("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign in button when both alias and password fields are filled", async () => {
        const {signInButton} = await fillLoginForm();
        expect(signInButton).toBeEnabled();
    });

    it("disables the sign in button if either the alias or the password field is cleared", async () => {
        const {user, signInButton, aliasField, passwordField} = await fillLoginForm();
        expect(signInButton).toBeEnabled();
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
        await user.type(passwordField, "password123");
        expect(signInButton).toBeEnabled();
        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "http://somewhere.com";
        const alias = "testuser";
        const password = "password123";

        const {user, signInButton, aliasField, passwordField} = renderLoginAndGetElement(originalUrl, mockPresenterInstance);
        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);
        verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
    });

});

function renderLogin(originalUrl?: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? <Login originalUrl={originalUrl} presenter={presenter} /> : <Login originalUrl={originalUrl} />}
        </MemoryRouter>
    );

}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", {name: /Sign in/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return {user, signInButton, aliasField, passwordField};
}

async function fillLoginForm(){
        const {user, signInButton, aliasField, passwordField} = renderLoginAndGetElement("/");
        await user.type(aliasField, "testuser");
        await user.type(passwordField, "password123");
        return {user, signInButton, aliasField, passwordField};
}