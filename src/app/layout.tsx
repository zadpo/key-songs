import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { metadata } from "./metadata";
import { LayoutContent } from "@/components/Layout/LayoutContent";

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-inter">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
