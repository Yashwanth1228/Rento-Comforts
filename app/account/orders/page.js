import AccountOrdersScreen from "@/components/account/account-orders-screen";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "My Orders | Rento Comforts",
  description: "View your Rento Comforts purchase and rental order history.",
};

export default function AccountOrdersPage() {
  return (
    <>
      <SiteHeader />
      <AccountOrdersScreen />
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
