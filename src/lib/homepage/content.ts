import type { Category, Localized, Product } from "@/types";
import { categories as seedCategories } from "@/lib/catalog/seed";

export type HomepageTheme = "atelier" | "minimal" | "lookbook";
export type HomepageSectionId = "hero" | "categories" | "featured" | "editorial" | "new-arrivals";

interface BaseSection {
  id: HomepageSectionId;
  visible: boolean;
  order: number;
}

export interface HomepageHeroSection extends BaseSection {
  id: "hero";
  title: Localized;
  kicker: Localized;
  body: Localized;
  imageUrl: string;
  primaryLabel: Localized;
  primaryHref: string;
  secondaryLabel: Localized;
  secondaryHref: string;
}

export interface HomepageCategoriesSection extends BaseSection {
  id: "categories";
  title: Localized;
  items: HomepageCategoryCard[];
}

export interface HomepageCategoryCard {
  slug: string;
  title: Localized;
  imageUrl: string;
  href: string;
}

export interface HomepageProductSection extends BaseSection {
  id: "featured" | "new-arrivals";
  title: Localized;
  selectionMode: "automatic" | "curated";
  productSlugs: string[];
}

export interface HomepageEditorialSection extends BaseSection {
  id: "editorial";
  title: Localized;
  body: Localized;
  imageUrl: string;
  firstLinkLabel: Localized;
  firstLinkHref: string;
  secondLinkLabel: Localized;
  secondLinkHref: string;
}

export type HomepageSection =
  | HomepageHeroSection
  | HomepageCategoriesSection
  | HomepageProductSection
  | HomepageEditorialSection;

export interface HomepageContent {
  version: 1;
  theme: HomepageTheme;
  sections: HomepageSection[];
}

const local = (fr: string, ar: string): Localized => ({ fr, ar });

export function createDefaultHomepageContent(
  categoryList: Category[] = seedCategories,
): HomepageContent {
  return {
    version: 1,
    theme: "atelier",
    sections: [
      {
        id: "hero",
        visible: true,
        order: 0,
        kicker: local("La maison Velora", "دار فيلورا"),
        title: local("La beauté des choses qui durent", "جمال القطع التي تدوم"),
        body: local(
          "Des pièces choisies, des matières sincères et une allure pensée pour chaque jour.",
          "قطع مختارة وخامات أصيلة وأناقة تناسب كل يوم.",
        ),
        imageUrl:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
        primaryLabel: local("Découvrir la collection", "اكتشف جميع المنتجات"),
        primaryHref: "/products?view=all",
        secondaryLabel: local("Nos catégories", "تصفّح التصنيفات"),
        secondaryHref: "/categories",
      },
      {
        id: "categories",
        visible: true,
        order: 1,
        title: local("Explorer les univers", "اكتشف مجموعاتنا"),
        items: categoryList.map((category) => ({
          slug: category.slug,
          title: category.name,
          imageUrl: category.image,
          href: `/products?category=${encodeURIComponent(category.slug)}`,
        })),
      },
      {
        id: "featured",
        visible: true,
        order: 2,
        title: local("Pièces choisies", "مختارات فيلورا"),
        selectionMode: "automatic",
        productSlugs: [],
      },
      {
        id: "editorial",
        visible: true,
        order: 3,
        title: local("Fabriqué pour durer", "صُنع ليدوم"),
        body: local(
          "Nous choisissons des matières nobles et des coupes justes pour accompagner votre quotidien.",
          "نختار خامات نبيلة وقصّات متقنة لترافق تفاصيل يومك.",
        ),
        imageUrl:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85",
        firstLinkLabel: local("La collection femme", "مجموعة النساء"),
        firstLinkHref: "/products?category=femme",
        secondLinkLabel: local("La collection homme", "مجموعة الرجال"),
        secondLinkHref: "/products?category=homme",
      },
      {
        id: "new-arrivals",
        visible: true,
        order: 4,
        title: local("Nouveautés", "وصل حديثاً"),
        selectionMode: "automatic",
        productSlugs: [],
      },
    ],
  };
}

