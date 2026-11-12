import AccountPersonalInformationScreen from "@/components/account/account-personal-information-screen";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Personal Information | Rento Comforts",
};

export default function PersonalInformationPage() {
  return (
    <>
      <SiteHeader />
      <AccountPersonalInformationScreen />
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
