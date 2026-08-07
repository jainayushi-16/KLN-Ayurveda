import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthModal from "@/components/auth/AuthModal";
import VideoCursor from "@/components/VideoCursor";
export const metadata = {
    title: "KLN Ayurveda | Pure Herbal Hair & Skin Care",
    description: "Authentic Ayurvedic formulations crafted with 100% natural herbs for healthy hair and glowing skin.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="antialiased">
        <QueryProvider>
          {children}
          <AuthModal />
          <VideoCursor />
        </QueryProvider>
      </body>
    </html>);
}
