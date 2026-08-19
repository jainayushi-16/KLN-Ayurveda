import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { SidebarProvider } from '../context/SidebarContext';
import { Toaster } from 'react-hot-toast';
import VideoCursor from '../components/common/VideoCursor';
import FloatingLeaves from '../components/common/FloatingLeaves';

export const metadata = {
  title: 'KLN Ayurveda — Admin Control Panel',
  description: 'Management dashboard for KLN Ayurveda store, products, orders, and customers.',
  applicationName: 'KLN Ayurveda Admin',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SidebarProvider>
            <VideoCursor />
            <FloatingLeaves />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#FFFFFF',
                  color: '#2F5D34',
                  border: '1px solid rgba(47, 93, 52, 0.25)',
                  borderRadius: '14px',
                  fontWeight: '600',
                  boxShadow: '0 8px 24px rgba(47, 93, 52, 0.12)',
                },
              }}
            />
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
