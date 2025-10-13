import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TransactionModalProvider } from "@/components/transaction/TransactionModalProvider";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { NotificationManager } from "@/components/notifications/NotificationManager";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kasir Saku Plus - Aplikasi Keuangan Personal",
  description: "Aplikasi PWA untuk manajemen keuangan personal dengan sistem chat terintegrasi",
  keywords: ["Kasir Saku Plus", "Keuangan Personal", "PWA", "Chat", "Next.js"],
  authors: [{ name: "Kasir Saku Plus Team" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Kasir Saku Plus",
    description: "Aplikasi PWA untuk manajemen keuangan personal",
    url: "https://kasirsaku.plus",
    siteName: "Kasir Saku Plus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kasir Saku Plus",
    description: "Aplikasi PWA untuk manajemen keuangan personal",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kasir Saku Plus"
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kasir Saku Plus" />
        <meta name="application-name" content="Kasir Saku Plus" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <TransactionModalProvider>
            <ServiceWorkerRegistration />
            <NotificationManager />
            <PWAInstaller />
            <div className="min-h-screen">
              {children}
            </div>
            <BottomNavigation />
            <Toaster />
          </TransactionModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
