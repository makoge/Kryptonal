import type { ReactNode } from "react";
import SessionProvider from "@/components/providers/SessionProvider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
