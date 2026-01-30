import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.onerror = function (msg, url, line, col, error) {
      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;background:red;color:white;padding:12px;font-size:14px;z-index:999999;';
      box.innerText = 'Erreur : ' + msg;
      document.body.appendChild(box);
    };
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        theme="dark"
      />
    </AuthProvider>
  );
}
