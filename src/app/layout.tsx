import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz Jejum Intermitente",
  description: "Um quiz sobre jejum intermitente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {children}
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} gtmScriptUrl="https://www.googletagmanager.com/gtm.js" />
      </body>
    </html>
  );
}