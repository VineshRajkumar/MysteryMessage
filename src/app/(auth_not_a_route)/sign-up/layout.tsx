import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css"; //this is inside 3 folder 
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* this is session provider which we have wrapped in layout.tsx file  so that we can usesession in pages where next-auth is required*/}
       {/* //note if you have alredy written <AuthProvider> {children} <Toaster /> </AuthProvider> in local layout file donot again write it in global layout file it will cause hydration error  */}
      <body className={inter.className}><AuthProvider> {children} <Toaster /> </AuthProvider></body>
      
    </html>
  );
}