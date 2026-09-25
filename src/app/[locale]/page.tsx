import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSeedCategories, getSeedProducts } from "@/lib/catalog/queries";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return null;
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  const products = getSeedProducts();
  const categories = getSeedCategories();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newIn = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div>
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-cream-2">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
        <Container className="relative z-10 text-cream">
          <p className="mb-4 text-[11px] tracking-[0.3em] uppercase text-cream/80">
            {dict.hero.kicker}
          </p>
          <h1 className="max-w-xl whitespace-pre-line font-serif text-5xl leading-tight md:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-cream/90">
            {dict.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/products`}
              className="bg-cream px-8 py-4 text-xs font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-white"
            >
              {dict.hero.cta}
            </Link>
            <Link
              href={`/${locale}/categories`}
              className="border border-cream px-8 py-4 text-xs font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-cream hover:text-ink"
            >
              {dict.hero.secondary}
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-20">
        <SectionHeading title={dict.home.categories} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/products?category=${c.slug}`}
              className="group relative flex h-72 items-end overflow-hidden bg-cream-2 p-6"
            >
              <Image
                src={c.image}
                alt={c.name[locale]}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
              <h3 className="relative font-serif text-2xl text-cream">{c.name[locale]}</h3>
            </Link>
          ))}
        </div>
      </Container>

      {featured.length > 0 ? (
        <Container className="py-4 pb-20">
          <SectionHeading
            title={dict.home.featured}
            action={
              <Link
                href={`/${locale}/products`}
                className="text-xs uppercase tracking-[0.16em] underline underline-offset-4"
              >
                {dict.catalog.all}
              </Link>
            }
          />
          <ProductGrid products={featured} />
        </Container>
      ) : null}

      <section className="border-y border-line bg-cream-2">
        <Container className="grid items-center gap-10 py-20 lg:grid-cols-2">
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl">{dict.home.editorialTitle}</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted">
              {dict.home.editorialBody}
            </p>
            <div className="mt-8 flex gap-6 text-xs uppercase tracking-[0.16em]">
              <Link href={`/${locale}/products?category=femme`} className="underline underline-offset-4">
                {dict.home.shopWomen}
              </Link>
              <Link href={`/${locale}/products?category=homme`} className="underline underline-offset-4">
                {dict.home.shopMen}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {newIn.length > 0 ? (
        <Container className="py-20">
          <SectionHeading title={dict.home.newIn} />
          <ProductGrid products={newIn} />
        </Container>
      ) : null}
    </div>
  );
}
