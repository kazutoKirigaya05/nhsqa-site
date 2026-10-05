import { notFound } from "next/navigation";
import { SIM_SYMBOLS } from "@/content/sim-symbols";
import { StockView } from "@/components/trade/StockView";

export function generateStaticParams() { return SIM_SYMBOLS.map((symbol) => ({ symbol })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return { title: `Trade ${symbol}` };
}

export default async function Page({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  if (!SIM_SYMBOLS.includes(symbol)) notFound();
  return <StockView symbol={symbol} />;
}
