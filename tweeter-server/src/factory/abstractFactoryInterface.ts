import {authenticationDAOInterface} from "../dao/DAOinterfaces/authenticationDAOInterface.js";
import {userDAOInterface} from "../dao/DAOinterfaces/userDAOInterface.js";
import {profileImageDAOInterface} from "../dao/DAOinterfaces/profileImageDAOInterface.js";
import {followDAOInterface} from "../dao/DAOinterfaces/followDAOInterface.js";
import {statusDAOInterface} from "../dao/DAOinterfaces/statusDAOInterface.js";

export interface abstractFactoryInterface {
    createUserDAO(): userDAOInterface;
    createAuthenticationDAO(): authenticationDAOInterface;
    createProfileImageDAO(): profileImageDAOInterface;
    createFollowDAO(): followDAOInterface;
    createStatusDAO(): statusDAOInterface;
}