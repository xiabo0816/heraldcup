import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getHeaderSearchIndex } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export const metadata: Metadata = {
  title: "今晚就来社区",
  description: "Herald Cup 赛事门户，集中查看比赛、选手、战队与参赛动态"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [viewer, searchItems] = await Promise.all([getViewer(), getHeaderSearchIndex()]);

  return (
    <html data-theme="radiant" lang="zh-CN">
      <body>
        <Suspense fallback={<div className="page-shell py-10">页面加载中...</div>}>
          <SiteShell searchItems={searchItems} viewer={viewer}>{children}</SiteShell>
        </Suspense>
      </body>
    </html>
  );
}