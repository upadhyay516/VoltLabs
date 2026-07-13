import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import { Toaster } from "react-hot-toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = "VoltLab Builds — Turn breadboard ideas into real builds";
const description =
  "Hand-assembled Arduino and non-Arduino electronics kits for school, college and university students. Gas leakage detectors, fire alarms, water level indicators, and more — built and tested by real people, not a factory line.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | VoltLab Builds",
  },
  description,
  keywords: [
    "Arduino kits India",
    "electronics project kits",
    "student electronics kits",
    "gas leakage detector kit",
    "fire detection system kit",
    "college electronics projects",
    "VoltLab Builds",
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "VoltLab Builds",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoltLab",
  },
};

export const viewport = {
  themeColor: "#0a0a12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="y2k">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <div className="crt-overlay" />
              <ServiceWorkerRegister />
              <InstallPrompt />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "var(--panel)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    fontFamily: "Space Mono, monospace",
                  },
                }}
              />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
