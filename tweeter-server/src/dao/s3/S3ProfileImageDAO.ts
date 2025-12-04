import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { profileImageDAOInterface } from "../../dao/DAOinterfaces/profileImageDAOInterface";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

export class S3ProfileImageDAO implements profileImageDAOInterface {
    private readonly bucketName = "tweetprofilepicbucket";
    private readonly region = "us-west-2";
    private readonly client: S3Client;

    constructor() {
        this.client = new S3Client({ region: this.region });
    }

      async uploadProfileImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.bucketName,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png"
    };
    const c = new PutObjectCommand(s3Params);
    
    try {
      await this.client.send(c);
      return (
      `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${fileName}`
      );
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }


  }

}