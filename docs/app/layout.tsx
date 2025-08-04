import "@/app/global.css";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

const geist = Geist({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
