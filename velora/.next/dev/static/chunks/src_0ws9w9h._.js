(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/store/homepage-image.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomepageImage",
    ()=>HomepageImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function HomepageImage({ src, alt, className = "", imageClassName = "" }) {
    _s();
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!src || failed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex h-full min-h-40 items-center justify-center bg-stone-200 text-sm text-stone-600 ${className}`,
            role: "img",
            "aria-label": alt,
            children: alt
        }, void 0, false, {
            fileName: "[project]/src/components/store/homepage-image.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            fill: true,
            unoptimized: true,
            src: src,
            alt: alt,
            className: `object-cover ${imageClassName}`,
            onError: ()=>setFailed(true)
        }, void 0, false, {
            fileName: "[project]/src/components/store/homepage-image.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/store/homepage-image.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(HomepageImage, "BFa/7w0IiJnSoWJxZHxuU4kOwF4=");
_c = HomepageImage;
var _c;
__turbopack_context__.k.register(_c, "HomepageImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/store/store-homepage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreHomepage",
    ()=>StoreHomepage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/homepage/content.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/homepage-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$store$2f$homepage$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/store/homepage-image.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/catalog-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function text(value, locale) {
    return locale === "ar" ? value.ar : value.fr;
}
function formatPrice(price, locale) {
    return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
        style: "currency",
        currency: "DZD",
        maximumFractionDigits: 0
    }).format(price);
}
function localizedHref(href, locale) {
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
    if (href === `/${locale}` || href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}?`)) {
        return href;
    }
    return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}
