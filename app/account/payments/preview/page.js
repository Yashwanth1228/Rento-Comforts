import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PaymentsPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const [{ default: AccountPaymentsPreview }, { samplePayments }] = await Promise.all([
    import("@/components/account/account-payments-preview"),
    import("@/data/sample-payments.preview"),
  ]);
  return <AccountPaymentsPreview records={samplePayments} />;
}
