import { notFound } from "next/navigation";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Sample Orders Preview | Rento Comforts",
  description: "Development-only sample data for reviewing the My Orders interface.",
};

export default async function OrdersPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const { readFile } = await import("node:fs/promises");
  const previewFileName = `${["orders-preview", "preview"].join(".")}.json`;
  const previewFilePath = `${process.cwd()}/data/${previewFileName}`;
  const sampleOrderPreviewRecords = JSON.parse(await readFile(previewFilePath, "utf8"));
  const { default: AccountOrdersPreviewScreen } = await import("@/components/account/account-orders-preview-screen");

  return (
    <div id="top" className="site-shell">
      <SiteHeader />
      <AccountOrdersPreviewScreen orders={sampleOrderPreviewRecords} />
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
