const mongoose = require('mongoose');

//establishing connection to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(error)
    }
}

//testing to make sure the database is now connected
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //we're connected!
    console.log('👍 db is now connected')
})

export default connectDB