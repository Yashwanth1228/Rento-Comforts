import AccountAddressesScreen from "@/components/account/account-addresses-screen";

export const metadata = {
  title: "My Addresses | Rento Comforts",
  description: "Manage your delivery and pickup addresses for Rento Comforts.",
};

export default function AccountAddressesPage() {
  return <AccountAddressesScreen isDevelopmentPreview={process.env.NODE_ENV === "development"} />;
}
