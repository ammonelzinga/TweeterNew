export interface profileImageDAOInterface {
    uploadProfileImage(
        fileName: string,
        imageBase64: string
    ): Promise<string>; // returns the URL of the uploaded image
}