const isLocalized = (value: unknown): value is Localized =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Localized).fr === "string" &&
  typeof (value as Localized).ar === "string";

export function isHomepageContent(value: unknown): value is HomepageContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<HomepageContent>;
  if (
    content.version !== 1 ||
    !["atelier", "minimal", "lookbook"].includes(content.theme ?? "") ||
    !Array.isArray(content.sections)
  ) {
    return false;
  }
  const ids = new Set<string>();
  for (const section of content.sections) {
    if (
      !section ||
      typeof section !== "object" ||
      !["hero", "categories", "featured", "editorial", "new-arrivals"].includes(section.id) ||
      ids.has(section.id) ||
      typeof section.visible !== "boolean" ||
      typeof section.order !== "number" ||
      !Number.isFinite(section.order) ||
      !isLocalized(section.title)
    ) {
      return false;
    }
    ids.add(section.id);
    if (section.id === "hero") {
      if (
        !isLocalized(section.kicker) ||
        !isLocalized(section.body) ||
        !isLocalized(section.primaryLabel) ||
        typeof section.primaryHref !== "string" ||
        !isLocalized(section.secondaryLabel) ||
        typeof section.secondaryHref !== "string" ||
        typeof section.imageUrl !== "string"
      ) return false;
    } else if (section.id === "categories") {
      if (
        !Array.isArray(section.items) ||
        !section.items.every(
          (item) =>
            !!item &&
            typeof item.slug === "string" &&
            isLocalized(item.title) &&
            typeof item.imageUrl === "string" &&
            typeof item.href === "string",
        )
      ) {
        return false;
      }
    } else if (section.id === "featured" || section.id === "new-arrivals") {
      if (
        !["automatic", "curated"].includes(section.selectionMode) ||
        !Array.isArray(section.productSlugs) ||
        !section.productSlugs.every((slug) => typeof slug === "string")
      ) return false;
    } else if (section.id === "editorial") {
      if (
        !isLocalized(section.body) ||
        typeof section.imageUrl !== "string" ||
        !isLocalized(section.firstLinkLabel) ||
        typeof section.firstLinkHref !== "string" ||
        !isLocalized(section.secondLinkLabel) ||
        typeof section.secondLinkHref !== "string"
      ) return false;
    }
  }
  return true;
}

export function productsForHomepageSection(
  section: HomepageProductSection,
  products: Product[],
): Product[] {
  const available = products.filter((product) => product.active !== false);
  if (section.selectionMode === "curated") {
    const bySlug = new Map(available.map((product) => [product.slug, product]));
    return section.productSlugs.flatMap((slug) => {
      const product = bySlug.get(slug);
      return product ? [product] : [];
    });
  }
  const flag = section.id === "featured" ? "featured" : "isNew";
  return available.filter((product) => product[flag]).slice(0, section.id === "featured" ? 8 : 4);
}

export function moveHomepageSection(
  content: HomepageContent,
  sectionId: HomepageSectionId,
  direction: -1 | 1,
): HomepageContent {
  const sections = [...content.sections].sort((a, b) => a.order - b.order);
  const index = sections.findIndex((section) => section.id === sectionId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sections.length) return content;
  [sections[index], sections[target]] = [sections[target], sections[index]];
  return {
    ...content,
    sections: sections.map((section, order) => ({ ...section, order })),
  };
}

export function updateHomepageProductSelection(
  section: HomepageProductSection,
  slug: string,
  selected: boolean,
): HomepageProductSection {
  const productSlugs = selected
    ? section.productSlugs.includes(slug)
      ? section.productSlugs
      : [...section.productSlugs, slug]
    : section.productSlugs.filter((item) => item !== slug);
  return { ...section, selectionMode: "curated", productSlugs };
}
