import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout-page";

export const metadata: Metadata = { title: "Mon panier" };

export default function PanierPage() {
  return <CheckoutPage />;
}
