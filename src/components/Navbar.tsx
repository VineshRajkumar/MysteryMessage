"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react'
import { FaUser } from "react-icons/fa";
import { Message } from '@/model/user.model'

const Navbar = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState<string>('');
    const [results, setResults] = useState<Message[]>([])
    const [ischeckingusername, setisCheckingUsername] = useState(false) //loader
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    if (status == 'unauthenticated') {
        router.replace('/')
    }
    const user: User = session?.user as User //user:User emans we are giving user as type User this is because of typescript

    const debounced = useDebounceCallback(setUsername, 50)

    useEffect(() => {
        const searchUsername = async () => {
            if (username) { //Sets ischeckingusername to true before making the request and back to false once the request completes.
                setisCheckingUsername(true) //loding is started
                setUsernameMessage('') //if previously any error or successful message is recived clear that
            }
            try {
                // console.log("hello")
                const response = await axios.get<ApiResponse>(`/api/search-user?username=${username}`) //hit this url with debouncedUsername that the user is writing now
                console.log(response.data.messages)

                setResults(response.data.messages || [])
                // console.log(results)
                setUsernameMessage(response.data.message) //If the request is successful, the response message is stored in usernameMessage.
            } catch (error) { //If there’s an error, it handles the error and sets the appropriate message.
                const axiosError = error as AxiosError<ApiResponse> //if error is related to server error will be stored in axiosError
                setUsernameMessage( //update setUsernameMessage with the error
                    axiosError.response?.data.message ?? "Error checking username"
                )
                setResults([]);
            } finally {
                setisCheckingUsername(false) //make setisCheckingUsername back to false as process is completed , loading is stopped
            }
        }
        searchUsername()
    }, [username])

    const handlelink = async () => {
        router.push(`/u/${username}`)
    }
    const handleBlur = () => {
        setTimeout(() => {
          setIsOpen(false);
        }, 400); // Delaying to allow the click event to register
      };

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</a>

                {/* search */}
                <form className="max-w-xl mx-auto w-full">
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-6 h-6 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-5 ps-12 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black focus:border-[3px] outline-none"
                            placeholder="Search..."
                            value={username}
                            onChange={(e) => { debounced(e.target.value) }}
                            required

                            onClick={toggleDropdown}
                            onBlur={handleBlur}


                        />
                        {isOpen && (
                            <div className="z-10 absolute bg-white rounded-lg shadow w-full">
                                <ul className="py-2 overflow-y-auto text-gray-700 dark:text-gray-200">
                                    {usernameMessage === "Username Found" ? (
                                        results.map((user, index) => (
                                            <Link href={`/u/${user.username}`} key={index}>
                                                <li>

                                                    <a className="flex items-center my-1 px-4 py-2 hover:bg-black hover:text-white border-[3px] border-black justify-center">
                                                        <FaUser className="w-6 h-6 me-2 rounded-full p-1 border-black border-[1px]" />
                                                        {user.username} {/* Display the username here */}
                                                    </a>

                                                </li>
                                            </Link>
                                        ))
                                    ) : (
                                        <li>
                                            <a href="#" className="flex items-center px-4 py-2 hover:bg-black hover:text-white border-[3px] border-black justify-center">
                                                No Results for your search
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                        <button
                            type="submit"
                            onClick={handlelink}
                            className="text-white absolute end-3 bottom-2.5 bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-md px-5 py-3"
                        >
                            Search
                        </button>
                    </div>
                </form>
                {session ? (
                    <>
                        <span className='mr-4 font-bold text-2xl'>
                            🙂 Welcome, {user?.username?.toUpperCase() || user?.email?.split('@')[0]?.toUpperCase()} !!
                        </span>
                        <Button className='w-full md:w-auto' onClick={() => signOut()}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <div className='flex justify-end gap-x-7'>
                            <Link href='/sign-in'>
                                <Button className='md:w-auto'>Login</Button>
                            </Link>
                            <Link href='/sign-up'>
                                <Button className='md:w-auto'>SignUp</Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
