import AccountOrdersScreen from "@/components/account/account-orders-screen";

export const metadata = {
  title: "My Orders | Rento Comforts",
  description: "View your Rento Comforts purchase and rental order history.",
};

export default function AccountOrdersPage() {
  return (
    <>
      <AccountOrdersScreen />
    </>
  );
}
