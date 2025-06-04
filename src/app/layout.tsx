import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuizProvider } from './context/QuizContext';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-green-50 to-blue-50 text-gray-800`}>
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
