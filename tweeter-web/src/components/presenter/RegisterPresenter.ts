import { User, AuthToken } from "tweeter-shared";
import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView{
    setImageUrl: (url: string) => void
}

export class RegisterPresenter extends AuthenticationPresenter{
    private _userImageBytes: Uint8Array;
    private _imageFileExtension = "";

    public constructor(view: RegisterView){
        super(view);
        this._userImageBytes = new Uint8Array();

    }
    public get userImageBytes(){
      return this._userImageBytes;
    }
      public get view() : RegisterView{
        return super.view as RegisterView;
    }

    public get imageFileExtension(){
      return this._imageFileExtension;
    }

    public async doRegister (firstName: string, lastName: string, alias: string,password: string, rememberMe: boolean){
        
       this.doFailureReportingOperation(async () => {
            this.authenticateThenNavigate(alias, password, rememberMe, firstName, lastName, "");
        }, "register user");
      };

       protected async authenticateUser(alias: string, password: string, firstName: string, lastName: string): Promise<[User, AuthToken]> {
        return this.userService.register(firstName, lastName, alias, password, this._userImageBytes, this.imageFileExtension);
    }

     protected navigate(originalUrl?: string, user?: User){
      this.view.navigate(`/feed/${user!.alias}`);
    }

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