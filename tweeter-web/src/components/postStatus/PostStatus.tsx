import "./PostStatus.css";
import { useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PostStatusView, PostStatusPresenter } from "../presenter/PostStatusPresenter";

const PostStatus = () => {
    const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
      await presenter.submitPost(event, post, currentUser!, authToken!);
      setPost("");
  };

  const listener: PostStatusView = {
    displayErrorMessage: displayErrorMessage, 
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage
  }

  const [presenter] = useState(new PostStatusPresenter(listener));
  

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
  <div className={presenter.isLoading ? "loading" : ""}>
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
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
          {presenter.isLoading ? (
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
