import mongoose, { Document } from "mongoose";

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

//typescript interface
interface IFile extends Document {
    filename: string,
    secure_url: string,
    sizeInBytes: string,
    format: string,
    sender?: string,
    reciever?: string
}

//export module wrapping interface in typescript
export default mongoose.model<IFile>("File", fileSchema);