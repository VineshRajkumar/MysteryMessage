import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/user.model'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }:
    MessageCardProps) => {
    const { toast } = useToast()
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message
        })
        onMessageDelete(message._id as string)

    }


    return (
        <div>
            <Card>
                <CardHeader className=' -mb-9 '>
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog  >
                        <div className='flex justify-end items-center'>
                            <AlertDialogTrigger asChild className='w-12 '>
                                <Button variant="destructive"><X className='w-5 h-5' /></Button>
                            </AlertDialogTrigger>
                        </div>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    card and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </CardHeader>
                <CardContent>
                    <p>{new Date(message.createdAt).toLocaleString(
                        'en-US',
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}
                    </p>
                </CardContent>

            </Card>

        </div>
    )
}

export default MessageCard
