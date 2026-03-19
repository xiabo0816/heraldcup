import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { getSiteSearchIndex } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Herald Cup",
  description: "Dota2 社区赛事的全栈管理与展示系统。"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchItems = await getSiteSearchIndex();

  return (
    <html lang="zh-CN">
      <body className="bg-arena">
        <SiteHeader searchItems={searchItems} />
        {children}
      </body>
    </html>
  );
}
