import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { metadata } from "./metadata";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export { metadata };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
