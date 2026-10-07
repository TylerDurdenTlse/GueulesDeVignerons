import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Gueules de Vignerons par RVins — Le vin, une histoire de rencontres", template: "%s | Gueules de Vignerons par RVins" },
  description: "Gueules de Vignerons par RVins : des vins de caractère, des dégustations à partager et des expériences sur mesure pour passionnés et professionnels.",
  openGraph: { title: "Gueules de Vignerons par RVins", description: "Le vin, une histoire de rencontres.", locale: "fr_FR", type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="site-body">
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
