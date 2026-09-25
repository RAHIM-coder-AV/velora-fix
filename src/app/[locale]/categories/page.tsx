import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSeedCategories } from "@/lib/catalog/queries";
import { Container, SectionHeading } from "@/components/ui/container";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return null;
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const categories = getSeedCategories();

  return (
    <Container className="py-14">
      <SectionHeading title={dict.categoriesPage.title} />
      <p className="-mt-6 mb-10 max-w-lg text-sm text-muted">{dict.categoriesPage.subtitle}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/products?category=${c.slug}`}
            className="group relative flex h-80 items-end overflow-hidden bg-cream-2 p-8"
          >
            <Image
              src={c.image}
              alt={c.name[locale]}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
            <div className="relative text-cream">
              <h2 className="font-serif text-3xl">{c.name[locale]}</h2>
              <p className="mt-2 max-w-xs text-sm text-cream/85">{c.description[locale]}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
