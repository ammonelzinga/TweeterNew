import { authenticationDAOInterface } from "../dao/DAOinterfaces/authenticationDAOInterface";
import { followDAOInterface } from "../dao/DAOinterfaces/followDAOInterface";
import { DynamoAuthDAO } from "../dao/dynamodb/DynamoAuthDAO";
import { DynamoFollowDAO } from "../dao/dynamodb/DynamoFollowDAO";
import { DynamoStatusDAO } from "../dao/dynamodb/DynamoStatusDAO";
import { DynamoUserDAO } from "../dao/dynamodb/DynamoUserDAO";
import { S3ProfileImageDAO } from "../dao/s3/S3ProfileImageDAO";
import { abstractFactoryInterface } from "./abstractFactoryInterface";



export class dynamoFactory implements abstractFactoryInterface {
    createUserDAO() {
        return new DynamoUserDAO();
    }
    createAuthenticationDAO(): DynamoAuthDAO {
        return new DynamoAuthDAO();
    }
    createFollowDAO(): DynamoFollowDAO {
        return new DynamoFollowDAO();       
    }
    createProfileImageDAO(): S3ProfileImageDAO {
        return new S3ProfileImageDAO();
    }
    createStatusDAO(): DynamoStatusDAO {
        return new DynamoStatusDAO();
    }

}


