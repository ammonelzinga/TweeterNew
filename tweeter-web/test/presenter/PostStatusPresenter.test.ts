import {AuthToken, User} from "tweeter-shared";
import { StatusService } from "../../src/components/modelANDservice/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../src/components/presenter/PostStatusPresenter";
import { MessageView } from "../../src/components/presenter/Presenter";
import { anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";


describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;
    let mockedEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>;

    const authToken = new AuthToken("abc123", Date.now());
    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);
        mockService = mock<StatusService>();
        when(postStatusPresenterSpy.statusService).thenReturn(instance(mockService));

        mockedEvent = mock<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
    })

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(mockedEvent, "Hello, world!", new User("first", "last", "alias", "imageUrl"), authToken);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    })
    it("calls postStatus on the status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(mockedEvent, "Hello, world!", new User("first", "last", "alias", "imageUrl"), authToken);
        verify(mockService.postStatus(authToken, anything())).once();
        const statusArg = capture(mockService.postStatus).last()[1]; //this will get the status argument hopefully
        expect(statusArg.post).toEqual("Hello, world!");
    })

    
    it("tells the view to clear the info message that was displayed previously, clears the post, and displays a status posted message when successful", async () => {
        await postStatusPresenter.submitPost(mockedEvent, "Hello, world!", new User("first", "last", "alias", "imageUrl"), authToken);
        verify(mockPostStatusView.deleteMessage("messageId123")).once();
        verify(mockPostStatusView.clearPost(mockedEvent)).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    })

    it("tells the view to clear in the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful"
        , async() => {
            let error = new Error("An error occurred");
            when(mockService.postStatus(anything(), anything())).thenThrow(error);
            await postStatusPresenter.submitPost(mockedEvent, "Hello, world!", new User("first", "last", "alias", "imageUrl"), authToken);
            verify(mockPostStatusView.deleteMessage("messageId123")).once();
            verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: Error: An error occurred`)).once();

            verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
            verify(mockPostStatusView.clearPost(anything())).never();
        }
    )

});