import { LandingPage } from "@/components/landing/LandingPage";
import { landingBackdropIndexFromQuery } from "@/lib/scene";

type HomeProps = {
  searchParams: Promise<{ b?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const initialBackdropIndex = landingBackdropIndexFromQuery(sp.b);

  return <LandingPage initialBackdropIndex={initialBackdropIndex} />;
}
