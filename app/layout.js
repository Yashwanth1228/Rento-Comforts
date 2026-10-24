import "./globals.css";

export const metadata = {
  title: "Rento Comforts",
  description: "Furniture & Home Appliance Rentals and Sales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
