import { Message } from "@/model/user.model";

export interface ApiResponse{
    sucess:boolean,
    message:string,
   
    isAcceptingMessage?:boolean,//question mark is written so that this thing remains optional and we donot need to send this everytime in api response
    messages?:Array<Message> //this also optional so that we donot need to send it everytime here <Message> is written because it is an interface and we alredy have a format for it and we have alredy written it in usermodels
}