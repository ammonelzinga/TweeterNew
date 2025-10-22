import {AuthToken} from "tweeter-shared";
import { UserService } from "../../src/components/modelANDservice/service/UserService";
import { LogoutPresenter } from "../../src/components/presenter/LogoutPresenter";
import { LogoutView } from "../../src/components/presenter/LogoutPresenter";
import { anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
describe("LogoutPresenter", () => {
    let mockLogoutView: LogoutView;
    let logoutPresenter: LogoutPresenter;
    let mockService: UserService;

    const authToken = new AuthToken("abc123", Date.now());
    beforeEach(() => {
        mockLogoutView = mock<LogoutView>();
        const mockLogoutViewInstance = instance(mockLogoutView);
        when(mockLogoutView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

        const logoutPresenterSpy = spy(new LogoutPresenter(mockLogoutViewInstance));
        logoutPresenter = instance(logoutPresenterSpy);

        mockService = mock<UserService>();
        when(logoutPresenterSpy.service).thenReturn(instance(mockService));
    })

    it("tells the view to display a logout message", async () => {
        await logoutPresenter.logOut(authToken);
        verify(mockLogoutView.displayInfoMessage("Logging Out...", 0)).once();
})
    it("calls logout on the user service with the correct auth token", async () => {
        await logoutPresenter.logOut(authToken);
        verify(mockService.logout(authToken)).once();
})

    it("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page when successful", async () => {
        await logoutPresenter.logOut(authToken);
        verify(mockLogoutView.deleteMessage("messageId123")).once();
        verify(mockLogoutView.clearUserInfo()).once();
        verify(mockLogoutView.navigate("/login")).once();

        verify(mockLogoutView.displayErrorMessage(anything())).never();
    })

    it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful"
        , async() => {
            let error = new Error("An error occurred");
            when(mockService.logout(anything())).thenThrow(error);
            await logoutPresenter.logOut(authToken);
            verify(mockLogoutView.displayErrorMessage(`Failed to log user out because of exception: Error: An error occurred`)).once();

            verify(mockLogoutView.deleteMessage(anything())).never();
            verify(mockLogoutView.clearUserInfo()).never();
            verify(mockLogoutView.navigate("/login")).never();
        }
    )

});