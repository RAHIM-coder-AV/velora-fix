import { StoreHomepage } from "@/components/store/store-homepage";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return <StoreHomepage locale={locale} />;
}
