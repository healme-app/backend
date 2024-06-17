import { RequestHandler } from "express";
import fileUpload from "../../../../middlewares/file-upload";
import { Storage } from '@google-cloud/storage';
import { config } from "../../../../config/config";

export const POST: RequestHandler[] = [
  fileUpload,
  async (req, res) => {

    const storage = new Storage({
      keyFilename: 'src\config\healme-424720-031418aad07e.json',
    })
    const bucketName = 'my-test-bucket'
    const bucket = storage.bucket(bucketName)

    // Sending the upload request
    // bucket.upload(
    //   `./image_to_upload.jpeg`,
    //   {
    //     destination: `someFolderInBucket/image_to_upload.jpeg`,
    //   },
    //   function (err, file) {
    //     if (err) {
    //       console.error(`Error uploading image image_to_upload.jpeg: ${err}`)
    //     } else {
    //       console.log(`Image image_to_upload.jpeg uploaded to ${bucketName}.`)

    //         // Making file public to the internet
    //         file.makePublic(async function (err) {
    //         if (err) {
    //           console.error(`Error making file public: ${err}`)
    //         } else {
    //           console.log(`File ${file.name} is now public.`)
    //           const publicUrl = file.publicUrl()
    //           console.log(`Public URL for ${file.name}: ${publicUrl}`)
    //         }
    //       })

    //     }
    //   }
    // )

    // console.log(req)
    console.log(req.file)
    res.status(201).send({ message: "" })
  }
]