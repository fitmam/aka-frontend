"use client";
import { Montserrat } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AOSInit } from "@/components/aos";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  const [appInfo, setAppInfo] = useState([]);

  const fetchAppInfo = useCallback(async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/appinfo`);
    const parsedData = await data.json();
    setAppInfo(parsedData.results);
  }, []);

  useEffect(() => {
    fetchAppInfo();
  }, [fetchAppInfo]);

  return (
    <html lang="en" className={montserrat.className} data-theme="light">
      <AOSInit />
      <head>
        <title>{appInfo?.[0]?.name}</title>
        <meta name="description" content={appInfo?.[0]?.description}></meta>
        <link
          rel="icon"
          href={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${appInfo?.[0]?.icon}`}
          sizes="32x32"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </head>
      <body className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        <Provider store={store}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
