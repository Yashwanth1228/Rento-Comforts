import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sample Rentals Preview | Rento Comforts",
  description: "Development-only sample data for reviewing the My Rentals interface.",
};

export default async function RentalsPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const { readFile } = await import("node:fs/promises");
  const previewFileName = `${["rentals-preview", "preview"].join(".")}.json`;
  const previewFilePath = `${process.cwd()}/data/${previewFileName}`;
  const sampleRentalRecords = JSON.parse(await readFile(previewFilePath, "utf8"));
  const { default: AccountRentalsPreviewScreen } = await import("@/components/account/account-rentals-preview-screen");

  return <AccountRentalsPreviewScreen rentals={sampleRentalRecords} />;
}
