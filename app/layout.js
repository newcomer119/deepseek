import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { AppContextProvider } from "@/context/AppContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Deepseek App",
  description: "Deepseek App - A Next.js Application",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <Toaster toastOptions={{
              success: { style: { backgroundColor: "black", color: "white" } },
              error: { style: { backgroundColor: "black", color: "white" } }
            }} />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
