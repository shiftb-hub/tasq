import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TASQ",
  description: "...",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = async (props) => {
  return (
    <html lang="ja">
      <body>
        <main className="mx-4 mt-2 max-w-3xl md:mx-auto">{props.children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
