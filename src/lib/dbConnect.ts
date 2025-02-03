import mongoose from "mongoose";

//optional to put this because of typescript ConnectionObject we are just modifying the connection string to give use the number part from there
type ConnectionObject = {
    isConnected?:number //you can get a number or you cannot get a number thats why "?" has been used
}
const connection: ConnectionObject={} //you can get a number or you cannot get a number thats why "{}" has been used

//writing Promise<void> is not really nesscesary but again this is one feature of typescript to avoid typeerrors
//Promise<void> says that returned string data type is not really nesscesary it can be anything
const dbConnect = async():Promise<void>=>{

    //this if statement is need for nextjs as it is an edge time frame work
    if(connection.isConnected){ //if connected then connection number will be preseent inside ConnectionObject so we can verify from that
        console.log("Already connected to database")
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI||'',{}) //nextjs as it is an edge time frame work so also taking care of it by putting ||''

        //db.connections is used if there are many connections
        connection.isConnected = db.connections[0].readyState //readyState: Indicates the state of the connection: 0 = Disconnected , 1 = Connected ,2 = Connecting ,3 = Disconnecting
        
        console.log(`\n MongoDB connected !! DB HOST : ${db.connection.host}`)
    } catch (error) {

        console.log("MongoDB connection error",error);
        
        process.exit(1); //exiting gracefully
    }
}

export default dbConnect;