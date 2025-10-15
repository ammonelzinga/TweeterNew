import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { Buffer } from "buffer";



export interface RegisterView{
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void, 
      navigate: (location: string) => void,
      setImageUrl: (url: string) => void
}

export class RegisterPresenter{
    private _view: RegisterView;
    private userService: UserService;
    private _isLoading = false;
    private _userImageBytes: Uint8Array;
    private _imageFileExtension = "";

    public constructor(view: RegisterView){
        this._view = view;
        this.userService = new UserService();
        this._userImageBytes = new Uint8Array();

    }
    public get userImageBytes(){
      return this._userImageBytes;
    }
    public get view(){
        return this._view;
    }

    public get isLoading(){
        return this._isLoading;
    }
    public set isLoading(value: boolean){
        this._isLoading = value;
    }
    public get imageFileExtension(){
      return this._imageFileExtension;
    }

    public async doRegister (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        rememberMe: boolean){
        
        
        try {
          this._isLoading = true;
    
          const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            this._userImageBytes,
            this.imageFileExtension
          );
    
          this._view.updateUserInfo(user, user, authToken, rememberMe);
          this._view.navigate(`/feed/${user.alias}`);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
        } finally {
          this._isLoading = (false);
        }
      };


      public handleImageFile (file: File | undefined) {
          if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));
      
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const imageStringBase64 = event.target?.result as string;
      
              // Remove unnecessary file metadata from the start of the string.
              const imageStringBase64BufferContents =
                imageStringBase64.split("base64,")[1];
      
              const bytes: Uint8Array = Buffer.from(
                imageStringBase64BufferContents,
                "base64"
              );
      
              this._userImageBytes = bytes;
            };
            reader.readAsDataURL(file);
      
            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
              this._imageFileExtension = (fileExtension);
            }
          } else {
            this.view.setImageUrl("");
            this._userImageBytes = (new Uint8Array());
          }
        };
      
        public getFileExtension = (file: File): string | undefined => {
          return file.name.split(".").pop();
        };
}