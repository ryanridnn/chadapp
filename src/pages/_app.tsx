import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next/types";
import { Manrope } from "next/font/google";
import RootLayout from "@/components/Layout/RootLayout";
import DefaultLayout from "@/components/Layout/DefaultLayout";

const manrope = Manrope({ subsets: ["latin"] });

interface CustomAppProps<P = any> extends AppProps {
  Component: NextComponentType<NextPageContext, any, any> & {
    getLayout: (page: React.ReactNode) => React.ReactNode;
  };
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const getLayout = Component.getLayout || DefaultLayout;

  return (
    <div className={manrope.className}>
      <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
    </div>
  );
}
