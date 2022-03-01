import express from 'express';
import multer from 'multer';
import nodeMailer from 'nodemailer'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import File from '../models/file.model'
import https from 'https'
import createEmailTemplate from '../utils/emailTemplate';

const router = express.Router();

const storage = multer.diskStorage({})

let upload = multer({
    storage
})

router.post('/upload', upload.single('myFile'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "A file was not provided to upload." })
        console.log(req.file)
        let uploadedFile: UploadApiResponse
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Darkins_Folder',
                resource_type: 'auto'
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Cloudinary Error." })
        }

        const { originalname } = req.file;
        const { secure_url, bytes, format } = uploadedFile

        const file = await File.create({
            filename: originalname,
            sizeInBytes: bytes,
            secure_url,
            format
        })

        res.status(200).json({
            id: file._id,
            downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "There has been an error with the server." });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const file = await File.findById(id)
        if (!file) {
            return res.status(404).json({ message: 'That file does not exist' })
        }
        const { filename, format, sizeInBytes } = file
        return res.status(200).json({
            name: filename,
            format,
            sizeInBytes,
            id
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
})

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

router.post('/email', async (req, res) => {
    //1. Validate Request
    const { id, emailFrom, emailTo } = req.body
    if (!id || !emailFrom || !emailTo)
        return res.status(400).json({ message: 'Invalid data' })

    //2. Check if the file exists
    const file = await File.findById(id)
    if (!file) {
        return res.status(404).json({ message: 'That file does not exist' })
    }

    //3. Create transporter
    let transporter = nodeMailer.createTransport({
        //@ts-ignore
        host: process.env.SENDINBLUE_SMTP_HOST,
        port: process.env.SENDINBLUE_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SENDINBLUE_SMTP_USER, // generated ethereal user
            pass: process.env.SENDINBLUE_SMTP_PASSWORD, // generated ethereal password
        },
    });
    //4. Prepare email data

    const { filename, sizeInBytes } = file

    const fileSize = `${(Number(sizeInBytes)/(1024*1024)).toFixed(2)} MB`
    const downloadPageLink = `${process.env.API_BASE_ENDPOINT_CLIENT}download/${id}`

    //5. Send email using transporter

    const mailObject = {
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: "Shared File", // Subject line
        text: `${emailFrom} has sent you a file to upload`, // plain text body
        html: createEmailTemplate(emailFrom, downloadPageLink, filename, fileSize), // html body
      }

    transporter.sendMail(mailObject, async (error, info) => {
        if(error) {
            console.log(error)
            return res.status(500).json({ message: 'Server Error' })
        }
        file.sender = emailFrom;
        file.reciever = emailTo;

        await file.save();
        return res.status(200).json({message: 'Email sent!' })

      });
    //6. Save the data and send the response

})

export default router