import type { Category, Product, Review } from "@/types";

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  {
    id: "cat_women",
    slug: "femme",
    name: { fr: "Femme", ar: "نساء" },
    description: {
      fr: "Silhouettes contemporaines, coupes précises et matières nobles.",
      ar: "قصّات معاصرة وأقمشة فاخرة لمجموعة نسائية أنيقة.",
    },
    image: img("photo-1490481651871-ab68de25d43d"),
  },
  {
    id: "cat_men",
    slug: "homme",
    name: { fr: "Homme", ar: "رجال" },
    description: {
      fr: "L’essentiel masculin, taillé pour le quotidien et les soirées.",
      ar: "أساسيات رجالية مصممة لليومي والمناسبات.",
    },
    image: img("photo-1617137968427-85924c800a22"),
  },
  {
    id: "cat_shoes",
    slug: "chaussures",
    name: { fr: "Chaussures", ar: "أحذية" },
    description: {
      fr: "Cuir, daim et sneakers sélectionnés pour la ville.",
      ar: "جلود ونماذج حضرية مختارة بعناية.",
    },
    image: img("photo-1549298916-b41d501d3772"),
  },
  {
    id: "cat_accessories",
    slug: "accessoires",
    name: { fr: "Accessoires", ar: "إكسسوارات" },
    description: {
      fr: "Sacs, ceintures et bijoux pour signer une allure.",
      ar: "حقائب وأحزمة ومجوهرات تُكمل الإطلالة.",
    },
    image: img("photo-1590874103328-eac38a941956"),
  },
];

function variant(
  product: string,
  size: string,
  colorFr: string,
  colorAr: string,
  hex: string,
  stock: number,
) {
  return {
    id: `${product}_${size}_${hex.replace("#", "")}`,
    sku: `${product.toUpperCase()}-${size}-${hex.replace("#", "")}`.slice(0, 32),
    size,
    color: { fr: colorFr, ar: colorAr },
    colorHex: hex,
    stock,
  };
}

export const products: Product[] = [];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p_silk_dress",
    author: "Amel B.",
    rating: 5,
    comment: {
      fr: "Tombé impeccable, tissu non transparent. Reçue en 48 h à Alger.",
      ar: "القماش ممتاز وغير شفاف. وصلت خلال يومين إلى الجزائر.",
    },
    createdAt: "2026-07-12T10:00:00.000Z",
  },
  {
    id: "r2",
    productId: "p_silk_dress",
    author: "Sarah K.",
    rating: 5,
    comment: {
      fr: "Coupe fidèle, je prends toujours un M chez Velora.",
      ar: "القصة دقيقة، أختار دائماً مقاس M.",
    },
    createdAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "r3",
    productId: "p_leather_tote",
    author: "Nour D.",
    rating: 5,
    comment: {
      fr: "Le cuir est dense, les coutures propres. Un vrai sac de tous les jours.",
      ar: "الجلد متين والخياطة نظيفة. حقيبة يومية ممتازة.",
    },
    createdAt: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "r4",
    productId: "p_linen_shirt",
    author: "Yasmine L.",
    rating: 4,
    comment: {
      fr: "Très belle, un peu ample : prenez une taille en dessous si vous aimez près du corps.",
      ar: "جميلة جداً وواسعة قليلاً. اختاري مقاساً أصغر للقصة الضيقة.",
    },
    createdAt: "2026-04-09T10:00:00.000Z",
  },
  {
    id: "r5",
    productId: "p_city_sneaker",
    author: "Karim M.",
    rating: 5,
    comment: {
      fr: "Confort immédiat, look discret. Paiement à la livraison sans souci.",
      ar: "مريحة من أول يوم ومظهر هادئ. الدفع عند الاستلام تم بسلاسة.",
    },
    createdAt: "2026-07-30T10:00:00.000Z",
  },
  {
    id: "r6",
    productId: "p_wool_blazer",
    author: "Riad H.",
    rating: 5,
    comment: {
      fr: "Épaule naturelle, pas trop cintrée. Qualité au-dessus du prix.",
      ar: "كتف طبيعي وغير ضيق. الجودة أعلى من السعر.",
    },
    createdAt: "2026-03-22T10:00:00.000Z",
  },
];
