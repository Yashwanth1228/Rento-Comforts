import "./globals.css";
import { CartProvider } from "@/components/cart-provider";

export const metadata = {
  title: "Rento Comforts",
  description: "Furniture & Home Appliance Rentals and Sales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
