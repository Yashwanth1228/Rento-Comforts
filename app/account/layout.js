import AccountLayoutShell from "@/components/account/account-layout-shell";

// Temporary account layout experiment: set to true to restore the banner.
const SHOW_ACCOUNT_BANNER = false;
// Temporary account layout experiment: set to true to restore category navigation.
const SHOW_ACCOUNT_CATEGORIES = false;

export default function AccountLayout({ children }) {
  return <AccountLayoutShell hideUtilityBar showAccountBanner={SHOW_ACCOUNT_BANNER} showAccountCategories={SHOW_ACCOUNT_CATEGORIES}>{children}</AccountLayoutShell>;
}
