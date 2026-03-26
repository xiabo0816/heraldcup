import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentIdentitySnapshot } from "@/lib/identity";
import { getSiteSearchIndex } from "@/lib/queries";

export const metadata: Metadata = {
  title: "今晚就来 - Dota2 社区赛事平台",
  description: "围绕 Dota2 社区赛事、战队、选手与战报构建的轻社区门户。"
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0f1d"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [searchItems, identity] = await Promise.all([getSiteSearchIndex(), getCurrentIdentitySnapshot()]);

  return (
    <html lang="zh-CN">
      <body>
        <div className="site-frame">
          <div className="site-background" aria-hidden="true" />
          <SiteHeader searchItems={searchItems} identity={identity} />
          <div className="site-content">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
