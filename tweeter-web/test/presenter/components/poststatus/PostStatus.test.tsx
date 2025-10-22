import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import {render, screen} from "@testing-library/react"
import {userEvent} from "@testing-library/user-event";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {anything, instance, mock, verify} from "@typestrong/ts-mockito";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../src/components/presenter/LoginPresenter";
import { useUserInfo } from "../../../../src/components/userInfo/UserInfoHooks";
import { User, AuthToken } from "tweeter-shared";
import { PostStatusPresenter } from "../../../../src/components/presenter/PostStatusPresenter";

library.add(fab);

jest.mock("../../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));      



describe("Login Component", () => {
    let mockUserInstance: User;
    let mockAuthTokenInstance: AuthToken;
    beforeAll(() => {
        const mockUser = mock<User>();
        mockUserInstance = instance(mockUser);
        const mockAuthToken = mock<AuthToken>();
        mockAuthTokenInstance = instance(mockAuthToken);
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
            });      
    });
        
        
    it("starts with the Post Status and Clear buttons disabled", () => {
        // Test implementation goes here
        const {postButton, clearButton} = renderPostStatusAndGetElement();
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("enables the Post status and Clear buttons when post box is filled", async () => {
        const {postButton, clearButton} = await writeStatus();
        expect(postButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("disables the Post status and Clear buttons when post box is cleared", async () => {
        const {user, postButton, clearButton, statusTextArea} = await writeStatus();
        expect(postButton).toBeEnabled();
        await user.clear(statusTextArea);
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    //event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken
    it("calls the presenter's postStatus method with correct parameters when the Post status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const postText = "Hello, world!";
        

        const {user, postButton, clearButton, statusTextArea} = renderPostStatusAndGetElement(mockPresenterInstance);
        await user.type(statusTextArea, postText);
        await user.click(postButton);
        verify(mockPresenter.submitPost(anything(), postText, mockUserInstance, mockAuthTokenInstance)).once();
    });

});

function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? <PostStatus presenterArg={presenter} /> : <PostStatus />}
        </MemoryRouter>
    );

}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postButton = screen.getByRole("button", {name: /Post Status/i});
    const clearButton = screen.getByRole("button", {name: /Clear/i});
    const statusTextArea = screen.getByLabelText("post status text area");

    return {user, postButton, clearButton, statusTextArea};
}

async function writeStatus(){
    const {user, postButton, clearButton, statusTextArea} = renderPostStatusAndGetElement();
    await user.type(statusTextArea, "Hello World");
    return {user, postButton, clearButton, statusTextArea};
}