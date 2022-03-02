
# 💻 Sticky Quips - Backend & Database

## Description
This repository holds production files used to build a file sharing application built with NEXT.js allowing users to download & send files to friends via links\

Please follow **[THIS LINK](https://file-share-darkins.vercel.app/)** to the deployed front-end applicatoin.

![file-share-backend-example](https://user-images.githubusercontent.com/84754257/156299653-83e91e86-ca46-4440-ae71-d82ded1cff4a.gif)

## Table of Contents

* [Badges](#badges)
* [Installation](#installation)
* [Database](#database)
* [Credits](#credits)
* [License](#license)
* [Questions](#questions)

## Badges 
*The following programming languages, frameworks, platforms and libraries were utilized when completing this project:*

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)


## Installation
<br>

- In the Github repository, copy the SSH key link to clone onto your local device
- Open the project in your code editor of choice and enter the following command in console:
  - `npm i`
  - The following dependencies will being to run:
    - `body-parser` - `cors` - `dotenv` - `express` - `mongoose` - `cloudinary` - `multer` - `nodemailer`
- When dependencies have finished installation begin to run your server with the following command in the terminal:
  - **`npm run dev`**
- Now head over to <a href=https://www.postman.com/>Postman</a> and begin testing routes:

  - `GET` an uploaded file:
```json
        const { filename, format, sizeInBytes } = file
        return res.status(200).json({
            name: filename,
            format,
            sizeInBytes,
            id
        })
```

 - `POST` an uploaded file:
```json
        const file = await File.create({
            filename: originalname,
            sizeInBytes: bytes,
            secure_url,
            format
        })
```

  - `GET` a downloaded file:
```json
router.get('/:id/download', async (req, res) => {
    try {
        const id = req.params.id
        const file = await File.findById(id)
        if (!file) {
            return res.status(404).json({ message: 'That file does not exist' })
        }
        https.get(file.secure_url, (fileStream) => fileStream.pipe(res));
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
})
```

  - `POST` a downloaded to email:
```json
    const mailObject = {
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: "Shared File", // Subject line
        text: `${emailFrom} has sent you a file to upload`, // plain text body
        html: createEmailTemplate(emailFrom, downloadPageLink, filename, fileSize), // html body
      }
```
## Database
The application uses the document-oriented database program Mongodb. Mongoose extension is also utilized to bridge the syntax gap for Javascript.
There is only one model and that is `Note` whose structure is listed below:
```json
const fileSchema: any = new mongoose.Schema({
    //filename to be uploaded
    filename: {
        type: String,
        required: true
    },
    //secure URL to be used for sending files
    secure_url: {
        type: String,
        required: true
    },
    //file format
    format: {
        type: String,
        required: true
    },
    //file size
    sizeInBytes: {
        type: String,
        required: true
    },
    //input field for who will send the file via the email option
    sender: {
        type: String
    },
    //input field for who will recieve the file via the email option
    reciever: {
        type: String
    },
}, {
    timestamps: true
});
```

## Credits
Big shout out to <a href = https://github.com/Ileriayo>Ileriayo Adebiyi</a> and his <a href =https://github.com/Ileriayo/markdown-badges>markdown badges repository</a> which made this project all the more beautiful. Thank You.<br>

## License
*This project is licensed under:* <br>
![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)<br>
<a href= https://opensource.org/licenses/MIT)>MIT License Link</a><br>

## Contributing
This project adheres to standards set by the <a href = https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md>Contributor Covenant</a>.<br>
Please consult this documentation before contributing to this project.

## Questions
![Profile Pic](https://user-images.githubusercontent.com/84754257/145705294-57134da6-c3b7-40f4-bcbe-ad9cddb27f47.jpg)

If you have any questions regarding the development process of this application, or specific questions about contributing, feel free to reach me by email or on Github.
* Email 📪 willdarkins@gmail.com
* Github 🗿 [willdarkins](https://github.com/willdarkins) 
