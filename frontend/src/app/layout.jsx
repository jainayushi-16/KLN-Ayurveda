import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthModal from "@/components/auth/AuthModal";
import VideoCursor from "@/components/VideoCursor";

export const metadata = {
  title: "KLN Ayurveda | Pure Herbal Hair & Skin Care",
  description: "Authentic Ayurvedic formulations crafted with 100% natural herbs for healthy hair and glowing skin.",
  applicationName: "KLN Ayurveda",
  authors: [{ name: "KLN Ayurveda" }],
  keywords: ["KLN Ayurveda", "Ayurvedic Hair Oil", "Herbal Skin Care", "Natural Wellness"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/images/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "KLN Ayurveda | Pure Herbal Hair & Skin Care",
    description: "Authentic Ayurvedic formulations crafted with 100% natural herbs for healthy hair and glowing skin.",
    siteName: "KLN Ayurveda",
    images: [
      {
        url: "/images/logo.svg",
        width: 800,
        height: 800,
        alt: "KLN Ayurveda Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KLN Ayurveda | Pure Herbal Hair & Skin Care",
    description: "Authentic Ayurvedic formulations crafted with 100% natural herbs for healthy hair and glowing skin.",
    images: ["/images/logo.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          {children}
          <AuthModal />
          <VideoCursor />
        </QueryProvider>
      </body>
    </html>
  );
}
