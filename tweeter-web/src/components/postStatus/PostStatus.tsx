import "./PostStatus.css";
import { useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import {PostStatusPresenter, PostStatusView } from "../presenter/PostStatusPresenter";

interface Props {
  presenterArg?: PostStatusPresenter;
}

const PostStatus = ( props: Props) => {
    const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitPost = async (event: React.MouseEvent) => {
    setIsLoading(true);
    event.preventDefault();
      await presenter.submitPost(event, post, currentUser!, authToken!);
      setIsLoading(false);
      setPost("");
  };

    const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const listener: PostStatusView = {
    displayErrorMessage: displayErrorMessage, 
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    clearPost: clearPost
  }

  const [presenter] = useState(props.presenterArg?? new PostStatusPresenter(listener));



  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
  <div className={isLoading ? "loading" : ""}>
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="post status text area"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
           onClick={(event) => submitPost(event)}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={(event) => clearPost(event)}
        >
          Clear
        </button>
      </div>
    </form>
  </div>
  );
};

export default PostStatus;
