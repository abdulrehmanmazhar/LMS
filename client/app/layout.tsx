'use client'
import "./globals.css";
import { Providers } from "./Provider";
// import localFont from "next/font/local";
import {Poppins} from 'next/font/google';
import {Josefin_Sans} from 'next/font/google';
import { ThemeProvider } from "./utils/theme-provider";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Poppins',
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Josefin',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Avoid rendering until the component has mounted
    return null;
  }
  
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300 text-black dark:text-white`}
      >
        <Providers>
        <SessionProvider>
        <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
        {children}
        <Toaster position="top-center" reverseOrder={false}/>
        </ThemeProvider>
        </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
