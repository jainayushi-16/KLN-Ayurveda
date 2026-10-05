import ProductDetailClient from "./ProductDetailClient";
import { PRODUCTS } from "@/constants/products";

export const dynamicParams = true;

export async function generateStaticParams() {
  const staticIds = [
    "kln-hair-oil-01",
    "kln-hair-mask-05",
    "kln-hair-mask-02",
    "kln-hair-tonic-03",
    "kln-combo-oil-tonic-01",
    "kln-combo-oil-mask-02",
    ...PRODUCTS.map((p) => p.id),
    ...PRODUCTS.filter((p) => p.slug).map((p) => p.slug),
  ];
  const uniqueIds = Array.from(new Set(staticIds.filter(Boolean)));
  return uniqueIds.map((id) => ({ id }));
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ProductDetailClient params={resolvedParams} />;
}
