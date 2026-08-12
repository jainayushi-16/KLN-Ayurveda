import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import VideoCursor from '../components/common/VideoCursor';

export const metadata = {
  title: 'KLN Ayurveda — Admin Control Panel',
  description: 'Management dashboard for KLN Ayurveda store, products, orders, and customers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <VideoCursor />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#14281f',
                color: '#f5f8f6',
                border: '1px solid rgba(201, 166, 107, 0.4)',
                borderRadius: '12px',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
