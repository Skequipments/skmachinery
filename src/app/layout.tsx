import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import CookieConsent from '@/components/Cookies/CookieConsent';
import BottomNav from "@/components/phone/BottomNav";
import { AuthProvider } from "./contexts/AuthContext";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S. K. Equipments",
  description:
    "S. K. Equipments – Established in 1998, we specialize in manufacturing and supplying high-quality testing equipment for leather, yarn, paper, dyeing, packaging, and more. Based in Noida, we are known for our innovation, reliability, and customer satisfaction across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any" />
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/assets/images/logo/sklogo.png" />
         <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDummyKey&libraries=places"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <CookieConsent />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}