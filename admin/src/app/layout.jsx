import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'KLN Ayurveda — Admin Control Panel',
  description: 'Management dashboard for KLN Ayurveda store, products, orders, and customers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#182823',
                color: '#f0f7f4',
                border: '1px solid #40735f',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
