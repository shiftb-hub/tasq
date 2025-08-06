import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TASQ",
  description: "...",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  return (
    <html lang="ja">
      <body>{props.children}</body>
    </html>
  );
};

export default RootLayout;
