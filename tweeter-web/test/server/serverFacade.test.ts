import { AuthToken, Status, User } from 'tweeter-shared';
import {ServerFacade} from '../../src/components/network/ServerFacade';
import {StatusService} from '../../src/components/modelANDservice/service/StatusService';
import "isomorphic-fetch";

describe("Server Facade tests", () =>{
    let serverFacade: ServerFacade;
    
    beforeAll(() => {
        serverFacade = new ServerFacade();
    })

    test('register a user', async () => {
        const RegisterRequest = {
            token: "unecessary",
            firstName: "firstName",
            lastName: "lastName",
            userAlias:" alias",
            password: "password",
            imageStringBase64: "imageStringBase64",
            imageFileExtension: "imageFileExtension"
          }
          const [user, token] = await serverFacade.register(RegisterRequest);
          expect(user).toBeInstanceOf(User);
          expect(user.firstName).toBe("Allen");
          expect(token).toBeDefined;
    })

    test('get Followers', async () => {
        const request = {
                "token": "value1",
                "userAlias": "value2",
                "pageSize": 10,
                "lastItem": null
              }
          const [userList, lastItem] = await serverFacade.getMoreFollowers(request);
          for(const user of userList){
            expect(user).toBeInstanceOf(User);
            expect(user.firstName).toBeDefined;
          }
    })


    test('get Follower and Followee Count', async () => {
        const TweeterRequest = 
        {
          token: "value1",
          userAlias: "@Allen",
        }
        const count = await serverFacade.getFollowerCount(TweeterRequest);
        expect(count).toBeGreaterThan(0);
        const countTwo = await serverFacade.getFollowerCount(TweeterRequest);
        expect(countTwo).toBeGreaterThan(0);
    })


});


describe("Status Service tests", () =>{
    let statusService: StatusService;
    
    beforeAll(() => {
        statusService = new StatusService();
    })


    test('get Status from Status Service', async () => {
        const [statusList, hasMore] = await statusService.loadMoreFeedItems(new AuthToken("123", Date.now()), "@Allen", 10, null);
        
        expect(hasMore).toBe(true);
        for(const status of statusList){
            expect(status).toBeInstanceOf(Status);
            expect(status.post).toBeDefined;
        }
    })
    
});
