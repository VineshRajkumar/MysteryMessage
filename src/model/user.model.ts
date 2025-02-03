//Why use TypeScript 
//it give typesafety.Type safety ensures that variables and functions are used with the correct data types, reducing runtime errors and improving code reliability.

import mongoose,{Schema, Document} from "mongoose"; //Document is used in typescript

//TypeScript syntaxes meaning :- 

//interface - It specifies the structure that an object should adhere to.
//Message - Message is the name of this interface.
//extends means that the Message interface inherits from another type, Document
//Document is where mongoose schema will be stored 
export interface Message extends Document{
    content:string, //content type should be string //in typescript write string in lowercase
    username:string,
    createdAt: Date;
}

//we are giving the format for MessageSchema to follow interface Message that is written above
const MessageSchema: Schema<Message> = new Schema(
    {
        content:{
            type:String, //now if by mistake number is written instead of string it will give error because in interface Message we have told it that content type is string , so this is called typesafety
            required:true
        },
        username: { // Ensure this field is present in the schema
            type: String,
            required: true,
        },
    },{timestamps:true}
)

export interface User extends Document{
    //here in interface datatype all should be written in lowercase
    username:string, 
    email:string,
    password:string,
    verifyCode:string, //verifyCode is the otp to be sent if new user registers
    verifyCodeExpiry:Date, //this is the otp expiryDate 
    isVerified:boolean, //if he has done registeration by otp then is verfied user
    isAcceptingMessage:boolean,
    message:Message[]
}

const UserSchema: Schema<User> = new Schema(
    {//all datatypes first letter should be capital
        username:{
            type:String,
            required: [true,"Username is required"],
            trim:true,//removes spaces
            unique:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            //match is inbuilt in mongoose. here we are using it to check if entered email id is actually a email id, this long string that is written here is called regexr and this will check if email id has @ and has .com in it all these will be check if it is correct then it will proceed -> regexr is generally used for these type of validations
            match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'Please use a Valid Email Address'], //check is email id is valid or not
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        verifyCode:{
            type:String,
            required:[true,"VerifyCode is required"],
        },
        verifyCodeExpiry:{
            type:Date,
            required:[true,"VerifyCodeExpiry is required"],
            default:Date.now
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        isAcceptingMessage:{
            type:Boolean,
            default:true
        },
        message:[MessageSchema] //instand of using mongodb pipeline we are directly writing MessageSchema here beacue this is a short project just based on understanding nextjs.

    },{timestamps:true}
)

//nextjs is edge timeframework it doesnot know wheather server is starting for first time or it has been alredy started previous 
//so thats why exporting in nextjs for mongoose is different
//if mongoose model is alredy made in mongodb then just export or if it is not made then make it then export 

const UserModel = (mongoose.models.User as mongoose //in this part we are saying nextjs to give us alredy made model in mongodb
    .Model<User>) || mongoose.model<User>("User",UserSchema) //in this part we are saying that if not created in database then create this model

    export default UserModel
