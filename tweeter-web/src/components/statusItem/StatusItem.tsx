import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import {Status } from "tweeter-shared";
import useUserNavigationHook from "../userInfo/UserNavigationHook";

interface Props {
  item: Status;
  featureUrl: string;
}

const StatusItem = (props: Props) => {
  const {navigateToUser} = useUserNavigationHook();

  return (
    <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={props.item.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {props.item.user.firstName} {props.item.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={`/${props.featureUrl}/${props.item.user.alias}`}
                        onClick={(event) => navigateToUser(event, props.featureUrl)}
                      >
                        {props.item.user.alias}
                      </Link>
                    </h2>
                    {props.item.formattedDate}
                    <br />
                    <Post status={props.item} featurePath={`/${props.featureUrl}`} />
                  </div>
                </div>
              </div>
            </div>
  );
};

export default StatusItem;