function ProductCards({ products, locale }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4",
        children: products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/${locale}/product/${product.slug}`,
                className: "group min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aspect-[4/5] overflow-hidden bg-stone-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$store$2f$homepage$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomepageImage"], {
                            src: product.images[0]?.url ?? "",
                            alt: text(product.name, locale),
                            className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        }, void 0, false, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/store/store-homepage.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "line-clamp-2 text-sm font-medium text-stone-900 sm:text-base",
                                children: text(product.name, locale)
                            }, void 0, false, {
                                fileName: "[project]/src/components/store/store-homepage.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-stone-700",
                                children: formatPrice(product.price, locale)
                            }, void 0, false, {
                                fileName: "[project]/src/components/store/store-homepage.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/store/store-homepage.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, product.id, true, {
                fileName: "[project]/src/components/store/store-homepage.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/store/store-homepage.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = ProductCards;
function SectionView({ section, content, locale, products, categories }) {
    const title = "title" in section ? text(section.title, locale) : "";
    const sectionSurface = {
        atelier: "bg-white",
        minimal: "bg-stone-50",
        lookbook: "bg-stone-100"
    }[content.theme];
    if (!section.visible) return null;
    if (section.id === "hero") {
        const themeClass = {
            atelier: "min-h-[560px] md:min-h-[650px]",
            minimal: "min-h-[440px] md:min-h-[540px]",
            lookbook: "min-h-[600px] md:min-h-[720px]"
        }[content.theme];
        const heroDirection = locale === "ar" ? "text-right" : "text-left";
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: `relative isolate flex ${themeClass} items-end overflow-hidden bg-[#f4efe8]`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$store$2f$homepage$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomepageImage"], {
                    src: section.imageUrl,
                    alt: text(section.title, locale),
                    className: "pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40",
                    imageClassName: "object-contain object-right opacity-70"
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 -z-[5] bg-gradient-to-r from-[#f4efe8] via-[#f4efe8]/90 to-transparent rtl:bg-gradient-to-l"
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 text-stone-950 sm:px-8 sm:pb-16 md:pb-24 ${heroDirection}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 text-xs uppercase tracking-[0.24em] text-stone-600 sm:text-sm",
                            children: text(section.kicker, locale)
                        }, void 0, false, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-7xl",
                            children: text(section.title, locale)
                        }, void 0, false, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-5 max-w-xl text-base leading-7 text-stone-700 sm:text-lg",
                            children: text(section.body, locale)
                        }, void 0, false, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mt-8 flex flex-wrap gap-3 ${locale === "ar" ? "justify-start" : ""}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: localizedHref(section.primaryHref, locale),
                                    className: "bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800",
                                    children: text(section.primaryLabel, locale)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/store/store-homepage.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: localizedHref(section.secondaryHref, locale),
                                    className: "border border-stone-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-black/5",
                                    children: text(section.secondaryLabel, locale)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/store/store-homepage.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/store/store-homepage.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this);
    }
    if (section.id === "categories") {
        const available = new Set(categories.map((category)=>category.slug));
        const visibleCategories = section.items.filter((item)=>available.has(item.slug));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: `${sectionSurface} mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mb-7 text-2xl font-semibold text-stone-900 sm:mb-10 sm:text-3xl",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4",
                    children: visibleCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: localizedHref(category.href, locale),
                            className: "group relative aspect-[4/5] overflow-hidden bg-stone-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$store$2f$homepage$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomepageImage"], {
                                    src: category.imageUrl,
                                    alt: text(category.title, locale),
                                    className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/store/store-homepage.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-lg font-medium text-white",
                                    children: text(category.title, locale)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/store/store-homepage.tsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, category.slug, true, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 142,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/store/store-homepage.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this);
    }
    if (section.id === "featured" || section.id === "new-arrivals") {
        const selectedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productsForHomepageSection"])(section, products);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: `${sectionSurface} mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-7 flex items-end justify-between gap-4 sm:mb-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-semibold text-stone-900 sm:text-3xl",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/products`,
                            className: "shrink-0 text-sm text-stone-700 underline underline-offset-4",
                            children: locale === "ar" ? "عرض الكل" : "Tout voir"
                        }, void 0, false, {
                            fileName: "[project]/src/components/store/store-homepage.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this),
                selectedProducts.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCards, {
                    products: selectedProducts,
                    locale: locale
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "border border-stone-200 p-6 text-sm text-stone-600",
                    children: locale === "ar" ? "لا توجد منتجات في هذا القسم حالياً." : "Aucun produit dans cette section pour le moment."
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 177,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/store/store-homepage.tsx",
            lineNumber: 167,
            columnNumber: 7
        }, this);
    }
    if (section.id !== "editorial") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `${sectionSurface} mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-2 md:items-center md:gap-14 ${content.theme === "lookbook" ? "md:gap-20" : ""} ${locale === "ar" ? "md:[direction:rtl]" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aspect-[5/4] overflow-hidden bg-stone-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$store$2f$homepage$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomepageImage"], {
                    src: section.imageUrl,
                    alt: title,
                    className: "h-full w-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/src/components/store/store-homepage.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/store/store-homepage.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-stone-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs uppercase tracking-[0.2em] text-stone-600",
                        children: locale === "ar" ? "قصة فيلورا" : "L'esprit Velora"
                    }, void 0, false, {
                        fileName: "[project]/src/components/store/store-homepage.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-4 text-3xl font-semibold leading-tight sm:text-4xl",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/store/store-homepage.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-5 max-w-xl leading-7 text-stone-700",
                        children: text(section.body, locale)
                    }, void 0, false, {
                        fileName: "[project]/src/components/store/store-homepage.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-7 flex flex-wrap gap-x-6 gap-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: localizedHref(section.firstLinkHref, locale),
                                className: "text-sm font-semibold underline underline-offset-4",
                                children: text(section.firstLinkLabel, locale)
                            }, void 0, false, {
                                fileName: "[project]/src/components/store/store-homepage.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: localizedHref(section.secondLinkHref, locale),
                                className: "text-sm font-semibold underline underline-offset-4",
                                children: text(section.secondLinkLabel, locale)
                            }, void 0, false, {
                                fileName: "[project]/src/components/store/store-homepage.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/store/store-homepage.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/store/store-homepage.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/store/store-homepage.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
_c1 = SectionView;
function StoreHomepage({ locale }) {
    _s();
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogStore"])({
        "StoreHomepage.useCatalogStore[products]": (state)=>state.products
    }["StoreHomepage.useCatalogStore[products]"]);
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogStore"])({
        "StoreHomepage.useCatalogStore[categories]": (state)=>state.categories
    }["StoreHomepage.useCatalogStore[categories]"]);
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomepageStore"])({
        "StoreHomepage.useHomepageStore[content]": (state)=>state.content
    }["StoreHomepage.useHomepageStore[content]"]);
    const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomepageStore"])({
        "StoreHomepage.useHomepageStore[source]": (state)=>state.source
    }["StoreHomepage.useHomepageStore[source]"]);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomepageStore"])({
        "StoreHomepage.useHomepageStore[load]": (state)=>state.load
    }["StoreHomepage.useHomepageStore[load]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreHomepage.useEffect": ()=>{
            void load().catch({
                "StoreHomepage.useEffect": (error)=>{
                    console.error("Homepage content could not be loaded.", error);
                }
            }["StoreHomepage.useEffect"]);
        }
    }["StoreHomepage.useEffect"], [
        load
    ]);
    const homepage = source === "default" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultHomepageContent"])(categories) : content;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        dir: locale === "ar" ? "rtl" : "ltr",
        className: "min-h-screen bg-white",
        children: [
            ...homepage.sections
        ].sort((a, b)=>a.order - b.order).map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionView, {
                section: section,
                content: homepage,
                locale: locale,
                products: products,
                categories: categories
            }, section.id, false, {
                fileName: "[project]/src/components/store/store-homepage.tsx",
                lineNumber: 231,
                columnNumber: 11
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/store/store-homepage.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
_s(StoreHomepage, "ArDmclXLrmweMGmOzgp9n7BXlN0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomepageStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomepageStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$homepage$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomepageStore"]
    ];
});
_c2 = StoreHomepage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProductCards");
__turbopack_context__.k.register(_c1, "SectionView");
__turbopack_context__.k.register(_c2, "StoreHomepage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/homepage/content.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDefaultHomepageContent",
    ()=>createDefaultHomepageContent,
    "isHomepageContent",
    ()=>isHomepageContent,
    "moveHomepageSection",
    ()=>moveHomepageSection,
    "productsForHomepageSection",
    ()=>productsForHomepageSection,
    "updateHomepageProductSelection",
    ()=>updateHomepageProductSelection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog/seed.ts [app-client] (ecmascript)");
;
const local = (fr, ar)=>({
        fr,
        ar
    });
function createDefaultHomepageContent(categoryList = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"]) {
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
                body: local("Des pièces choisies, des matières sincères et une allure pensée pour chaque jour.", "قطع مختارة وخامات أصيلة وأناقة تناسب كل يوم."),
                imageUrl: "/images/velora-fashion-watermark.svg",
                primaryLabel: local("Découvrir la collection", "اكتشف جميع المنتجات"),
                primaryHref: "/products?view=all",
                secondaryLabel: local("Nos catégories", "تصفّح التصنيفات"),
                secondaryHref: "/categories"
            },
            {
                id: "categories",
                visible: true,
                order: 1,
                title: local("Explorer les univers", "اكتشف مجموعاتنا"),
                items: categoryList.map((category)=>({
                        slug: category.slug,
                        title: category.name,
                        imageUrl: category.image,
                        href: `/products?category=${encodeURIComponent(category.slug)}`
                    }))
            },
            {
                id: "featured",
                visible: true,
                order: 2,
                title: local("Pièces choisies", "مختارات فيلورا"),
                selectionMode: "automatic",
                productSlugs: []
            },
            {
                id: "editorial",
                visible: true,
                order: 3,
                title: local("Fabriqué pour durer", "صُنع ليدوم"),
                body: local("Nous choisissons des matières nobles et des coupes justes pour accompagner votre quotidien.", "نختار خامات نبيلة وقصّات متقنة لترافق تفاصيل يومك."),
                imageUrl: "/images/velora-fashion-watermark.svg",
                firstLinkLabel: local("La collection femme", "مجموعة النساء"),
                firstLinkHref: "/products?category=femme",
                secondLinkLabel: local("La collection homme", "مجموعة الرجال"),
                secondLinkHref: "/products?category=homme"
            },
            {
                id: "new-arrivals",
                visible: true,
                order: 4,
                title: local("Nouveautés", "وصل حديثاً"),
                selectionMode: "automatic",
                productSlugs: []
            }
        ]
    };
}
const isLocalized = (value)=>!!value && typeof value === "object" && typeof value.fr === "string" && typeof value.ar === "string";
function isHomepageContent(value) {
    if (!value || typeof value !== "object") return false;
    const content = value;
    if (content.version !== 1 || ![
        "atelier",
        "minimal",
        "lookbook"
    ].includes(content.theme ?? "") || !Array.isArray(content.sections)) {
        return false;
    }
    const ids = new Set();
    for (const section of content.sections){
        if (!section || typeof section !== "object" || ![
            "hero",
            "categories",
            "featured",
            "editorial",
            "new-arrivals"
        ].includes(section.id) || ids.has(section.id) || typeof section.visible !== "boolean" || typeof section.order !== "number" || !Number.isFinite(section.order) || !isLocalized(section.title)) {
            return false;
        }
        ids.add(section.id);
        if (section.id === "hero") {
            if (!isLocalized(section.kicker) || !isLocalized(section.body) || !isLocalized(section.primaryLabel) || typeof section.primaryHref !== "string" || !isLocalized(section.secondaryLabel) || typeof section.secondaryHref !== "string" || typeof section.imageUrl !== "string") return false;
        } else if (section.id === "categories") {
            if (!Array.isArray(section.items) || !section.items.every((item)=>!!item && typeof item.slug === "string" && isLocalized(item.title) && typeof item.imageUrl === "string" && typeof item.href === "string")) {
                return false;
            }
        } else if (section.id === "featured" || section.id === "new-arrivals") {
            if (![
                "automatic",
                "curated"
            ].includes(section.selectionMode) || !Array.isArray(section.productSlugs) || !section.productSlugs.every((slug)=>typeof slug === "string")) return false;
        } else if (section.id === "editorial") {
            if (!isLocalized(section.body) || typeof section.imageUrl !== "string" || !isLocalized(section.firstLinkLabel) || typeof section.firstLinkHref !== "string" || !isLocalized(section.secondLinkLabel) || typeof section.secondLinkHref !== "string") return false;
        }
    }
    return true;
}
function productsForHomepageSection(section, products) {
    const available = products.filter((product)=>product.active !== false);
    if (section.selectionMode === "curated") {
        const bySlug = new Map(available.map((product)=>[
                product.slug,
                product
            ]));
        return section.productSlugs.flatMap((slug)=>{
            const product = bySlug.get(slug);
            return product ? [
                product
            ] : [];
        });
    }
    const flag = section.id === "featured" ? "featured" : "isNew";
    return available.filter((product)=>product[flag]).slice(0, section.id === "featured" ? 8 : 4);
}
function moveHomepageSection(content, sectionId, direction) {
    const sections = [
        ...content.sections
    ].sort((a, b)=>a.order - b.order);
    const index = sections.findIndex((section)=>section.id === sectionId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= sections.length) return content;
    [sections[index], sections[target]] = [
        sections[target],
        sections[index]
    ];
    return {
        ...content,
        sections: sections.map((section, order)=>({
                ...section,
                order
            }))
    };
}
function updateHomepageProductSelection(section, slug, selected) {
    const productSlugs = selected ? section.productSlugs.includes(slug) ? section.productSlugs : [
        ...section.productSlugs,
        slug
    ] : section.productSlugs.filter((item)=>item !== slug);
    return {
        ...section,
        selectionMode: "curated",
        productSlugs
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/homepage/persistence.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchHomepageContent",
    ()=>fetchHomepageContent,
    "getHomepageSupabaseClient",
    ()=>getHomepageSupabaseClient,
    "persistHomepageContent",
    ()=>persistHomepageContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/homepage/content.ts [app-client] (ecmascript)");
;
;
let client;
function getHomepageSupabaseClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (client !== undefined) return client;
    const url = ("TURBOPACK compile-time value", "https://rxaurjwunbaojsbytayf.supabase.co");
    const key = ("TURBOPACK compile-time value", "sb_publishable_Cf-0AKZyCDSTLHKqRFiPWA_6rvEoVn4");
    client = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(url, key) : "TURBOPACK unreachable";
    return client;
}
async function fetchHomepageContent() {
    const supabase = getHomepageSupabaseClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from("store_homepage_content").select("content").eq("id", "default").maybeSingle();
    if (error) throw error;
    if (!data) return null;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHomepageContent"])(data.content)) {
        throw new Error("La configuration de la page d'accueil est invalide.");
    }
    return data.content;
}
async function persistHomepageContent(content) {
    const supabase = getHomepageSupabaseClient();
    if (!supabase) throw new Error("La base de données Supabase n'est pas configurée.");
    const { error } = await supabase.from("store_homepage_content").upsert({
        id: "default",
        content,
        updated_at: new Date().toISOString()
    }, {
        onConflict: "id"
    });
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/homepage-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useHomepageStore",
    ()=>useHomepageStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/homepage/content.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/homepage/persistence.ts [app-client] (ecmascript)");
"use client";
;
;
;
const STORAGE_KEY = "velora-homepage-content";
function readLocalContent() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHomepageContent"])(parsed) ? parsed : null;
    } catch  {
        return null;
    }
}
function cacheContent(content) {
    if ("TURBOPACK compile-time truthy", 1) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }
}
const useHomepageStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultHomepageContent"])(),
        source: "default",
        loading: false,
        saving: false,
        error: null,
        load: async ()=>{
            set({
                loading: true,
                error: null
            });
            try {
                const hasRemote = !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHomepageSupabaseClient"])();
                if (hasRemote) {
                    const remote = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchHomepageContent"])();
                    if (remote) {
                        cacheContent(remote);
                        set({
                            content: remote,
                            source: "database",
                            loading: false,
                            error: null
                        });
                        return;
                    }
                    set({
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultHomepageContent"])(),
                        source: "default",
                        loading: false,
                        error: null
                    });
                    return;
                }
                const local = readLocalContent();
                set({
                    content: local ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultHomepageContent"])(),
                    source: local ? "local" : "default",
                    loading: false,
                    error: null
                });
            } catch (error) {
                set({
                    loading: false,
                    error: error instanceof Error ? error.message : "Impossible de charger le contenu."
                });
                throw error;
            }
        },
        save: async (content)=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHomepageContent"])(content)) throw new Error("Le contenu de la page d'accueil est invalide.");
            set({
                saving: true,
                error: null
            });
            try {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHomepageSupabaseClient"])()) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$homepage$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistHomepageContent"])(content);
                    cacheContent(content);
                    set({
                        content,
                        source: "database",
                        saving: false,
                        error: null
                    });
                } else {
                    cacheContent(content);
                    set({
                        content,
                        source: "local",
                        saving: false,
                        error: null
                    });
                }
            } catch (error) {
                set({
                    saving: false,
                    error: error instanceof Error ? error.message : "Impossible d'enregistrer le contenu."
                });
                throw error;
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0ws9w9h._.js.map