import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "./Provider";
import ToasterContext from "./context/ToasterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Chatty",
    description: "Let's chat!"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head></head>
            <body>
                {
                    /* @ts-expect-error Server Component */
                    <Provider>
                        <ToasterContext />
                        {children}
                    </Provider>
                }
            </body>
        </html>
    );
}
