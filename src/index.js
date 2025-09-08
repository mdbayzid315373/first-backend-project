import dotenv from "dotenv"
import connectDB from './db/index.js';


dotenv.config({
    path: './env'
})

async function start() {
    await connectDB();  // <-- connectDB call

    // Process keep alive (যদি server না চালাও)
    setInterval(() => {}, 1000);

    console.log("✅ Process running, Nodemon will monitor changes.");
}

start();

























// import express from "express"
// const app = express()

// ( async ()=>{
//     try {
//          await mongoose.connect(`${process.env.MONGODB_UR}/${DB_NAME}`) 
//          app.on("error", (error) => {
//             console.log("ERROR: ", error);
//             throw error
            
//          })

//          app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
            
//          })
//     } catch (error) {
//         console.error ("ERROR: ", error)
//         throw err
//     }
// })()