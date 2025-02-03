//WE ARE USING THIS MIDDLEWARE FOR REDIRECTION PURPOSE AFTER ONCE USER IS LOGGED IN OR LOGGED OUT

//copy paste middleware code from next.js docs for next-auth

//if you have work in request also you can import NextRequest also
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import UserModel from "./model/user.model";
import axios from "axios";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); //to get token to check whether he is signIn or not
  const url = request.nextUrl; //using this we will redirect user according to wheather he has token or not

  //REDIRECTION TO DIFFERENT URLS BASED ON WHEATHER HE HAS TOKEN OR NOT
  if (
    token &&
    (url.pathname.startsWith("/sign-in") || //if he has token and is in signIn page then redirect to dashboard
      url.pathname.startsWith("/sign-up") || //if he has token and is in signup page then redirect to dashboard
      url.pathname.startsWith("/verify") || //if he has token and is in verify otp page then redirect to dashboard
      url.pathname.startsWith("/")) //if he has token and is in home page then redirect to dashboard
  ) {
    if (url.pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  //if he doesnot have token and somehow he got into dashboard page redirect him to signIn page
  if (!token && url.pathname.startsWith("/dashboard")) {
    if (url.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  const user = url.pathname.startsWith("/verify")
    ? url.pathname.split("/").pop()
    : "";

  if (!user) {
    return NextResponse.next(); // No username found, continue with the request
  }
//   console.log(user)
  //once verifed it show go directly to signIn no going back
  try {
    // Check if the URL path is exactly /verify/username
    if (url.pathname === `/verify/${user}`) {
      // Make a request to the /api/get-isverified endpoint using fetch
      const response =  await fetch(`${url.origin}/api/get-isverified/?username=${user}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
    //   console.log(data.message)
      // Check if the user is verified based on the response
      if (data.message === "User is Verifed") {
        // Redirect to /sign-in if the user is verified
        if(url.pathname === `/verify/${user}`){
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        
      }
    }
  } catch (error) {
    console.error('Error fetching verification status:', error);
    // Optionally handle the error, e.g., return a custom error response or continue
  }

  // Continue with the request if no conditions match
  return NextResponse.next();
}

// these are the paths where you want this middleware to work
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*", //this /:path* means all the path that come after dashboard use this middlewarein in all of those
    "/verify/:path*",
  ],
};
