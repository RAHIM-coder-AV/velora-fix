(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/analytics/analytics-scripts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnalyticsScripts",
    ()=>AnalyticsScripts,
    "trackInitiateCheckoutEvent",
    ()=>trackInitiateCheckoutEvent,
    "trackPurchaseEvent",
    ()=>trackPurchaseEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/settings-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics/consent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$pixels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics/pixels.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function track(eventName, data = {}) {
    if (("TURBOPACK compile-time value", "object") === "undefined" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketingConsentSnapshot"])() !== "accepted") return;
    if (window.fbq) window.fbq("track", eventName, data);
    else if (eventName !== "PageView") {
        window.__veloraPendingMetaEvents ??= [];
        window.__veloraPendingMetaEvents.push({
            event: eventName,
            data
        });
    }
    if (eventName === "PageView") window.ttq?.page?.();
    else if (window.ttq?.track) window.ttq.track(eventName, data);
    else if (eventName !== "PageView") {
        window.__veloraPendingTikTokEvents ??= [];
        window.__veloraPendingTikTokEvents.push({
            event: eventName,
            data
        });
    }
}
function trackInitiateCheckoutEvent(data) {
    track("InitiateCheckout", {
        content_ids: [
            data.productId
        ],
        content_name: data.productName,
        content_type: "product",
        value: data.value,
        currency: "DZD",
        num_items: data.quantity
    });
}
function trackPurchaseEvent(orderData) {
    const data = {
        value: orderData.total,
        currency: orderData.currency || "DZD",
        content_type: "product",
        content_ids: orderData.items?.map((item)=>item.productId).filter((id)=>Boolean(id)),
        order_id: orderData.orderId
    };
    if (("TURBOPACK compile-time value", "object") === "undefined" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketingConsentSnapshot"])() !== "accepted") return;
    window.fbq?.("track", "Purchase", data);
    window.ttq?.track?.("CompletePayment", data);
}
function AnalyticsScripts() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const pixels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsStore"])({
        "AnalyticsScripts.useSettingsStore[pixels]": (state)=>state.settings.pixels
    }["AnalyticsScripts.useSettingsStore[pixels]"]);
    const refreshPixels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsStore"])({
        "AnalyticsScripts.useSettingsStore[refreshPixels]": (state)=>state.refreshPixels
    }["AnalyticsScripts.useSettingsStore[refreshPixels]"]);
    const consent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToMarketingConsent"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketingConsentSnapshot"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverMarketingConsentSnapshot"]);
    const metaIds = consent === "accepted" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$pixels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enabledMetaPixelIds"])(pixels) : [];
    const tiktokIds = consent === "accepted" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$pixels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enabledTikTokPixelIds"])(pixels) : [];
    const lastPathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(pathname);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnalyticsScripts.useEffect": ()=>{
            void refreshPixels().catch({
                "AnalyticsScripts.useEffect": (error)=>{
                    console.error("Failed to load public pixel settings", error);
                }
            }["AnalyticsScripts.useEffect"]);
        }
    }["AnalyticsScripts.useEffect"], [
        refreshPixels
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnalyticsScripts.useEffect": ()=>{
            if (lastPathname.current === pathname) return;
            lastPathname.current = pathname;
            if (consent !== "accepted") return;
            track("PageView");
        }
    }["AnalyticsScripts.useEffect"], [
        consent,
        pathname
    ]);
    const metaBootstrap = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    var ids=${JSON.stringify(metaIds)};
    window.__veloraMetaInitialized=window.__veloraMetaInitialized||[];
    ids.forEach(function(id){if(!window.__veloraMetaInitialized.includes(id)){fbq('init',id);window.__veloraMetaInitialized.push(id);fbq('trackSingle',id,'PageView')}});
    var queued=window.__veloraPendingMetaEvents||[];
    queued.forEach(function(item){fbq('track',item.event,item.data)});
    window.__veloraPendingMetaEvents=[];
  `;
    const tiktokBootstrap = `
    !function(w,d,t){
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
      if(!ttq.load){
        ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){for(var e=0,n=ttq._i[t]||[];e<ttq.methods.length;e++)ttq.setAndDefer(n,ttq.methods[e]);return n};
        ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
      }
      var ids=${JSON.stringify(tiktokIds)};
      window.__veloraTikTokInitialized=window.__veloraTikTokInitialized||[];
      ids.forEach(function(id){if(!window.__veloraTikTokInitialized.includes(id)){ttq.load(id);window.__veloraTikTokInitialized.push(id);ttq.instance(id).page()}});
      var queued=window.__veloraPendingTikTokEvents||[];
      queued.forEach(function(item){ttq.track(item.event,item.data)});
      window.__veloraPendingTikTokEvents=[];
    }(window,document,'ttq');
  `;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            metaIds.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: `velora-meta-pixels-${metaIds.join("-")}`,
                strategy: "afterInteractive",
                children: metaBootstrap
            }, void 0, false, {
                fileName: "[project]/src/components/analytics/analytics-scripts.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            tiktokIds.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: `velora-tiktok-pixels-${tiktokIds.join("-")}`,
                strategy: "afterInteractive",
                children: tiktokBootstrap
            }, void 0, false, {
                fileName: "[project]/src/components/analytics/analytics-scripts.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analytics/analytics-scripts.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s(AnalyticsScripts, "G6/eVtQ6NvE/+uLbYCQqHIO8bZs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = AnalyticsScripts;
var _c;
__turbopack_context__.k.register(_c, "AnalyticsScripts");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analytics/marketing-consent-banner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketingConsentBanner",
    ()=>MarketingConsentBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics/consent.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function MarketingConsentBanner() {
    _s();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const consent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToMarketingConsent"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketingConsentSnapshot"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverMarketingConsentSnapshot"]);
    if (consent !== null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetMarketingConsent"],
            className: "fixed bottom-3 end-3 z-[80] rounded-full border border-zinc-600 bg-zinc-950 px-3 py-2 text-[11px] font-bold text-white shadow-lg hover:bg-zinc-800",
            children: locale === "ar" ? "الخصوصية" : "Confidentialité"
        }, void 0, false, {
            fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        dir: locale === "ar" ? "rtl" : "ltr",
        className: "fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white shadow-2xl",
        "aria-label": locale === "ar" ? "إعدادات ملفات التتبع" : "Préférences de suivi",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-bold",
                children: locale === "ar" ? "الخصوصية وملفات التتبع" : "Confidentialité et suivi"
            }, void 0, false, {
                fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-xs leading-5 text-zinc-300",
                children: locale === "ar" ? "لن يتم تحميل Meta أو TikTok إلا إذا وافقت على التسويق. لا تُرسل بيانات الاتصال إلى منصات الإعلانات." : "Meta et TikTok ne seront chargés qu'avec votre accord. Vos coordonnées ne sont jamais envoyées aux plateformes publicitaires."
            }, void 0, false, {
                fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-wrap gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setMarketingConsent"])("accepted"),
                        className: "rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200",
                        children: locale === "ar" ? "موافقة" : "Accepter"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$consent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setMarketingConsent"])("rejected"),
                        className: "rounded-lg border border-zinc-600 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800",
                        children: locale === "ar" ? "رفض" : "Refuser"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analytics/marketing-consent-banner.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(MarketingConsentBanner, "PYm1/nDUjvUPkto6JdsSQqMhNDs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = MarketingConsentBanner;
var _c;
__turbopack_context__.k.register(_c, "MarketingConsentBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/language-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function Footer() {
    _s();
    const { dict } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const hasMobileBottomNav = !pathname.includes("/admin") && !pathname.includes("/checkout");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    function onSubmit(e) {
        e.preventDefault();
        if (!email.includes("@")) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(dict.account.saved);
        setEmail("");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: `mt-auto border-t border-line bg-cream-2 ${hasMobileBottomNav ? "pb-20 md:pb-0" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:px-5 sm:py-14 md:grid-cols-4 md:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-serif text-2xl tracking-[0.24em]",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORE_NAME"]
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 27,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 max-w-xs text-sm leading-6 text-muted",
                                children: dict.hero.subtitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm text-muted",
                                children: dict.footer.address
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted",
                                children: dict.footer.phone
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/footer.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] tracking-[0.2em] uppercase",
                                children: dict.footer.house
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-4 space-y-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                            href: "/categories",
                                            children: dict.nav.categories
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/footer.tsx",
                                            lineNumber: 36,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                            href: "/products",
                                            children: dict.nav.products
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/footer.tsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                            href: "/account",
                                            children: dict.footer.about
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/footer.tsx",
                                            lineNumber: 42,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/footer.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] tracking-[0.2em] uppercase",
                                children: dict.footer.service
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-4 space-y-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                            href: "/checkout",
                                            children: dict.footer.shipping
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/footer.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                            href: "/account",
                                            children: dict.footer.returns
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/footer.tsx",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                            href: "/login",
                                            children: dict.footer.contact
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/footer.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 55,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/footer.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] tracking-[0.2em] uppercase",
                                children: dict.footer.newsletter
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm text-muted",
                                children: dict.footer.newsletterHint
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: onSubmit,
                                className: "mt-4 flex border-b border-ink",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        type: "email",
                                        required: true,
                                        className: "w-full bg-transparent py-2 text-sm outline-none",
                                        placeholder: "email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "text-[11px] tracking-[0.16em] uppercase",
                                        children: dict.footer.subscribe
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/footer.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/footer.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/footer.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/footer.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-line px-5 py-4 text-center text-xs text-muted md:px-8",
                children: [
                    "© ",
                    new Date().getFullYear(),
                    " ",
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORE_NAME"],
                    ". ",
                    dict.footer.rights
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/footer.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/footer.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(Footer, "iue+4VXOnMPtBF2loi1XEFKBXNA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/language-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageSwitcher",
    ()=>LanguageSwitcher,
    "LocaleLink",
    ()=>LocaleLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function LanguageSwitcher() {
    _s();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    function switchTo(next) {
        const parts = pathname.split("/");
        parts[1] = next;
        router.push(parts.join("/") || `/${next}`);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex shrink-0 items-center gap-1 text-[10px] tracking-[0.12em] uppercase sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]",
        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locales"].map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>switchTo(l),
                className: `px-1.5 py-2 ${l === locale ? "text-ink" : "text-muted hover:text-ink"}`,
                children: l
            }, l, false, {
                fileName: "[project]/src/components/layout/language-switcher.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/layout/language-switcher.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "G91+3UL/1U+pG0/rwsHwjoJ4e4A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LanguageSwitcher;
function LocaleLink({ href, children, className, onClick }) {
    _s1();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const path = href.startsWith("/") ? `/${locale}${href}` : href;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: path,
        className: className,
        onClick: onClick,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/layout/language-switcher.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s1(LocaleLink, "aQZd10leNxbqQbwDEUSVdOnDXm0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c1 = LocaleLink;
var _c, _c1;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
__turbopack_context__.k.register(_c1, "LocaleLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/mobile-bottom-nav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileBottomNav",
    ()=>MobileBottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.mjs [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.mjs [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/language-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/cart-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$hydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-hydrated.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function MobileBottomNav() {
    _s();
    const { locale, dict } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$hydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHydrated"])();
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "MobileBottomNav.useCartStore[count]": (s)=>s.items.reduce({
                "MobileBottomNav.useCartStore[count]": (n, i)=>n + i.quantity
            }["MobileBottomNav.useCartStore[count]"], 0)
    }["MobileBottomNav.useCartStore[count]"]);
    if (pathname.includes("/admin") || pathname.includes("/checkout")) return null;
    const items = [
        {
            href: "/",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
            label: dict.nav.home
        },
        {
            href: "/products",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"],
            label: dict.nav.products
        },
        {
            href: "/wishlist",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
            label: dict.nav.wishlist
        },
        {
            href: "/cart",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
            label: dict.nav.cart,
            badge: count
        },
        {
            href: "/account",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
            label: dict.nav.account
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] md:hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            className: "grid grid-cols-5 pb-1",
            children: items.map((item)=>{
                const href = `/${locale}${item.href === "/" ? "" : item.href}`;
                const active = pathname === href || item.href !== "/" && pathname.startsWith(href);
                const Icon = item.icon;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                        href: item.href,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex min-w-0 flex-col items-center gap-1 px-0.5 py-2 text-center text-[9px] leading-tight tracking-normal sm:text-[10px] sm:tracking-wide", active ? "text-ink" : "text-muted"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/mobile-bottom-nav.tsx",
                                lineNumber: 43,
                                columnNumber: 17
                            }, this),
                            item.label,
                            hydrated && item.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute end-4 top-1 h-1.5 w-1.5 rounded-full bg-ink"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/mobile-bottom-nav.tsx",
                                lineNumber: 46,
                                columnNumber: 19
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/mobile-bottom-nav.tsx",
                        lineNumber: 36,
                        columnNumber: 15
                    }, this)
                }, item.href, false, {
                    fileName: "[project]/src/components/layout/mobile-bottom-nav.tsx",
                    lineNumber: 35,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/layout/mobile-bottom-nav.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/mobile-bottom-nav.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(MobileBottomNav, "skws3cwpugErZLfTygzHQV3LhlE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$hydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHydrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = MobileBottomNav;
var _c;
__turbopack_context__.k.register(_c, "MobileBottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/cart-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$hydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-hydrated.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/language-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$search$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/search-bar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function Navbar() {
    _s();
    const { dict } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$hydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHydrated"])();
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "Navbar.useCartStore[count]": (s)=>s.items.reduce({
                "Navbar.useCartStore[count]": (n, i)=>n + i.quantity
            }["Navbar.useCartStore[count]"], 0)
    }["Navbar.useCartStore[count]"]);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "Navbar.useAuthStore[user]": (s)=>s.user
    }["Navbar.useAuthStore[user]"]);
    const links = [
        {
            href: "/",
            label: dict.nav.home
        },
        {
            href: "/products",
            label: dict.nav.products
        },
        {
            href: "/categories",
            label: dict.nav.categories
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 md:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "md:hidden",
                        onClick: ()=>setOpen(true),
                        "aria-label": "menu",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/navbar.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/navbar.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden items-center gap-6 text-[11px] tracking-[0.2em] uppercase md:flex",
                        children: links.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                href: l.href,
                                className: "hover:text-sand",
                                children: l.label
                            }, l.href, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/navbar.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                        href: "/",
                        className: "min-w-0 truncate text-center font-serif text-xl tracking-[0.16em] sm:text-2xl sm:tracking-[0.28em]",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORE_NAME"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/navbar.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 items-center gap-2 sm:gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$search$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchBar"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageSwitcher"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                href: "/wishlist",
                                "aria-label": dict.nav.wishlist,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/navbar.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                href: hydrated && user ? "/account" : "/login",
                                "aria-label": dict.nav.account,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/navbar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                href: "/cart",
                                className: "relative",
                                "aria-label": dict.nav.cart,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/navbar.tsx",
                                        lineNumber: 55,
                                        columnNumber: 13
                                    }, this),
                                    hydrated && count > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -end-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-cream",
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/navbar.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/navbar.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/navbar.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 overflow-y-auto bg-cream pb-[env(safe-area-inset-bottom)] md:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-5 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-serif text-xl tracking-[0.24em]",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORE_NAME"]
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setOpen(false),
                                "aria-label": dict.common.close,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/navbar.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/navbar.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6 px-5 pt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$search$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchBar"], {
                                compact: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            links.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                    href: l.href,
                                    className: "block font-serif text-3xl",
                                    onClick: ()=>setOpen(false),
                                    children: l.label
                                }, l.href, false, {
                                    fileName: "[project]/src/components/layout/navbar.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocaleLink"], {
                                href: "/login",
                                className: "block text-sm tracking-[0.16em] uppercase",
                                children: dict.nav.login
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/navbar.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/navbar.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/navbar.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/navbar.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(Navbar, "bymtMEwGjcdfz4vucYY2U3E8w30=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$hydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHydrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/search-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchBar",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function SearchBar({ compact = false }) {
    _s();
    const { locale, dict } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    function onSubmit(e) {
        e.preventDefault();
        const query = q.trim();
        if (!query) return;
        router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: onSubmit,
        className: compact ? "w-full" : "hidden md:block",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "relative block",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                    size: 15,
                    className: "pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/search-bar.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    value: q,
                    onChange: (e)=>setQ(e.target.value),
                    placeholder: dict.catalog.searchPlaceholder,
                    className: "w-full min-w-0 border-b border-line bg-transparent py-2 ps-9 pe-3 text-sm outline-none focus:border-ink"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/search-bar.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/search-bar.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/search-bar.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(SearchBar, "TXuOde1ozKOtfBzSPNMvHj6iQYM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$locale$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/store-chrome.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreChrome",
    ()=>StoreChrome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/mobile-bottom-nav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analytics$2f$marketing$2d$consent$2d$banner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analytics/marketing-consent-banner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$session$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/session-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function StoreChrome({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isAdmin = pathname?.split("/").includes("admin") ?? false;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navbar"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/store-chrome.tsx",
                lineNumber: 16,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "min-w-0 flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$session$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/store-chrome.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/store-chrome.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            !isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                        fileName: "[project]/src/components/layout/store-chrome.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MobileBottomNav"], {}, void 0, false, {
                        fileName: "[project]/src/components/layout/store-chrome.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analytics$2f$marketing$2d$consent$2d$banner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketingConsentBanner"], {}, void 0, false, {
                        fileName: "[project]/src/components/layout/store-chrome.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/store-chrome.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/store-chrome.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(StoreChrome, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = StoreChrome;
var _c;
__turbopack_context__.k.register(_c, "StoreChrome");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastHost",
    ()=>ToastHost,
    "toast",
    ()=>toast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ToastHost() {
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToastHost.useEffect": ()=>{
            function onToast(e) {
                const detail = e.detail;
                setMessage(detail);
                const t = setTimeout({
                    "ToastHost.useEffect.onToast.t": ()=>setMessage(null)
                }["ToastHost.useEffect.onToast.t"], 2400);
                return ({
                    "ToastHost.useEffect.onToast": ()=>clearTimeout(t)
                })["ToastHost.useEffect.onToast"];
            }
            window.addEventListener("velora-toast", onToast);
            return ({
                "ToastHost.useEffect": ()=>window.removeEventListener("velora-toast", onToast)
            })["ToastHost.useEffect"];
        }
    }["ToastHost.useEffect"], []);
    if (!message) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "rounded-full bg-ink px-4 py-2 text-sm text-cream shadow-lg",
            children: message
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(ToastHost, "dXBGEOfof7LOz1twfKe468PNGGg=");
_c = ToastHost;
function toast(message) {
    window.dispatchEvent(new CustomEvent("velora-toast", {
        detail: message
    }));
}
var _c;
__turbopack_context__.k.register(_c, "ToastHost");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/use-hydrated.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useHydrated",
    ()=>useHydrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const emptySubscribe = ()=>()=>{};
function useHydrated() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(emptySubscribe, {
        "useHydrated.useSyncExternalStore": ()=>true
    }["useHydrated.useSyncExternalStore"], {
        "useHydrated.useSyncExternalStore": ()=>false
    }["useHydrated.useSyncExternalStore"]);
}
_s(useHydrated, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/i18n/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultLocale",
    ()=>defaultLocale,
    "isLocale",
    ()=>isLocale,
    "localeDir",
    ()=>localeDir,
    "locales",
    ()=>locales
]);
const locales = [
    "fr",
    "ar"
];
const defaultLocale = "fr";
function isLocale(value) {
    return locales.includes(value);
}
function localeDir(locale) {
    return locale === "ar" ? "rtl" : "ltr";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/algeria-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALGERIA_WILAYAS",
    ()=>ALGERIA_WILAYAS,
    "getCommunesForWilaya",
    ()=>getCommunesForWilaya,
    "getWilayaName",
    ()=>getWilayaName
]);
const ALGERIA_WILAYAS = [
    {
        code: "01",
        nameAr: "01 - أدرار",
        nameFr: "01 - Adrar",
        communes: [
            "أدرار",
            "تيميمون",
            "رقان",
            "أولف",
            "زاوية كنتة",
            "تسفاوت",
            "فنوغيل"
        ]
    },
    {
        code: "02",
        nameAr: "02 - الشلف",
        nameFr: "02 - Chlef",
        communes: [
            "الشلف",
            "تنس",
            "بوقادير",
            "وادي الفضة",
            "أولاد فارس",
            "عين مران",
            "بني حواء"
        ]
    },
    {
        code: "03",
        nameAr: "03 - الأغواط",
        nameFr: "03 - Laghouat",
        communes: [
            "الأغواط",
            "أفلو",
            "قصر الحيران",
            "سيدي مخلوف",
            "بريدة",
            "عين ماضي"
        ]
    },
    {
        code: "04",
        nameAr: "04 - أم البواقي",
        nameFr: "04 - Oum El Bouaghi",
        communes: [
            "أم البواقي",
            "عين البيضاء",
            "عين مليلة",
            "مسكيانة",
            "سيقوس"
        ]
    },
    {
        code: "05",
        nameAr: "05 - باتنة",
        nameFr: "05 - Batna",
        communes: [
            "باتنة",
            "بريكة",
            "عين التوتة",
            "مروانة",
            "أريس",
            "نقاوس",
            "المعذر"
        ]
    },
    {
        code: "06",
        nameAr: "06 - بجاية",
        nameFr: "06 - Béjaïa",
        communes: [
            "بجاية",
            "أقبو",
            "أميزور",
            "سيدي عيش",
            "خراطة",
            "تيزي نبربر",
            "أوقاس"
        ]
    },
    {
        code: "07",
        nameAr: "07 - بسكرة",
        nameFr: "07 - Biskra",
        communes: [
            "بسكرة",
            "طولقة",
            "سيدي عقبة",
            "أولاد جلال",
            "الوطاية",
            "زريبة الوادي"
        ]
    },
    {
        code: "08",
        nameAr: "08 - بشار",
        nameFr: "08 - Béchar",
        communes: [
            "بشار",
            "القنادسة",
            "بني عباس",
            "العبادلة",
            "تاغيت",
            "تبلبالة"
        ]
    },
    {
        code: "09",
        nameAr: "09 - البليدة",
        nameFr: "09 - Blida",
        communes: [
            "البليدة",
            "بوفاريك",
            "أولاد يعيش",
            "العفرون",
            "موزاية",
            "بوقرة",
            "الأربعاء"
        ]
    },
    {
        code: "10",
        nameAr: "10 - البويرة",
        nameFr: "10 - Bouira",
        communes: [
            "البويرة",
            "الأخضرية",
            "سور الغزلان",
            "عين بسام",
            "مشدالة",
            "بئر غبالو"
        ]
    },
    {
        code: "11",
        nameAr: "11 - تمنراست",
        nameFr: "11 - Tamanrasset",
        communes: [
            "تمنراست",
            "عين أمقل",
            "إيدلس",
            "تاظروك",
            "أباليسا"
        ]
    },
    {
        code: "12",
        nameAr: "12 - تبسة",
        nameFr: "12 - Tébessa",
        communes: [
            "تبسة",
            "الونزة",
            "بئر العاتر",
            "الشريعة",
            "العوينات",
            "مرسط"
        ]
    },
    {
        code: "13",
        nameAr: "13 - تلمسان",
        nameFr: "13 - Tlemcen",
        communes: [
            "تلمسان",
            "مغنية",
            "منصورة",
            "سبدو",
            "الغزوات",
            "ندرومة",
            "شتوان"
        ]
    },
    {
        code: "14",
        nameAr: "14 - تيارت",
        nameFr: "14 - Tiaret",
        communes: [
            "تيارت",
            "السوقر",
            "فرندة",
            "قصر الشلالة",
            "مهدية",
            "الرحوية"
        ]
    },
    {
        code: "15",
        nameAr: "15 - تيزي وزو",
        nameFr: "15 - Tizi Ouzou",
        communes: [
            "تيزي وزو",
            "عزازقة",
            "ذراع الميزان",
            "بوغني",
            "الأربعاء نايث إيراثن",
            "تيقزيرت"
        ]
    },
    {
        code: "16",
        nameAr: "16 - الجزائر",
        nameFr: "16 - Alger",
        communes: [
            "الجزائر الوسطى",
            "باب الوادي",
            "حيدرة",
            "سيدي يحيى",
            "بن عكنون",
            "بئر مراد رايس",
            "المرادية",
            "القبة",
            "حسين داي",
            "الشراقة",
            "دالي إبراهيم",
            "الأبيار",
            "بئر خادم",
            "الدار البيضاء",
            "برج البحري",
            "برج الكيفان",
            "الرويبة",
            "الرغاية",
            "عين طاية",
            "زرالدة",
            "سطاوالي",
            "عين البنيان",
            "باب الزوار",
            "باش جراح",
            "الحراش",
            "بوزريعة",
            "براقي"
        ]
    },
    {
        code: "17",
        nameAr: "17 - الجلفة",
        nameFr: "17 - Djelfa",
        communes: [
            "الجلفة",
            "عين وسارة",
            "مسعد",
            "حاسي بحبح",
            "الشارف",
            "دار الشيوخ"
        ]
    },
    {
        code: "18",
        nameAr: "18 - جيجل",
        nameFr: "18 - Jijel",
        communes: [
            "جيجل",
            "طاهير",
            "الميلية",
            "العوانة",
            "زيامة منصورية",
            "الشقفة"
        ]
    },
    {
        code: "19",
        nameAr: "19 - سطيف",
        nameFr: "19 - Sétif",
        communes: [
            "سطيف",
            "العلمة",
            "عين ولمان",
            "عين الكبيرة",
            "عين أرنات",
            "بوقاعة",
            "جميلة"
        ]
    },
    {
        code: "20",
        nameAr: "20 - سعيدة",
        nameFr: "20 - Saïda",
        communes: [
            "سعيدة",
            "عين الحجر",
            "يوب",
            "الحساسنة",
            "أولاد خالد"
        ]
    },
    {
        code: "21",
        nameAr: "21 - سكيكدة",
        nameFr: "21 - Skikda",
        communes: [
            "سكيكدة",
            "القل",
            "عزابة",
            "الحروش",
            "تمالوس",
            "رمضان جمال"
        ]
    },
    {
        code: "22",
        nameAr: "22 - سيدي بلعباس",
        nameFr: "22 - Sidi Bel Abbès",
        communes: [
            "سيدي بلعباس",
            "تلاغ",
            "سفيزف",
            "بن باديس",
            "سيدي علي بوسيدي",
            "تنيرة"
        ]
    },
    {
        code: "23",
        nameAr: "23 - عنابة",
        nameFr: "23 - Annaba",
        communes: [
            "عنابة",
            "البوني",
            "سيدي عمار",
            "برحال",
            "الحجار",
            "شطايبي",
            "عين الباردة"
        ]
    },
    {
        code: "24",
        nameAr: "24 - قالمة",
        nameFr: "24 - Guelma",
        communes: [
            "قالمة",
            "وادي الزناتي",
            "بوشقوف",
            "هيليوبوليس",
            "حمام دباغ",
            "بلخير"
        ]
    },
    {
        code: "25",
        nameAr: "25 - قسنطينة",
        nameFr: "25 - Constantine",
        communes: [
            "قسنطينة",
            "الخروب",
            "علي منجلي",
            "حامة بوزيان",
            "ديدوش مراد",
            "زيغود يوسف",
            "عين سمارة"
        ]
    },
    {
        code: "26",
        nameAr: "26 - المدية",
        nameFr: "26 - Médéa",
        communes: [
            "المدية",
            "البرواقية",
            "قصر البخاري",
            "بني سليمان",
            "تابلاط",
            "وزرة"
        ]
    },
    {
        code: "27",
        nameAr: "27 - مستغانم",
        nameFr: "27 - Mostaganem",
        communes: [
            "مستغانم",
            "عين تدلس",
            "سيدي علي",
            "ماسرة",
            "بوقيرات",
            "حاسي ماماش"
        ]
    },
    {
        code: "28",
        nameAr: "28 - المسيلة",
        nameFr: "28 - M'Sila",
        communes: [
            "المسيلة",
            "بوسعادة",
            "سيدي عيسى",
            "مقرة",
            "عين الحجل",
            "حمام الضلعة"
        ]
    },
    {
        code: "29",
        nameAr: "29 - معسكر",
        nameFr: "29 - Mascara",
        communes: [
            "معسكر",
            "سيق",
            "تيغنيف",
            "المحمدية",
            "غريس",
            "واد الأبطال"
        ]
    },
    {
        code: "30",
        nameAr: "30 - ورقلة",
        nameFr: "30 - Ouargla",
        communes: [
            "ورقلة",
            "حاسي مسعود",
            "تقرت",
            "الرويسات",
            "سيدي خويلد",
            "الطيبات"
        ]
    },
    {
        code: "31",
        nameAr: "31 - وهران",
        nameFr: "31 - Oran",
        communes: [
            "وهران",
            "بئر الجير",
            "السانية",
            "عين الترك",
            "أرزيو",
            "بطيوة",
            "قديل",
            "مرسى الكبير",
            "بوتليليس"
        ]
    },
    {
        code: "32",
        nameAr: "32 - البيض",
        nameFr: "32 - El Bayadh",
        communes: [
            "البيض",
            "الأبيض سيدي الشيخ",
            "بوعلام",
            "بريزينة",
            "بوقطب"
        ]
    },
    {
        code: "33",
        nameAr: "33 - إليزي",
        nameFr: "33 - Illizi",
        communes: [
            "إليزي",
            "جانت",
            "إن أمناس",
            "برج عمر إدريس"
        ]
    },
    {
        code: "34",
        nameAr: "34 - برج بوعريريج",
        nameFr: "34 - Bordj Bou Arreridj",
        communes: [
            "برج بوعريريج",
            "رأس الوادي",
            "برج الغدير",
            "المنصورة",
            "مجانة"
        ]
    },
    {
        code: "35",
        nameAr: "35 - بومرداس",
        nameFr: "35 - Boumerdès",
        communes: [
            "بومرداس",
            "برج منايل",
            "دلس",
            "الرغاية الجديدة",
            "بودواو",
            "خميس الخشنة",
            "يسر",
            "الثنية"
        ]
    },
    {
        code: "36",
        nameAr: "36 - الطارف",
        nameFr: "36 - El Tarf",
        communes: [
            "الطارف",
            "القالة",
            "بن مهيدي",
            "بوحجار",
            "الذرعان",
            "البسباس"
        ]
    },
    {
        code: "37",
        nameAr: "37 - تندوف",
        nameFr: "37 - Tindouf",
        communes: [
            "تندوف",
            "أم العسل"
        ]
    },
    {
        code: "38",
        nameAr: "38 - تسمسيلت",
        nameFr: "38 - Tissemsilt",
        communes: [
            "تسمسيلت",
            "ثنية الحد",
            "برج بونعامة",
            "لرجام",
            "خميستي"
        ]
    },
    {
        code: "39",
        nameAr: "39 - الوادي",
        nameFr: "39 - El Oued",
        communes: [
            "الوادي",
            "قمار",
            "الدبيلة",
            "جامعة",
            "الرقيبة",
            "المقرن",
            "حاسي خليفة"
        ]
    },
    {
        code: "40",
        nameAr: "40 - خنشلة",
        nameFr: "40 - Khenchela",
        communes: [
            "خنشلة",
            "ششار",
            "قايس",
            "بوحمامة",
            "أولاد رشاش",
            "المحمل"
        ]
    },
    {
        code: "41",
        nameAr: "41 - سوق أهراس",
        nameFr: "41 - Souk Ahras",
        communes: [
            "سوق أهراس",
            "سدراتة",
            "مداوروش",
            "تاورة",
            "المراهنة"
        ]
    },
    {
        code: "42",
        nameAr: "42 - تيبازة",
        nameFr: "42 - Tipaza",
        communes: [
            "تيبازة",
            "شرشال",
            "القليعة",
            "بواسماعيل",
            "حجوط",
            "فوكة",
            "الداموس",
            "حمر العين"
        ]
    },
    {
        code: "43",
        nameAr: "43 - ميلة",
        nameFr: "43 - Mila",
        communes: [
            "ميلة",
            "شلغوم العيد",
            "فرجيوة",
            "تاجنانت",
            "قرارم قوقة",
            "سيدي مروان"
        ]
    },
    {
        code: "44",
        nameAr: "44 - عين الدفلى",
        nameFr: "44 - Aïn Defla",
        communes: [
            "عين الدفلى",
            "خميس مليانة",
            "مليانة",
            "العطاف",
            "جليدة",
            "الروينة"
        ]
    },
    {
        code: "45",
        nameAr: "45 - النعامة",
        nameFr: "45 - Naâma",
        communes: [
            "النعامة",
            "مشرية",
            "عين الصفراء",
            "مكمن بن عمار",
            "عسلة"
        ]
    },
    {
        code: "46",
        nameAr: "46 - عين تموشنت",
        nameFr: "46 - Aïn Témouchent",
        communes: [
            "عين تموشنت",
            "بني صاف",
            "حمام بوحجر",
            "العامرية",
            "عين الكيحل"
        ]
    },
    {
        code: "47",
        nameAr: "47 - غرداية",
        nameFr: "47 - Ghardaïa",
        communes: [
            "غرداية",
            "القرارة",
            "متليلي",
            "بريان",
            "بني يزقن",
            "العطف",
            "ضاية بن ضحوة"
        ]
    },
    {
        code: "48",
        nameAr: "48 - غليزان",
        nameFr: "48 - Relizane",
        communes: [
            "غليزان",
            "وادي ارهيو",
            "مازونة",
            "عمي موسى",
            "يلل",
            "زمورة"
        ]
    },
    {
        code: "49",
        nameAr: "49 - تيميمون",
        nameFr: "49 - Timimoun",
        communes: [
            "تيميمون",
            "أوقروت",
            "شروين",
            "تينركوك",
            "دل دول"
        ]
    },
    {
        code: "50",
        nameAr: "50 - برج باجي مختار",
        nameFr: "50 - Bordj Badji Mokhtar",
        communes: [
            "برج باجي مختار",
            "تيمياوين"
        ]
    },
    {
        code: "51",
        nameAr: "51 - أولاد جلال",
        nameFr: "51 - Ouled Djellal",
        communes: [
            "أولاد جلال",
            "سيدي خالد",
            "رأس الميعاد",
            "البسباس",
            "الشعيبة"
        ]
    },
    {
        code: "52",
        nameAr: "52 - بني عباس",
        nameFr: "52 - Béni Abbès",
        communes: [
            "بني عباس",
            "كرزاز",
            "الواتة",
            "طبلبلة",
            "أولاد خضير"
        ]
    },
    {
        code: "53",
        nameAr: "53 - عين صالح",
        nameFr: "53 - In Salah",
        communes: [
            "عين صالح",
            "فقارة الزاوية",
            "إينغر"
        ]
    },
    {
        code: "54",
        nameAr: "54 - عين قزام",
        nameFr: "54 - In Guezzam",
        communes: [
            "عين قزام",
            "تين زواتين"
        ]
    },
    {
        code: "55",
        nameAr: "55 - تقرت",
        nameFr: "55 - Touggourt",
        communes: [
            "تقرت",
            "النزلة",
            "تبسبست",
            "الطيبات",
            "تماسين",
            "المقارين"
        ]
    },
    {
        code: "56",
        nameAr: "56 - جانت",
        nameFr: "56 - Djanet",
        communes: [
            "جانت",
            "برج الحواس"
        ]
    },
    {
        code: "57",
        nameAr: "57 - المغير",
        nameFr: "57 - El M'Ghair",
        communes: [
            "المغير",
            "جامعة",
            "أم الطيور",
            "سيدي خليل",
            "المرارة"
        ]
    },
    {
        code: "58",
        nameAr: "58 - المنيعة",
        nameFr: "58 - El Meniaa",
        communes: [
            "المنيعة",
            "حاسي القارة",
            "حاسي الفحل"
        ]
    }
];
function getWilayaName(nameOrCode, locale = "ar") {
    const clean = nameOrCode.trim().toLowerCase();
    const match = ALGERIA_WILAYAS.find((w)=>w.code === nameOrCode || w.nameAr.toLowerCase().includes(clean) || w.nameFr.toLowerCase().includes(clean));
    if (!match) return nameOrCode;
    return locale === "ar" ? match.nameAr : match.nameFr;
}
function getCommunesForWilaya(wilayaValue) {
    if (!wilayaValue) return [];
    const clean = wilayaValue.trim().toLowerCase();
    const match = ALGERIA_WILAYAS.find((w)=>w.nameAr.toLowerCase().includes(clean) || w.nameFr.toLowerCase().includes(clean) || clean.includes(w.code));
    return match?.communes ?? [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/analytics/consent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMarketingConsent",
    ()=>getMarketingConsent,
    "marketingConsentSnapshot",
    ()=>marketingConsentSnapshot,
    "resetMarketingConsent",
    ()=>resetMarketingConsent,
    "serverMarketingConsentSnapshot",
    ()=>serverMarketingConsentSnapshot,
    "setMarketingConsent",
    ()=>setMarketingConsent,
    "subscribeToMarketingConsent",
    ()=>subscribeToMarketingConsent
]);
"use client";
const CONSENT_KEY = "velora_marketing_consent";
const CHANGE_EVENT = "velora:marketing-consent";
let memoryConsent = null;
function getMarketingConsent() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const value = window.localStorage.getItem(CONSENT_KEY);
        if (value === "accepted" || value === "rejected") memoryConsent = value;
        return value === "accepted" || value === "rejected" ? value : memoryConsent;
    } catch  {
        return memoryConsent;
    }
}
function setMarketingConsent(consent) {
    memoryConsent = consent;
    try {
        window.localStorage.setItem(CONSENT_KEY, consent);
    } catch (error) {
        console.error("Could not persist marketing consent", error);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}
function resetMarketingConsent() {
    memoryConsent = null;
    try {
        window.localStorage.removeItem(CONSENT_KEY);
    } catch (error) {
        console.error("Could not reset marketing consent", error);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}
function subscribeToMarketingConsent(onChange) {
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return ()=>{
        window.removeEventListener(CHANGE_EVENT, onChange);
        window.removeEventListener("storage", onChange);
    };
}
function marketingConsentSnapshot() {
    return getMarketingConsent();
}
function serverMarketingConsentSnapshot() {
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/analytics/pixels.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enabledMetaPixelIds",
    ()=>enabledMetaPixelIds,
    "enabledTikTokPixelIds",
    ()=>enabledTikTokPixelIds,
    "isValidMetaPixelId",
    ()=>isValidMetaPixelId,
    "isValidTikTokPixelId",
    ()=>isValidTikTokPixelId,
    "normalizePixelSettings",
    ()=>normalizePixelSettings
]);
const META_PIXEL_ID = /^\d{5,20}$/;
const TIKTOK_PIXEL_ID = /^[A-Za-z0-9_-]{10,64}$/;
function isValidMetaPixelId(value) {
    return value.trim() === "" || META_PIXEL_ID.test(value.trim());
}
function isValidTikTokPixelId(value) {
    return value.trim() === "" || TIKTOK_PIXEL_ID.test(value.trim());
}
function normalizeIds(value, count, pattern) {
    const values = Array.isArray(value) ? value : [];
    return Array.from({
        length: count
    }, (_, index)=>{
        const id = typeof values[index] === "string" ? values[index].trim() : "";
        return pattern.test(id) ? id : "";
    });
}
function normalizeEnabled(value, count) {
    const values = Array.isArray(value) ? value : [];
    return Array.from({
        length: count
    }, (_, index)=>values[index] === true);
}
function normalizePixelSettings(value) {
    const settings = value && typeof value === "object" ? value : {};
    return {
        metaPixelIds: normalizeIds(settings.metaPixelIds, 6, META_PIXEL_ID),
        metaPixelEnabled: normalizeEnabled(settings.metaPixelEnabled, 6),
        tiktokPixelIds: normalizeIds(settings.tiktokPixelIds, 4, TIKTOK_PIXEL_ID),
        tiktokPixelEnabled: normalizeEnabled(settings.tiktokPixelEnabled, 4)
    };
}
function enabledMetaPixelIds(settings) {
    const normalized = normalizePixelSettings(settings);
    return normalized.metaPixelIds.filter((id, index)=>id && normalized.metaPixelEnabled[index]);
}
function enabledTikTokPixelIds(settings) {
    const normalized = normalizePixelSettings(settings);
    return normalized.tiktokPixelIds.filter((id, index)=>id && normalized.tiktokPixelEnabled[index]);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/catalog/catalog-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLocalProductsToImport",
    ()=>getLocalProductsToImport,
    "isPersistedProductId",
    ()=>isPersistedProductId,
    "mergeCatalogProducts",
    ()=>mergeCatalogProducts,
    "removeSeedProducts",
    ()=>removeSeedProducts
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isPersistedProductId(id) {
    return UUID_RE.test(id);
}
function mergeCatalogProducts(persistedProducts, cachedProducts) {
    const persistedSlugs = new Set(persistedProducts.map((product)=>product.slug));
    const cachedOnlyProducts = cachedProducts.filter((product)=>!isPersistedProductId(product.id) && !persistedSlugs.has(product.slug));
    return [
        ...persistedProducts,
        ...cachedOnlyProducts
    ];
}
function removeSeedProducts(products, seedProducts) {
    const seedIds = new Set(seedProducts.map((product)=>product.id));
    const seedSlugs = new Set(seedProducts.map((product)=>product.slug));
    return products.filter((product)=>!seedIds.has(product.id) && !seedSlugs.has(product.slug));
}
function getLocalProductsToImport(products, seedProducts) {
    const seedIds = new Set(seedProducts.map((product)=>product.id));
    const seedSlugs = new Set(seedProducts.map((product)=>product.slug));
    const seenSlugs = new Set();
    return products.filter((product)=>{
        if (isPersistedProductId(product.id) || seedIds.has(product.id) || seedSlugs.has(product.slug)) {
            return false;
        }
        const slug = product.slug.trim();
        if (!slug || seenSlugs.has(slug)) return false;
        seenSlugs.add(slug);
        return true;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/catalog/queries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyFilters",
    ()=>applyFilters,
    "findVariant",
    ()=>findVariant,
    "getSeedCategories",
    ()=>getSeedCategories,
    "getSeedProduct",
    ()=>getSeedProduct,
    "getSeedProducts",
    ()=>getSeedProducts,
    "getSeedReviews",
    ()=>getSeedReviews,
    "relatedProducts",
    ()=>relatedProducts,
    "totalStock",
    ()=>totalStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog/seed.ts [app-client] (ecmascript)");
;
function applyFilters(list, filters = {}) {
    let next = list.filter((product)=>product.active !== false);
    if (filters.category) {
        next = next.filter((p)=>p.categoryId === filters.category || p.categoryId === categoryIdFromSlug(filters.category));
    }
    if (filters.minPrice != null) {
        next = next.filter((p)=>p.price >= filters.minPrice);
    }
    if (filters.maxPrice != null) {
        next = next.filter((p)=>p.price <= filters.maxPrice);
    }
    if (filters.q) {
        const q = filters.q.toLowerCase();
        next = next.filter((p)=>p.name.fr.toLowerCase().includes(q) || p.name.ar.includes(q) || p.description.fr.toLowerCase().includes(q) || p.description.ar.includes(q) || p.slug.includes(q));
    }
    switch(filters.sort){
        case "price-asc":
            next.sort((a, b)=>a.price - b.price);
            break;
        case "price-desc":
            next.sort((a, b)=>b.price - a.price);
            break;
        case "rating":
            next.sort((a, b)=>b.rating - a.rating);
            break;
        default:
            next.sort((a, b)=>+new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return next;
}
function categoryIdFromSlug(slugOrId) {
    const found = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].find((c)=>c.slug === slugOrId || c.id === slugOrId);
    return found?.id ?? slugOrId;
}
function getSeedCategories() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"];
}
function getSeedProducts() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"];
}
function getSeedProduct(slug) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].find((p)=>p.slug === slug || p.id === slug);
}
function getSeedReviews(productId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reviews"].filter((r)=>r.productId === productId);
}
function relatedProducts(product, all, limit = 4) {
    return all.filter((p)=>p.active !== false && p.id !== product.id && p.categoryId === product.categoryId).slice(0, limit);
}
function totalStock(product) {
    return product.variants.reduce((sum, v)=>sum + v.stock, 0);
}
function findVariant(product, size, colorHex) {
    return product.variants.find((v)=>v.size === size && v.colorHex === colorHex);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/catalog/seed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "products",
    ()=>products,
    "reviews",
    ()=>reviews
]);
const img = (id, w = 1400)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const categories = [
    {
        id: "cat_women",
        slug: "femme",
        name: {
            fr: "Femme",
            ar: "نساء"
        },
        description: {
            fr: "Silhouettes contemporaines, coupes précises et matières nobles.",
            ar: "قصّات معاصرة وأقمشة فاخرة لمجموعة نسائية أنيقة."
        },
        image: img("photo-1490481651871-ab68de25d43d")
    },
    {
        id: "cat_men",
        slug: "homme",
        name: {
            fr: "Homme",
            ar: "رجال"
        },
        description: {
            fr: "L’essentiel masculin, taillé pour le quotidien et les soirées.",
            ar: "أساسيات رجالية مصممة لليومي والمناسبات."
        },
        image: img("photo-1617137968427-85924c800a22")
    },
    {
        id: "cat_shoes",
        slug: "chaussures",
        name: {
            fr: "Chaussures",
            ar: "أحذية"
        },
        description: {
            fr: "Cuir, daim et sneakers sélectionnés pour la ville.",
            ar: "جلود ونماذج حضرية مختارة بعناية."
        },
        image: img("photo-1549298916-b41d501d3772")
    },
    {
        id: "cat_accessories",
        slug: "accessoires",
        name: {
            fr: "Accessoires",
            ar: "إكسسوارات"
        },
        description: {
            fr: "Sacs, ceintures et bijoux pour signer une allure.",
            ar: "حقائب وأحزمة ومجوهرات تُكمل الإطلالة."
        },
        image: img("photo-1590874103328-eac38a941956")
    }
];
function variant(product, size, colorFr, colorAr, hex, stock) {
    return {
        id: `${product}_${size}_${hex.replace("#", "")}`,
        sku: `${product.toUpperCase()}-${size}-${hex.replace("#", "")}`.slice(0, 32),
        size,
        color: {
            fr: colorFr,
            ar: colorAr
        },
        colorHex: hex,
        stock
    };
}
const products = [
    {
        id: "p_old_money",
        slug: "old-money",
        sku: "Ens",
        name: {
            fr: "Old money",
            ar: "Old money"
        },
        description: {
            fr: "T-shirt polo style Old Money confectionné en coton piqué haut de gamme avec col contrasté. Confort parfait et allure raffinée.",
            ar: "تيشرت بولو ستايل أولد موني (Old Money) عالي الجودة مع ياقة مميزة. قماش قطني مريح وفخم ومثالي للإطلالات الأنيقة اليومية."
        },
        categoryId: "cat_men",
        price: 1750,
        compareAtPrice: 2500,
        images: [
            {
                id: "om1",
                url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "Old money polo",
                    ar: "تيشرت أولد موني"
                }
            },
            {
                id: "om2",
                url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "Old money colors",
                    ar: "ألوان أولد موني"
                }
            },
            {
                id: "om3",
                url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "Old money detail",
                    ar: "تفاصيل التيشرت"
                }
            }
        ],
        sizes: [
            "M",
            "L",
            "XL",
            "XXL"
        ],
        colors: [
            {
                name: {
                    fr: "Blanc",
                    ar: "أبيض"
                },
                hex: "#FFFFFF"
            },
            {
                name: {
                    fr: "Marron",
                    ar: "بني"
                },
                hex: "#8B4513"
            },
            {
                name: {
                    fr: "Vert Olive",
                    ar: "زيتي"
                },
                hex: "#2E5A36"
            },
            {
                name: {
                    fr: "Bleu Nuit",
                    ar: "كحلي"
                },
                hex: "#1B2A4A"
            },
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#111111"
            }
        ],
        offers: [
            {
                id: "off_1",
                quantity: 1,
                title: {
                    ar: "تيشرت",
                    fr: "1 T-shirt"
                },
                price: 1750,
                originalPrice: 2500
            },
            {
                id: "off_2",
                quantity: 2,
                title: {
                    ar: "2 تيشرت",
                    fr: "2 T-shirts"
                },
                price: 3000,
                originalPrice: 5000,
                badge: {
                    ar: "الأكثر طلباً 🔥",
                    fr: "Populaire"
                }
            },
            {
                id: "off_3",
                quantity: 3,
                title: {
                    ar: "احصل على 3",
                    fr: "Pack 3 T-shirts"
                },
                price: 4500,
                originalPrice: 7500,
                badge: {
                    ar: "عرض التوفير 💰",
                    fr: "Économique"
                }
            }
        ],
        variants: [
            variant("p_old_money", "M", "Blanc", "أبيض", "#FFFFFF", 25),
            variant("p_old_money", "L", "Blanc", "أبيض", "#FFFFFF", 30),
            variant("p_old_money", "XL", "Blanc", "أبيض", "#FFFFFF", 20),
            variant("p_old_money", "XXL", "Blanc", "أبيض", "#FFFFFF", 15),
            variant("p_old_money", "M", "Marron", "بني", "#8B4513", 18),
            variant("p_old_money", "L", "Marron", "بني", "#8B4513", 22),
            variant("p_old_money", "XL", "Marron", "بني", "#8B4513", 14),
            variant("p_old_money", "M", "Vert Olive", "زيتي", "#2E5A36", 20),
            variant("p_old_money", "L", "Vert Olive", "زيتي", "#2E5A36", 25),
            variant("p_old_money", "XL", "Vert Olive", "زيتي", "#2E5A36", 16),
            variant("p_old_money", "M", "Noir", "أسود", "#111111", 30),
            variant("p_old_money", "L", "Noir", "أسود", "#111111", 35),
            variant("p_old_money", "XL", "Noir", "أسود", "#111111", 20)
        ],
        featured: true,
        isNew: true,
        active: true,
        views: 10030,
        rating: 5.0,
        reviewCount: 48,
        createdAt: "2026-04-01T10:00:00.000Z"
    },
    {
        id: "p_pantalon_lin",
        slug: "pantalon-lin",
        sku: "Pnt",
        name: {
            fr: "Pontalon lin",
            ar: "بنطلون كتان صيفي"
        },
        description: {
            fr: "Pantalon en pur lin européen, coupe droite et taille semi-élastique. Fraîcheur et élégance pour toutes occasions.",
            ar: "بنطلون مصنوع من الكتان الطبيعي المريح، بقصة كلاسيكية أنيقة تناسب جميع الإطلالات اليومية والمناسبات."
        },
        categoryId: "cat_men",
        price: 2000,
        compareAtPrice: 3000,
        images: [
            {
                id: "pl1",
                url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "Pantalon lin",
                    ar: "بنطلون كتان"
                }
            }
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Beige",
                    ar: "بيج"
                },
                hex: "#E8DCB8"
            },
            {
                name: {
                    fr: "Blanc",
                    ar: "أبيض"
                },
                hex: "#FFFFFF"
            },
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#1A1A1A"
            }
        ],
        offers: [
            {
                id: "pnt_1",
                quantity: 1,
                title: {
                    ar: "قطعة واحدة",
                    fr: "1 Pièce"
                },
                price: 2000,
                originalPrice: 3000
            },
            {
                id: "pnt_2",
                quantity: 2,
                title: {
                    ar: "2 قطع",
                    fr: "2 Pièces"
                },
                price: 3700,
                originalPrice: 6000,
                badge: {
                    ar: "الأكثر طلباً",
                    fr: "Populaire"
                }
            }
        ],
        variants: [
            variant("p_pantalon_lin", "M", "Beige", "بيج", "#E8DCB8", 47),
            variant("p_pantalon_lin", "L", "Beige", "بيج", "#E8DCB8", 32),
            variant("p_pantalon_lin", "XL", "Beige", "بيج", "#E8DCB8", 20)
        ],
        featured: true,
        isNew: true,
        active: true,
        views: 1519,
        rating: 4.9,
        reviewCount: 36,
        createdAt: "2026-03-20T10:00:00.000Z"
    },
    {
        id: "p_robe_rope",
        slug: "robe-rope",
        sku: "Rope",
        name: {
            fr: "Rope",
            ar: "فستان روب عصري"
        },
        description: {
            fr: "Robe d'été moderne en tissu léger et fluide, coupe ample et élégante.",
            ar: "روب صيفي بتصميم راقي وقماش ناعم وخفيف، إطلالة متميزة ومريحة."
        },
        categoryId: "cat_women",
        price: 3800,
        compareAtPrice: 5200,
        images: [
            {
                id: "rp1",
                url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "Rope",
                    ar: "روب"
                }
            }
        ],
        sizes: [
            "Standard",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Rose",
                    ar: "وردي"
                },
                hex: "#FFB6C1"
            },
            {
                name: {
                    fr: "Bleu ciel",
                    ar: "أزرق سماوي"
                },
                hex: "#87CEEB"
            }
        ],
        offers: [
            {
                id: "rp_1",
                quantity: 1,
                title: {
                    ar: "1 فستان",
                    fr: "1 Robe"
                },
                price: 3800,
                originalPrice: 5200
            },
            {
                id: "rp_2",
                quantity: 2,
                title: {
                    ar: "2 فساتين",
                    fr: "2 Robes"
                },
                price: 6900,
                originalPrice: 10400,
                badge: {
                    ar: "توفير",
                    fr: "Pack"
                }
            }
        ],
        variants: [
            variant("p_robe_rope", "Standard", "Rose", "وردي", "#FFB6C1", 16),
            variant("p_robe_rope", "XL", "Rose", "وردي", "#FFB6C1", 10)
        ],
        featured: true,
        isNew: false,
        active: true,
        views: 27585,
        rating: 4.8,
        reviewCount: 52,
        createdAt: "2026-03-15T10:00:00.000Z"
    },
    {
        id: "p_jacket_oversize",
        slug: "zip-veste-ovrzise",
        sku: "Jacket",
        name: {
            fr: "Zip Veste Ovrzise",
            ar: "سترة زيب أوفرسايز"
        },
        description: {
            fr: "Veste à capuche zippée oversize, molleton lourd et finitions soignées.",
            ar: "جاكيت هودي أوفرسايز بسحاب كامل، خامة قطنية شتوية دافئة وتصميم عصري شبابي."
        },
        categoryId: "cat_men",
        price: 2600,
        compareAtPrice: 3800,
        images: [
            {
                id: "jk1",
                url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "Zip Veste",
                    ar: "سترة أوفرسايز"
                }
            }
        ],
        sizes: [
            "M",
            "L",
            "XL",
            "XXL"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#111111"
            },
            {
                name: {
                    fr: "Gris",
                    ar: "رمادي"
                },
                hex: "#888888"
            }
        ],
        offers: [
            {
                id: "jk_1",
                quantity: 1,
                title: {
                    ar: "1 سترة",
                    fr: "1 Veste"
                },
                price: 2600,
                originalPrice: 3800
            },
            {
                id: "jk_2",
                quantity: 2,
                title: {
                    ar: "2 سترات",
                    fr: "2 Vestes"
                },
                price: 4800,
                originalPrice: 7600,
                badge: {
                    ar: "توفير",
                    fr: "Pack 2"
                }
            }
        ],
        variants: [
            variant("p_jacket_oversize", "L", "Noir", "أسود", "#111111", 177)
        ],
        featured: true,
        isNew: true,
        active: true,
        views: 8245,
        rating: 4.9,
        reviewCount: 29,
        createdAt: "2026-03-10T10:00:00.000Z"
    },
    {
        id: "p_linen_shirt",
        slug: "chemise-lin-ivoire",
        name: {
            fr: "Chemise lin ivoire",
            ar: "قميص كتان عاجي"
        },
        description: {
            fr: "Chemise en lin européen, col italien et coupe droite. Une pièce respirante, pensée pour les chaleurs d’Alger comme pour les dîners en terrasse.",
            ar: "قميص من الكتان الأوروبي بياقة إيطالية وقصة مستقيمة. قطعة خفيفة مناسبة لصيف الجزائر والأمسيات."
        },
        categoryId: "cat_women",
        price: 8900,
        compareAtPrice: 11200,
        images: [
            {
                id: "i1",
                url: img("photo-1487412720507-e7ab37603c6f"),
                alt: {
                    fr: "Chemise lin",
                    ar: "قميص كتان"
                }
            },
            {
                id: "i2",
                url: img("photo-1469334031216-e4b7dbe29b91"),
                alt: {
                    fr: "Détail chemise",
                    ar: "تفاصيل القميص"
                }
            }
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L"
        ],
        colors: [
            {
                name: {
                    fr: "Ivoire",
                    ar: "عاجي"
                },
                hex: "#EFE8DC"
            },
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#1A1A1A"
            }
        ],
        variants: [
            variant("p_linen_shirt", "XS", "Ivoire", "عاجي", "#EFE8DC", 8),
            variant("p_linen_shirt", "S", "Ivoire", "عاجي", "#EFE8DC", 12),
            variant("p_linen_shirt", "M", "Ivoire", "عاجي", "#EFE8DC", 10),
            variant("p_linen_shirt", "L", "Ivoire", "عاجي", "#EFE8DC", 6),
            variant("p_linen_shirt", "XS", "Noir", "أسود", "#1A1A1A", 4),
            variant("p_linen_shirt", "S", "Noir", "أسود", "#1A1A1A", 9),
            variant("p_linen_shirt", "M", "Noir", "أسود", "#1A1A1A", 7),
            variant("p_linen_shirt", "L", "Noir", "أسود", "#1A1A1A", 5)
        ],
        featured: true,
        isNew: true,
        rating: 4.8,
        reviewCount: 24,
        createdAt: "2026-03-12T10:00:00.000Z"
    },
    {
        id: "p_silk_dress",
        slug: "robe-satin-nuit",
        name: {
            fr: "Robe satin nuit",
            ar: "فستان ساتان ليلي"
        },
        description: {
            fr: "Robe midi en satin stretch, bretelles fines et fente discrète. Tombé fluide, doublure douce.",
            ar: "فستان ميدي من الساتان المرن بأكتاف رفيعة وشق خفيف. انسيابية أنيقة وبطانة ناعمة."
        },
        categoryId: "cat_women",
        price: 18900,
        images: [
            {
                id: "d1",
                url: img("photo-1515886657613-9f3515b0c78f"),
                alt: {
                    fr: "Robe satin",
                    ar: "فستان ساتان"
                }
            },
            {
                id: "d2",
                url: img("photo-1539109136881-3be0616adc40"),
                alt: {
                    fr: "Robe de soirée",
                    ar: "فستان سهرة"
                }
            }
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#111111"
            },
            {
                name: {
                    fr: "Bordeaux",
                    ar: "بورجوندي"
                },
                hex: "#5C1A2E"
            }
        ],
        variants: [
            variant("p_silk_dress", "XS", "Noir", "أسود", "#111111", 3),
            variant("p_silk_dress", "S", "Noir", "أسود", "#111111", 7),
            variant("p_silk_dress", "M", "Noir", "أسود", "#111111", 6),
            variant("p_silk_dress", "L", "Noir", "أسود", "#111111", 4),
            variant("p_silk_dress", "S", "Bordeaux", "بورجوندي", "#5C1A2E", 5),
            variant("p_silk_dress", "M", "Bordeaux", "بورجوندي", "#5C1A2E", 5)
        ],
        featured: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 41,
        createdAt: "2026-02-02T10:00:00.000Z"
    },
    {
        id: "p_wool_coat",
        slug: "manteau-laine-camel",
        name: {
            fr: "Manteau laine camel",
            ar: "معطف صوف جمل"
        },
        description: {
            fr: "Manteau long en laine mélangée, ceinture à nouer et poches plaquées. Une pièce d’hiver structurée.",
            ar: "معطف طويل من مزيج الصوف بحزام جيوب كلاسيكية. قطعة شتوية ببنية واضحة."
        },
        categoryId: "cat_women",
        price: 32900,
        images: [
            {
                id: "c1",
                url: img("photo-1539533018447-63fcce2678e3"),
                alt: {
                    fr: "Manteau camel",
                    ar: "معطف جمل"
                }
            },
            {
                id: "c2",
                url: img("photo-1544022613-e87ca75a784a"),
                alt: {
                    fr: "Manteau long",
                    ar: "معطف طويل"
                }
            }
        ],
        sizes: [
            "S",
            "M",
            "L"
        ],
        colors: [
            {
                name: {
                    fr: "Camel",
                    ar: "جملي"
                },
                hex: "#C4A574"
            }
        ],
        variants: [
            variant("p_wool_coat", "S", "Camel", "جملي", "#C4A574", 4),
            variant("p_wool_coat", "M", "Camel", "جملي", "#C4A574", 6),
            variant("p_wool_coat", "L", "Camel", "جملي", "#C4A574", 3)
        ],
        featured: true,
        isNew: true,
        rating: 4.7,
        reviewCount: 18,
        createdAt: "2026-04-20T10:00:00.000Z"
    },
    {
        id: "p_tailored_trouser",
        slug: "pantalon-tailleur-noir",
        name: {
            fr: "Pantalon tailleur noir",
            ar: "بنطلون رسمي أسود"
        },
        description: {
            fr: "Pantalon à plis, laine stretch, jambe droite. Taille haute, finition italienne.",
            ar: "بنطلون بطيات من الصوف المرن، ساق مستقيمة وخصر مرتفع."
        },
        categoryId: "cat_women",
        price: 9800,
        images: [
            {
                id: "t1",
                url: img("photo-1506629082955-511b1aa562c8"),
                alt: {
                    fr: "Pantalon tailleur",
                    ar: "بنطلون رسمي"
                }
            }
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#1C1C1C"
            }
        ],
        variants: [
            variant("p_tailored_trouser", "XS", "Noir", "أسود", "#1C1C1C", 6),
            variant("p_tailored_trouser", "S", "Noir", "أسود", "#1C1C1C", 11),
            variant("p_tailored_trouser", "M", "Noir", "أسود", "#1C1C1C", 9),
            variant("p_tailored_trouser", "L", "Noir", "أسود", "#1C1C1C", 8),
            variant("p_tailored_trouser", "XL", "Noir", "أسود", "#1C1C1C", 4)
        ],
        featured: false,
        isNew: false,
        rating: 4.6,
        reviewCount: 33,
        createdAt: "2026-01-14T10:00:00.000Z"
    },
    {
        id: "p_knit_polo",
        slug: "polo-maille-sable",
        name: {
            fr: "Polo maille sable",
            ar: "بولو تريكو رملي"
        },
        description: {
            fr: "Polo en coton pima, maille fine, boutons nacre. Coupe légèrement ajustée.",
            ar: "بولو من قطن بيما بتريكو ناعم وأزرار صدف. قصة متوسطة الضبط."
        },
        categoryId: "cat_men",
        price: 7200,
        images: [
            {
                id: "k1",
                url: img("photo-1617127365659-c47fa864d8bc"),
                alt: {
                    fr: "Polo maille",
                    ar: "بولو تريكو"
                }
            }
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Sable",
                    ar: "رملي"
                },
                hex: "#D8C3A5"
            },
            {
                name: {
                    fr: "Marine",
                    ar: "كحلي"
                },
                hex: "#1B2A4A"
            }
        ],
        variants: [
            variant("p_knit_polo", "S", "Sable", "رملي", "#D8C3A5", 10),
            variant("p_knit_polo", "M", "Sable", "رملي", "#D8C3A5", 14),
            variant("p_knit_polo", "L", "Sable", "رملي", "#D8C3A5", 12),
            variant("p_knit_polo", "XL", "Sable", "رملي", "#D8C3A5", 7),
            variant("p_knit_polo", "M", "Marine", "كحلي", "#1B2A4A", 9),
            variant("p_knit_polo", "L", "Marine", "كحلي", "#1B2A4A", 8)
        ],
        featured: true,
        isNew: true,
        rating: 4.5,
        reviewCount: 19,
        createdAt: "2026-05-01T10:00:00.000Z"
    },
    {
        id: "p_oxford_shirt",
        slug: "chemise-oxford-blanche",
        name: {
            fr: "Chemise oxford blanche",
            ar: "قميص أكسفورد أبيض"
        },
        description: {
            fr: "Oxford 100 % coton, col boutonné, poignet mousquetaire. Le classique du vestiaire masculin.",
            ar: "أكسفورد قطني بالكامل بياقة بأزرار. كلاسيكية الخزانة الرجالية."
        },
        categoryId: "cat_men",
        price: 7800,
        images: [
            {
                id: "o1",
                url: img("photo-1594938291221-94d7d52c986f"),
                alt: {
                    fr: "Chemise oxford",
                    ar: "قميص أكسفورد"
                }
            }
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Blanc",
                    ar: "أبيض"
                },
                hex: "#F5F5F0"
            }
        ],
        variants: [
            variant("p_oxford_shirt", "S", "Blanc", "أبيض", "#F5F5F0", 8),
            variant("p_oxford_shirt", "M", "Blanc", "أبيض", "#F5F5F0", 15),
            variant("p_oxford_shirt", "L", "Blanc", "أبيض", "#F5F5F0", 13),
            variant("p_oxford_shirt", "XL", "Blanc", "أبيض", "#F5F5F0", 6)
        ],
        featured: false,
        isNew: false,
        rating: 4.4,
        reviewCount: 27,
        createdAt: "2025-11-20T10:00:00.000Z"
    },
    {
        id: "p_wool_blazer",
        slug: "blazer-laine-charbon",
        name: {
            fr: "Blazer laine charbon",
            ar: "بليزر صوف فحمي"
        },
        description: {
            fr: "Veste deux boutons, épaule naturelle, doublure cupro. Peut se porter ouverte sur un t-shirt ou fermée en tenue de ville.",
            ar: "سترة بزرّين وكتف طبيعي وبطانة كوبرو. تُرتدى مفتوحة أو مغلقة."
        },
        categoryId: "cat_men",
        price: 24900,
        images: [
            {
                id: "b1",
                url: img("photo-1593032465175-481ac7f401a0"),
                alt: {
                    fr: "Blazer charbon",
                    ar: "بليزر فحمي"
                }
            }
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Charbon",
                    ar: "فحمي"
                },
                hex: "#2F2F2F"
            }
        ],
        variants: [
            variant("p_wool_blazer", "S", "Charbon", "فحمي", "#2F2F2F", 3),
            variant("p_wool_blazer", "M", "Charbon", "فحمي", "#2F2F2F", 7),
            variant("p_wool_blazer", "L", "Charbon", "فحمي", "#2F2F2F", 6),
            variant("p_wool_blazer", "XL", "Charbon", "فحمي", "#2F2F2F", 2)
        ],
        featured: true,
        isNew: false,
        rating: 4.8,
        reviewCount: 15,
        createdAt: "2026-01-28T10:00:00.000Z"
    },
    {
        id: "p_selvedge_jean",
        slug: "jean-selvedge-indigo",
        name: {
            fr: "Jean selvedge indigo",
            ar: "جينز سيلفيدج نيلي"
        },
        description: {
            fr: "Denim japonais 14 oz, coupe tapered, bouton cuivre. Se patine avec le temps.",
            ar: "دنيم ياباني 14 أونصة بقصة تايبرد. يكتسب شخصية مع الزمن."
        },
        categoryId: "cat_men",
        price: 11500,
        images: [
            {
                id: "j1",
                url: img("photo-1542272604-787c3835535d"),
                alt: {
                    fr: "Jean indigo",
                    ar: "جينز نيلي"
                }
            }
        ],
        sizes: [
            "30",
            "32",
            "34",
            "36"
        ],
        colors: [
            {
                name: {
                    fr: "Indigo",
                    ar: "نيلي"
                },
                hex: "#1E3A5F"
            }
        ],
        variants: [
            variant("p_selvedge_jean", "30", "Indigo", "نيلي", "#1E3A5F", 5),
            variant("p_selvedge_jean", "32", "Indigo", "نيلي", "#1E3A5F", 9),
            variant("p_selvedge_jean", "34", "Indigo", "نيلي", "#1E3A5F", 8),
            variant("p_selvedge_jean", "36", "Indigo", "نيلي", "#1E3A5F", 4)
        ],
        featured: false,
        isNew: true,
        rating: 4.6,
        reviewCount: 22,
        createdAt: "2026-06-08T10:00:00.000Z"
    },
    {
        id: "p_leather_oxford",
        slug: "derbies-cuir-noir",
        name: {
            fr: "Derbies cuir noir",
            ar: "دربي جلد أسود"
        },
        description: {
            fr: "Cuir de veau italien, semelle cuir, construction Goodyear. Entretien facile, allure nette.",
            ar: "جلد عجل إيطالي ونعل جلدي ببناء غوديير. أناقة واضحة."
        },
        categoryId: "cat_shoes",
        price: 16800,
        images: [
            {
                id: "s1",
                url: img("photo-1614252235316-8c704c769259"),
                alt: {
                    fr: "Derbies cuir",
                    ar: "حذاء دربي"
                }
            }
        ],
        sizes: [
            "40",
            "41",
            "42",
            "43",
            "44"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#101010"
            }
        ],
        variants: [
            variant("p_leather_oxford", "40", "Noir", "أسود", "#101010", 4),
            variant("p_leather_oxford", "41", "Noir", "أسود", "#101010", 6),
            variant("p_leather_oxford", "42", "Noir", "أسود", "#101010", 8),
            variant("p_leather_oxford", "43", "Noir", "أسود", "#101010", 7),
            variant("p_leather_oxford", "44", "Noir", "أسود", "#101010", 3)
        ],
        featured: true,
        isNew: false,
        rating: 4.7,
        reviewCount: 29,
        createdAt: "2026-02-18T10:00:00.000Z"
    },
    {
        id: "p_city_sneaker",
        slug: "baskets-cuir-ecru",
        name: {
            fr: "Baskets cuir écru",
            ar: "سنيكرز جلد فاتح"
        },
        description: {
            fr: "Sneaker minimaliste en cuir nappa, semelle crêpe, doublure cuir. Fabriquée pour la ville.",
            ar: "سنيكرز بسيطة من جلد نابا ونعل كريب. مصممة للمدينة."
        },
        categoryId: "cat_shoes",
        price: 13500,
        images: [
            {
                id: "n1",
                url: img("photo-1549298916-b41d501d3772"),
                alt: {
                    fr: "Baskets écru",
                    ar: "سنيكرز فاتحة"
                }
            }
        ],
        sizes: [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41",
            "42"
        ],
        colors: [
            {
                name: {
                    fr: "Écru",
                    ar: "فاتح"
                },
                hex: "#EDE6DA"
            }
        ],
        variants: [
            variant("p_city_sneaker", "36", "Écru", "فاتح", "#EDE6DA", 4),
            variant("p_city_sneaker", "37", "Écru", "فاتح", "#EDE6DA", 6),
            variant("p_city_sneaker", "38", "Écru", "فاتح", "#EDE6DA", 8),
            variant("p_city_sneaker", "39", "Écru", "فاتح", "#EDE6DA", 7),
            variant("p_city_sneaker", "40", "Écru", "فاتح", "#EDE6DA", 9),
            variant("p_city_sneaker", "41", "Écru", "فاتح", "#EDE6DA", 5),
            variant("p_city_sneaker", "42", "Écru", "فاتح", "#EDE6DA", 4)
        ],
        featured: true,
        isNew: true,
        rating: 4.5,
        reviewCount: 36,
        createdAt: "2026-07-02T10:00:00.000Z"
    },
    {
        id: "p_heel_sandal",
        slug: "sandales-talon-noir",
        name: {
            fr: "Sandales talon noir",
            ar: "صندل كعب أسود"
        },
        description: {
            fr: "Sandale à bride, talon 6 cm, cuir lisse. Équilibre entre tenue et confort de marche.",
            ar: "صندل بشريط وكعب 6 سم من الجلد الناعم. توازن بين الأناقة والراحة."
        },
        categoryId: "cat_shoes",
        price: 9900,
        images: [
            {
                id: "h1",
                url: img("photo-1543163521-1bf539c55dd2"),
                alt: {
                    fr: "Sandales talon",
                    ar: "صندل كعب"
                }
            }
        ],
        sizes: [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#0D0D0D"
            }
        ],
        variants: [
            variant("p_heel_sandal", "36", "Noir", "أسود", "#0D0D0D", 3),
            variant("p_heel_sandal", "37", "Noir", "أسود", "#0D0D0D", 7),
            variant("p_heel_sandal", "38", "Noir", "أسود", "#0D0D0D", 8),
            variant("p_heel_sandal", "39", "Noir", "أسود", "#0D0D0D", 6),
            variant("p_heel_sandal", "40", "Noir", "أسود", "#0D0D0D", 2)
        ],
        featured: false,
        isNew: false,
        rating: 4.3,
        reviewCount: 14,
        createdAt: "2026-04-04T10:00:00.000Z"
    },
    {
        id: "p_suede_loafer",
        slug: "mocassins-daim-taupe",
        name: {
            fr: "Mocassins daim taupe",
            ar: "موكاسين شمواه رمادي"
        },
        description: {
            fr: "Penny loafer en daim, semelle cuir-caoutchouc. Idéal du bureau à la casbah.",
            ar: "لوفر من الشمواه بنعل مختلط. مناسب للمكتب والمدينة."
        },
        categoryId: "cat_shoes",
        price: 14200,
        images: [
            {
                id: "l1",
                url: img("photo-1560769629-975ec94e6a86"),
                alt: {
                    fr: "Mocassins daim",
                    ar: "موكاسين شمواه"
                }
            }
        ],
        sizes: [
            "40",
            "41",
            "42",
            "43",
            "44"
        ],
        colors: [
            {
                name: {
                    fr: "Taupe",
                    ar: "رمادي دافئ"
                },
                hex: "#8A7A66"
            }
        ],
        variants: [
            variant("p_suede_loafer", "40", "Taupe", "رمادي دافئ", "#8A7A66", 5),
            variant("p_suede_loafer", "41", "Taupe", "رمادي دافئ", "#8A7A66", 6),
            variant("p_suede_loafer", "42", "Taupe", "رمادي دافئ", "#8A7A66", 7),
            variant("p_suede_loafer", "43", "Taupe", "رمادي دافئ", "#8A7A66", 4),
            variant("p_suede_loafer", "44", "Taupe", "رمادي دافئ", "#8A7A66", 3)
        ],
        featured: false,
        isNew: true,
        rating: 4.4,
        reviewCount: 11,
        createdAt: "2026-06-21T10:00:00.000Z"
    },
    {
        id: "p_leather_tote",
        slug: "cabas-cuir-noir",
        name: {
            fr: "Cabas cuir noir",
            ar: "حقيبة جلد أسود"
        },
        description: {
            fr: "Cabas structuré en cuir pleine fleur, poche intérieure zippée, anse épaule. Capacité réelle pour la journée.",
            ar: "حقيبة منظمة من الجلد الطبيعي مع جيب داخلي. سعة عملية لليوم."
        },
        categoryId: "cat_accessories",
        price: 21900,
        images: [
            {
                id: "a1",
                url: img("photo-1590874103328-eac38a941956"),
                alt: {
                    fr: "Cabas cuir",
                    ar: "حقيبة جلد"
                }
            }
        ],
        sizes: [
            "U"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#161616"
            }
        ],
        variants: [
            variant("p_leather_tote", "U", "Noir", "أسود", "#161616", 9)
        ],
        featured: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 48,
        createdAt: "2026-03-01T10:00:00.000Z"
    },
    {
        id: "p_silk_scarf",
        slug: "carre-soie-sable",
        name: {
            fr: "Carré soie sable",
            ar: "وشاح حرير رملي"
        },
        description: {
            fr: "Carré 90 × 90 en soie twill, ourlet roulotté main. Motif géométrique discret.",
            ar: "مربع حرير 90×90 بحاشية يدوية ونقشة هندسية هادئة."
        },
        categoryId: "cat_accessories",
        price: 6500,
        images: [
            {
                id: "sc1",
                url: img("photo-1601924994987-69e26d50dc26"),
                alt: {
                    fr: "Carré soie",
                    ar: "وشاح حرير"
                }
            }
        ],
        sizes: [
            "U"
        ],
        colors: [
            {
                name: {
                    fr: "Sable",
                    ar: "رملي"
                },
                hex: "#C8B59A"
            }
        ],
        variants: [
            variant("p_silk_scarf", "U", "Sable", "رملي", "#C8B59A", 18)
        ],
        featured: false,
        isNew: true,
        rating: 4.6,
        reviewCount: 9,
        createdAt: "2026-08-11T10:00:00.000Z"
    },
    {
        id: "p_gold_hoops",
        slug: "creoles-dorees",
        name: {
            fr: "Créoles dorées",
            ar: "حلق ذهبية"
        },
        description: {
            fr: "Créoles moyennes en acier doré 18k, fermoir sécurisé. Pièce quotidienne, légère.",
            ar: "حلق متوسطة من الفولاذ المطلي ذهب 18 قيراط. خفيفة لليومي."
        },
        categoryId: "cat_accessories",
        price: 3900,
        images: [
            {
                id: "g1",
                url: img("photo-1611652022419-a73b71080486"),
                alt: {
                    fr: "Créoles",
                    ar: "حلق"
                }
            }
        ],
        sizes: [
            "U"
        ],
        colors: [
            {
                name: {
                    fr: "Or",
                    ar: "ذهبي"
                },
                hex: "#C5A572"
            }
        ],
        variants: [
            variant("p_gold_hoops", "U", "Or", "ذهبي", "#C5A572", 25)
        ],
        featured: false,
        isNew: false,
        rating: 4.8,
        reviewCount: 52,
        createdAt: "2025-12-09T10:00:00.000Z"
    },
    {
        id: "p_leather_belt",
        slug: "ceinture-cuir-noir",
        name: {
            fr: "Ceinture cuir noir",
            ar: "حزام جلد أسود"
        },
        description: {
            fr: "Ceinture 3 cm, cuir tanné végétal, boucle brossée. Taille ajustable.",
            ar: "حزام 3 سم من الجلد المدبوغ نباتياً بإبزيم مصقول."
        },
        categoryId: "cat_accessories",
        price: 4200,
        images: [
            {
                id: "be1",
                url: img("photo-1624222247344-550fb60583c2"),
                alt: {
                    fr: "Ceinture cuir",
                    ar: "حزام جلد"
                }
            }
        ],
        sizes: [
            "85",
            "90",
            "95",
            "100"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#1A1A1A"
            }
        ],
        variants: [
            variant("p_leather_belt", "85", "Noir", "أسود", "#1A1A1A", 7),
            variant("p_leather_belt", "90", "Noir", "أسود", "#1A1A1A", 10),
            variant("p_leather_belt", "95", "Noir", "أسود", "#1A1A1A", 8),
            variant("p_leather_belt", "100", "Noir", "أسود", "#1A1A1A", 5)
        ],
        featured: false,
        isNew: false,
        rating: 4.5,
        reviewCount: 17,
        createdAt: "2026-02-25T10:00:00.000Z"
    },
    {
        id: "p_watch",
        slug: "montre-acier-ivoire",
        name: {
            fr: "Montre acier ivoire",
            ar: "ساعة فولاذ عاجية"
        },
        description: {
            fr: "Boîtier 36 mm, cadran ivoire, bracelet maille milanaise. Mouvement quartz suisse.",
            ar: "علبة 36 مم بوجه عاجي وسوار ميلانيز. حركة كوارتز سويسرية."
        },
        categoryId: "cat_accessories",
        price: 18500,
        images: [
            {
                id: "w1",
                url: img("photo-1523170335258-f5ed11844a49"),
                alt: {
                    fr: "Montre acier",
                    ar: "ساعة فولاذ"
                }
            }
        ],
        sizes: [
            "U"
        ],
        colors: [
            {
                name: {
                    fr: "Acier",
                    ar: "فضي"
                },
                hex: "#C0C0C0"
            }
        ],
        variants: [
            variant("p_watch", "U", "Acier", "فضي", "#C0C0C0", 6)
        ],
        featured: true,
        isNew: false,
        rating: 4.7,
        reviewCount: 21,
        createdAt: "2026-01-05T10:00:00.000Z"
    },
    {
        id: "p_cashmere_knit",
        slug: "pull-cachemire-grege",
        name: {
            fr: "Pull cachemire grège",
            ar: "كنزة كشمير بيج"
        },
        description: {
            fr: "Col rond, cachemire grade A, coupe relaxed. Une base précieuse du vestiaire.",
            ar: "كنزة بياقة دائرية من كشمير درجة أولى وقصة مريحة."
        },
        categoryId: "cat_women",
        price: 15900,
        images: [
            {
                id: "ca1",
                url: img("photo-1434389677669-e08b4cac3105"),
                alt: {
                    fr: "Pull cachemire",
                    ar: "كنزة كشمير"
                }
            }
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L"
        ],
        colors: [
            {
                name: {
                    fr: "Grège",
                    ar: "بيج"
                },
                hex: "#C5B8A5"
            }
        ],
        variants: [
            variant("p_cashmere_knit", "XS", "Grège", "بيج", "#C5B8A5", 4),
            variant("p_cashmere_knit", "S", "Grège", "بيج", "#C5B8A5", 8),
            variant("p_cashmere_knit", "M", "Grège", "بيج", "#C5B8A5", 7),
            variant("p_cashmere_knit", "L", "Grège", "بيج", "#C5B8A5", 5)
        ],
        featured: false,
        isNew: true,
        rating: 4.9,
        reviewCount: 13,
        createdAt: "2026-08-28T10:00:00.000Z"
    }
];
const reviews = [
    {
        id: "r1",
        productId: "p_silk_dress",
        author: "Amel B.",
        rating: 5,
        comment: {
            fr: "Tombé impeccable, tissu non transparent. Reçue en 48 h à Alger.",
            ar: "القماش ممتاز وغير شفاف. وصلت خلال يومين إلى الجزائر."
        },
        createdAt: "2026-07-12T10:00:00.000Z"
    },
    {
        id: "r2",
        productId: "p_silk_dress",
        author: "Sarah K.",
        rating: 5,
        comment: {
            fr: "Coupe fidèle, je prends toujours un M chez Velora.",
            ar: "القصة دقيقة، أختار دائماً مقاس M."
        },
        createdAt: "2026-06-02T10:00:00.000Z"
    },
    {
        id: "r3",
        productId: "p_leather_tote",
        author: "Nour D.",
        rating: 5,
        comment: {
            fr: "Le cuir est dense, les coutures propres. Un vrai sac de tous les jours.",
            ar: "الجلد متين والخياطة نظيفة. حقيبة يومية ممتازة."
        },
        createdAt: "2026-05-18T10:00:00.000Z"
    },
    {
        id: "r4",
        productId: "p_linen_shirt",
        author: "Yasmine L.",
        rating: 4,
        comment: {
            fr: "Très belle, un peu ample : prenez une taille en dessous si vous aimez près du corps.",
            ar: "جميلة جداً وواسعة قليلاً. اختاري مقاساً أصغر للقصة الضيقة."
        },
        createdAt: "2026-04-09T10:00:00.000Z"
    },
    {
        id: "r5",
        productId: "p_city_sneaker",
        author: "Karim M.",
        rating: 5,
        comment: {
            fr: "Confort immédiat, look discret. Paiement à la livraison sans souci.",
            ar: "مريحة من أول يوم ومظهر هادئ. الدفع عند الاستلام تم بسلاسة."
        },
        createdAt: "2026-07-30T10:00:00.000Z"
    },
    {
        id: "r6",
        productId: "p_wool_blazer",
        author: "Riad H.",
        rating: 5,
        comment: {
            fr: "Épaule naturelle, pas trop cintrée. Qualité au-dessus du prix.",
            ar: "كتف طبيعي وغير ضيق. الجودة أعلى من السعر."
        },
        createdAt: "2026-03-22T10:00:00.000Z"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CURRENCY_CODE",
    ()=>CURRENCY_CODE,
    "FREE_SHIPPING_THRESHOLD",
    ()=>FREE_SHIPPING_THRESHOLD,
    "SHIPPING_FEE",
    ()=>SHIPPING_FEE,
    "STORE_NAME",
    ()=>STORE_NAME,
    "WILAYAS",
    ()=>WILAYAS
]);
const WILAYAS = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arreridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Meniaa"
];
const CURRENCY_CODE = "DZD";
const FREE_SHIPPING_THRESHOLD = 25000;
const SHIPPING_FEE = 800;
const STORE_NAME = "VELORA";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/default-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_STORE_SETTINGS",
    ()=>DEFAULT_STORE_SETTINGS,
    "getDefaultWilayaPrices",
    ()=>getDefaultWilayaPrices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$algeria$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/algeria-data.ts [app-client] (ecmascript)");
;
function getDefaultWilayaPrices() {
    const map = {};
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$algeria$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALGERIA_WILAYAS"].forEach((w)=>{
        const codeNum = parseInt(w.code, 10);
        let home = 600;
        let desk = 400;
        // تسعير منطقي افتراضي حسب جغرافية الجزائر
        if (codeNum === 16) {
            // الجزائر العاصمة
            home = 400;
            desk = 250;
        } else if ([
            9,
            35,
            42
        ].includes(codeNum)) {
            // البليدة، بومرداس، تيبازة
            home = 500;
            desk = 350;
        } else if ([
            15,
            10,
            44,
            26,
            31,
            25,
            23,
            19
        ].includes(codeNum)) {
            // المدن الكبرى (وهران، قسنطينة، عنابة، سطيف...)
            home = 650;
            desk = 450;
        } else if ([
            11,
            33,
            37,
            50,
            53,
            54,
            56
        ].includes(codeNum) // الجنوب الكبير (تمنراست، جانت، إليزي، تندوف...)
        ) {
            home = 1200;
            desk = 900;
        } else if (codeNum >= 30) {
            // ولايات الجنوب
            home = 950;
            desk = 700;
        }
        map[w.code] = {
            code: w.code,
            nameAr: w.nameAr,
            nameFr: w.nameFr,
            homePrice: home,
            deskPrice: desk,
            enabled: true,
            deskEnabled: true
        };
    });
    return map;
}
const DEFAULT_STORE_SETTINGS = {
    shippingType: "custom",
    defaultHomePrice: 600,
    defaultDeskPrice: 400,
    freeShippingThreshold: 25000,
    wilayaPrices: getDefaultWilayaPrices(),
    ecotrack: {
        enabled: true,
        token: "",
        baseUrl: "https://api.ecotrack.dz/api/v1",
        shopId: "",
        autoSendConfirmed: false
    },
    nordEtOuest: {
        enabled: true,
        token: "",
        baseUrl: "https://api.nordetouest.com/api/v1",
        shopId: "",
        autoSendConfirmed: false
    },
    pixels: {
        metaPixelIds: Array(6).fill(""),
        metaPixelEnabled: Array(6).fill(false),
        tiktokPixelIds: Array(4).fill(""),
        tiktokPixelEnabled: Array(4).fill(false)
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/configured.ts [app-client] (ecmascript)");
;
;
function createClient() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) return null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://rxaurjwunbaojsbytayf.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_Cf-0AKZyCDSTLHKqRFiPWA_6rvEoVn4"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/configured.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function isSupabaseConfigured() {
    return Boolean(("TURBOPACK compile-time value", "https://rxaurjwunbaojsbytayf.supabase.co") && ("TURBOPACK compile-time value", "sb_publishable_Cf-0AKZyCDSTLHKqRFiPWA_6rvEoVn4"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completeAbandonedCheckout",
    ()=>completeAbandonedCheckout,
    "deleteProduct",
    ()=>deleteProduct,
    "deleteProducts",
    ()=>deleteProducts,
    "fetchAbandonedCheckouts",
    ()=>fetchAbandonedCheckouts,
    "fetchCatalog",
    ()=>fetchCatalog,
    "fetchOrders",
    ()=>fetchOrders,
    "fetchPixelSettings",
    ()=>fetchPixelSettings,
    "fetchProfile",
    ()=>fetchProfile,
    "insertProductIfMissing",
    ()=>insertProductIfMissing,
    "placeOrder",
    ()=>placeOrder,
    "saveAbandonedCheckout",
    ()=>saveAbandonedCheckout,
    "savePixelSettings",
    ()=>savePixelSettings,
    "seedCatalog",
    ()=>seedCatalog,
    "setVariantStock",
    ()=>setVariantStock,
    "updateOrderDelivery",
    ()=>updateOrderDelivery,
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "updateProductActive",
    ()=>updateProductActive,
    "upsertProduct",
    ()=>upsertProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog/seed.ts [app-client] (ecmascript)");
;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// ---------- Mappers ----------
const mapCategory = (r)=>({
        id: r.id,
        slug: r.slug,
        name: {
            fr: r.name_fr,
            ar: r.name_ar
        },
        description: {
            fr: r.description_fr,
            ar: r.description_ar
        },
        image: r.image
    });
function mapProduct(r, imgs, vars) {
    const images = [
        ...imgs
    ].sort((a, b)=>a.position - b.position).map((i)=>({
            id: i.id,
            url: i.url,
            alt: {
                fr: i.alt_fr,
                ar: i.alt_ar
            }
        }));
    const variants = vars.map((v)=>({
            id: v.id,
            sku: v.sku,
            size: v.size,
            color: {
                fr: v.color_fr,
                ar: v.color_ar
            },
            colorHex: v.color_hex,
            stock: v.stock,
            price: v.price ?? undefined
        }));
    const colorMap = new Map();
    for (const v of variants){
        if (!colorMap.has(v.colorHex)) colorMap.set(v.colorHex, {
            name: v.color,
            hex: v.colorHex
        });
    }
    return {
        id: r.id,
        slug: r.slug,
        name: {
            fr: r.name_fr,
            ar: r.name_ar
        },
        description: {
            fr: r.description_fr,
            ar: r.description_ar
        },
        categoryId: r.category_id,
        price: r.price,
        compareAtPrice: r.compare_at_price ?? undefined,
        sku: r.sku ?? undefined,
        images,
        variants,
        sizes: [
            ...new Set(variants.map((v)=>v.size))
        ],
        colors: [
            ...colorMap.values()
        ],
        offers: r.offers ?? [],
        active: r.active !== false,
        featured: r.featured,
        isNew: r.is_new,
        rating: 0,
        reviewCount: 0,
        createdAt: r.created_at
    };
}
const mapReview = (r)=>({
        id: r.id,
        productId: r.product_id,
        author: r.author,
        rating: r.rating,
        comment: {
            fr: r.comment_fr,
            ar: r.comment_ar
        },
        createdAt: r.created_at
    });
const mapProfile = (r, email = "")=>({
        id: r.id,
        email,
        fullName: r.full_name,
        phone: r.phone ?? undefined,
        address: r.address ?? undefined,
        wilaya: r.wilaya ?? undefined,
        role: r.role,
        createdAt: r.created_at
    });
const mapOrderItem = (r)=>({
        id: r.id,
        productId: r.product_id ?? "",
        variantId: r.variant_id ?? "",
        name: {
            fr: r.name_fr,
            ar: r.name_ar
        },
        size: r.size,
        color: {
            fr: r.color_fr,
            ar: r.color_ar
        },
        image: r.image,
        unitPrice: r.unit_price,
        quantity: r.quantity
    });
const mapOrder = (r)=>({
        id: r.id,
        reference: r.reference,
        userId: r.user_id ?? undefined,
        email: r.email,
        customerName: r.customer_name,
        phone: r.phone,
        wilaya: r.wilaya,
        commune: r.commune,
        address: r.address,
        notes: r.notes ?? undefined,
        status: r.status,
        paymentMethod: "cod",
        subtotal: r.subtotal,
        shipping: r.shipping,
        total: r.total,
        deliveryCompany: r.delivery_company ?? undefined,
        trackingCode: r.tracking_code ?? undefined,
        deliveryDispatchedAt: r.delivery_dispatched_at ?? undefined,
        labelUrl: r.label_url ?? undefined,
        createdAt: r.created_at,
        items: (r.order_items ?? []).map(mapOrderItem)
    });
async function fetchCatalog(sb) {
    const [cats, prods, imgs, vars, revs] = await Promise.all([
        sb.from("categories").select("*").order("created_at"),
        sb.from("products").select("*").order("created_at", {
            ascending: false
        }),
        sb.from("product_images").select("*").order("position"),
        sb.from("product_variants").select("*"),
        sb.from("reviews").select("*")
    ]);
    if (cats.error) throw cats.error;
    if (prods.error) throw prods.error;
    if (imgs.error) throw imgs.error;
    if (vars.error) throw vars.error;
    if (revs.error) throw revs.error;
    const imagesByProduct = new Map();
    for (const i of imgs.data ?? []){
        imagesByProduct.set(i.product_id, [
            ...imagesByProduct.get(i.product_id) ?? [],
            i
        ]);
    }
    const variantsByProduct = new Map();
    for (const v of vars.data ?? []){
        variantsByProduct.set(v.product_id, [
            ...variantsByProduct.get(v.product_id) ?? [],
            v
        ]);
    }
    const products = (prods.data ?? []).map((p)=>{
        const product = mapProduct(p, imagesByProduct.get(p.id) ?? [], variantsByProduct.get(p.id) ?? []);
        const productReviews = (revs.data ?? []).filter((r)=>r.product_id === p.id);
        product.reviewCount = productReviews.length;
        product.rating = productReviews.length ? productReviews.reduce((s, r)=>s + r.rating, 0) / productReviews.length : 0;
        return product;
    });
    const reviews = (revs.data ?? []).map(mapReview);
    return {
        categories: (cats.data ?? []).map(mapCategory),
        products,
        reviews
    };
}
async function placeOrder(sb, order, checkoutSessionId) {
    const payload = {
        checkout_session_id: checkoutSessionId ?? null,
        user_id: order.userId ?? null,
        email: order.email ?? "",
        customer_name: order.customerName,
        phone: order.phone,
        wilaya: order.wilaya,
        commune: order.commune,
        address: order.address,
        notes: order.notes ?? "",
        payment_method: order.paymentMethod,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        items: order.items.map((i)=>({
                product_id: i.productId,
                variant_id: i.variantId,
                name_fr: i.name.fr,
                name_ar: i.name.ar,
                size: i.size,
                color_fr: i.color.fr,
                color_ar: i.color.ar,
                image: i.image,
                unit_price: i.unitPrice,
                quantity: i.quantity
            }))
    };
    let { data, error } = await sb.rpc("place_order_with_checkout", {
        payload
    });
    if (error?.code === "PGRST202") {
        ({ data, error } = await sb.rpc("place_order", {
            payload
        }));
        if (!error && checkoutSessionId) {
            const completion = await sb.rpc("complete_abandoned_checkout", {
                p_session_id: checkoutSessionId,
                p_order_reference: data.reference
            });
            if (completion.error && completion.error.code !== "PGRST202") throw completion.error;
        }
    }
    if (error) throw error;
    return data.reference;
}
async function fetchOrders(sb, opts = {}) {
    let query = sb.from("orders").select("*, order_items(*)").order("created_at", {
        ascending: false
    });
    if (!opts.all) {
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return [];
        query = query.eq("user_id", user.id); // RLS يضاعف الحماية
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapOrder);
}
async function updateOrderStatus(sb, id, status) {
    const { error } = await sb.from("orders").update({
        status
    }).eq("id", id);
    if (error) throw error;
}
async function updateOrderDelivery(sb, id, delivery) {
    const { error } = await sb.from("orders").update({
        delivery_company: delivery.deliveryCompany,
        tracking_code: delivery.trackingCode,
        status: delivery.status,
        delivery_dispatched_at: delivery.dispatchedAt,
        label_url: delivery.labelUrl ?? null
    }).eq("id", id);
    if (error) throw error;
}
// ---------- Products (admin) ----------
async function resolveProductCategoryId(sb, categoryId, categoryIdOverride) {
    let resolvedCategoryId = categoryIdOverride ?? categoryId;
    if (!UUID_RE.test(resolvedCategoryId)) {
        const seedCategory = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].find((category)=>category.id === resolvedCategoryId);
        if (seedCategory) {
            const { data: existingCategory, error: lookupError } = await sb.from("categories").select("id").eq("slug", seedCategory.slug).maybeSingle();
            if (lookupError) throw lookupError;
            if (existingCategory) {
                resolvedCategoryId = existingCategory.id;
            } else {
                const { data: insertedCategory, error: insertError } = await sb.from("categories").insert({
                    slug: seedCategory.slug,
                    name_fr: seedCategory.name.fr,
                    name_ar: seedCategory.name.ar,
                    description_fr: seedCategory.description.fr,
                    description_ar: seedCategory.description.ar,
                    image: seedCategory.image
                }).select("id").single();
                if (insertError) throw insertError;
                resolvedCategoryId = insertedCategory.id;
            }
        } else {
            const { data: cats, error } = await sb.from("categories").select("id").limit(1);
            if (error) throw error;
            resolvedCategoryId = cats?.[0]?.id ?? "";
            if (!resolvedCategoryId) throw new Error("No categories in DB — run the seed first");
        }
    }
    return resolvedCategoryId;
}
function productDatabaseRow(p, categoryId) {
    const row = {
        slug: p.slug,
        name_fr: p.name.fr,
        name_ar: p.name.ar,
        description_fr: p.description.fr,
        description_ar: p.description.ar,
        category_id: categoryId,
        price: p.price,
        compare_at_price: p.compareAtPrice ?? null,
        sku: p.sku ?? null,
        active: p.active !== false,
        featured: p.featured,
        is_new: p.isNew,
        offers: p.offers ?? []
    };
    const persistedProduct = UUID_RE.test(p.id);
    if (persistedProduct) row.id = p.id;
    return row;
}
async function saveProductRelations(sb, productId, p) {
    const { data: currentVariants, error: variantsError } = await sb.from("product_variants").select("id").eq("product_id", productId);
    if (variantsError) throw variantsError;
    const { error: imageDeleteError } = await sb.from("product_images").delete().eq("product_id", productId);
    if (imageDeleteError) throw imageDeleteError;
    if (p.images.length) {
        const { error: e } = await sb.from("product_images").insert(p.images.map((img, i)=>({
                product_id: productId,
                url: img.url,
                alt_fr: img.alt.fr,
                alt_ar: img.alt.ar,
                position: i
            })));
        if (e) throw e;
    }
    const currentVariantIds = new Set((currentVariants ?? []).map((variant)=>variant.id));
    const retainedVariantIds = new Set(p.variants.filter((variant)=>currentVariantIds.has(variant.id)).map((variant)=>variant.id));
    const removedVariantIds = [
        ...currentVariantIds
    ].filter((id)=>!retainedVariantIds.has(id));
    if (removedVariantIds.length) {
        const { error } = await sb.from("product_variants").delete().in("id", removedVariantIds);
        if (error) throw error;
    }
    const variantRows = p.variants.map((variant, index)=>({
            ...retainedVariantIds.has(variant.id) ? {
                id: variant.id
            } : {},
            product_id: productId,
            sku: retainedVariantIds.has(variant.id) ? variant.sku : `${variant.sku}-${index}-${Date.now().toString(36)}`.slice(0, 32),
            size: variant.size,
            color_fr: variant.color.fr,
            color_ar: variant.color.ar,
            color_hex: variant.colorHex,
            stock: variant.stock,
            price: variant.price ?? null
        }));
    const existingRows = variantRows.filter((row)=>"id" in row);
    const newRows = variantRows.filter((row)=>!("id" in row));
    if (existingRows.length) {
        const { error } = await sb.from("product_variants").upsert(existingRows, {
            onConflict: "id"
        });
        if (error) throw error;
    }
    if (newRows.length) {
        const { error } = await sb.from("product_variants").insert(newRows);
        if (error) throw error;
    }
}
async function assertProductManagementSchema(sb) {
    const { error } = await sb.from("products").select("id, sku, active, offers").limit(0);
    if (!error) return;
    if (error.code === "42703") {
        throw new Error("Product management schema is not installed. Apply supabase/migrations/0003_product_admin_fields.sql before saving or importing products.");
    }
    throw error;
}
async function upsertProduct(sb, p, categoryIdOverride) {
    await assertProductManagementSchema(sb);
    const categoryId = await resolveProductCategoryId(sb, p.categoryId, categoryIdOverride);
    const row = productDatabaseRow(p, categoryId);
    const persistedProduct = UUID_RE.test(p.id);
    const { data: prod, error } = await sb.from("products").upsert(row, {
        onConflict: persistedProduct ? "id" : "slug"
    }).select("id").single();
    if (error) throw error;
    const productId = prod.id;
    await saveProductRelations(sb, productId, p);
    return productId;
}
async function insertProductIfMissing(sb, p) {
    await assertProductManagementSchema(sb);
    const { data: existing, error: lookupError } = await sb.from("products").select("id").eq("slug", p.slug).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return false;
    const categoryId = await resolveProductCategoryId(sb, p.categoryId);
    const row = productDatabaseRow(p, categoryId);
    delete row.id;
    const { data: inserted, error: insertError } = await sb.from("products").insert(row).select("id").single();
    if (insertError) {
        if (insertError.code === "23505") {
            const { data: duplicate, error } = await sb.from("products").select("id").eq("slug", p.slug).maybeSingle();
            if (error) throw error;
            if (duplicate) return false;
        }
        throw insertError;
    }
    const productId = inserted.id;
    try {
        await saveProductRelations(sb, productId, p);
    } catch (error) {
        try {
            const { data: removedProduct, error: cleanupError } = await sb.from("products").delete().eq("id", productId).select("id").maybeSingle();
            if (cleanupError) {
                throw new Error(`Related product data failed and the product row could not be cleaned up: ${cleanupError.message}`);
            }
            if (!removedProduct) {
                throw new Error("The inserted product row remains because database permissions prevented cleanup.");
            }
        } catch (cleanupError) {
            throw new Error(`Related product data failed; cleanup also failed (${cleanupError instanceof Error ? cleanupError.message : "unknown cleanup error"}). Original error: ${error instanceof Error ? error.message : "unknown error"}`);
        }
        throw error;
    }
    return true;
}
async function deleteProduct(sb, id) {
    const { data, error } = await sb.from("products").delete().eq("id", id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) {
        throw new Error("Product was not deleted: it may not exist or the current account lacks admin permission.");
    }
}
async function deleteProducts(sb, ids) {
    if (ids.length === 0) return 0;
    const invalidId = ids.find((id)=>!UUID_RE.test(id));
    if (invalidId) throw new Error("Bulk product deletion received an invalid product ID.");
    const uniqueIds = [
        ...new Set(ids)
    ];
    const { data, error } = await sb.from("products").delete().in("id", uniqueIds).select("id");
    if (error) throw error;
    const deleted = data?.length ?? 0;
    if (deleted !== uniqueIds.length) {
        throw new Error(`Only ${deleted} of ${uniqueIds.length} database products were deleted. Check admin permissions and refresh the catalog.`);
    }
    return deleted;
}
async function updateProductActive(sb, id, active) {
    await assertProductManagementSchema(sb);
    const { data, error } = await sb.from("products").update({
        active
    }).eq("id", id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) {
        throw new Error("Product status was not updated: it may not exist or the current account lacks admin permission.");
    }
}
async function setVariantStock(sb, variantId, stock) {
    const { data: current } = await sb.from("product_variants").select("stock").eq("id", variantId).single();
    const { error } = await sb.from("product_variants").update({
        stock: Math.max(0, stock)
    }).eq("id", variantId);
    if (error) throw error;
    const delta = stock - (current?.stock ?? 0);
    if (delta !== 0) {
        await sb.from("inventory_movements").insert({
            variant_id: variantId,
            delta,
            reason: "admin update"
        });
    }
}
async function fetchProfile(sb, userId) {
    const { data } = await sb.from("profiles").select("*").eq("id", userId).single();
    if (!data) return null;
    const { data: { user } } = await sb.auth.getUser();
    return mapProfile(data, user?.email ?? "");
}
async function fetchPixelSettings(sb) {
    const { data, error } = await sb.from("store_pixel_settings").select("meta_pixel_ids, meta_pixel_enabled, tiktok_pixel_ids, tiktok_pixel_enabled").eq("id", "default").maybeSingle();
    if (error) throw error;
    if (!data) {
        return {
            metaPixelIds: Array(6).fill(""),
            metaPixelEnabled: Array(6).fill(false),
            tiktokPixelIds: Array(4).fill(""),
            tiktokPixelEnabled: Array(4).fill(false)
        };
    }
    return {
        metaPixelIds: data.meta_pixel_ids,
        metaPixelEnabled: data.meta_pixel_enabled,
        tiktokPixelIds: data.tiktok_pixel_ids,
        tiktokPixelEnabled: data.tiktok_pixel_enabled
    };
}
async function savePixelSettings(sb, pixels) {
    const { error } = await sb.from("store_pixel_settings").upsert({
        id: "default",
        meta_pixel_ids: pixels.metaPixelIds,
        meta_pixel_enabled: pixels.metaPixelEnabled,
        tiktok_pixel_ids: pixels.tiktokPixelIds,
        tiktok_pixel_enabled: pixels.tiktokPixelEnabled,
        updated_at: new Date().toISOString()
    }, {
        onConflict: "id"
    });
    if (error) throw error;
}
async function saveAbandonedCheckout(sb, draft) {
    const { error } = await sb.rpc("save_abandoned_checkout", {
        p_session_id: draft.sessionId,
        p_product_id: draft.productId,
        p_product_name: draft.productName,
        p_size: draft.size,
        p_color: draft.color,
        p_quantity: draft.quantity,
        p_value: draft.value,
        p_contact_consent: draft.contactConsent,
        p_customer_name: draft.customerName ?? null,
        p_phone: draft.phone ?? null,
        p_wilaya: draft.wilaya ?? null,
        p_commune: draft.commune ?? null
    });
    if (error) throw error;
}
async function completeAbandonedCheckout(sb, sessionId, orderReference) {
    const { error } = await sb.rpc("complete_abandoned_checkout", {
        p_session_id: sessionId,
        p_order_reference: orderReference
    });
    if (error) throw error;
}
async function fetchAbandonedCheckouts(sb) {
    const { data, error } = await sb.from("abandoned_checkouts").select("session_id, product_id, product_name, size, color, quantity, value, contact_consent, customer_name, phone, wilaya, commune, created_at, expires_at").eq("status", "open").gt("expires_at", new Date().toISOString()).order("updated_at", {
        ascending: false
    });
    if (error) throw error;
    return (data ?? []).map((row)=>({
            sessionId: row.session_id,
            productId: row.product_id,
            productName: row.product_name,
            size: row.size,
            color: row.color,
            quantity: row.quantity,
            value: row.value,
            contactConsent: row.contact_consent,
            customerName: row.customer_name ?? undefined,
            phone: row.phone ?? undefined,
            wilaya: row.wilaya ?? undefined,
            commune: row.commune ?? undefined,
            createdAt: row.created_at,
            expiresAt: row.expires_at
        }));
}
async function seedCatalog(sb, categories, products) {
    const idBySlug = new Map();
    for (const c of categories){
        const row = {
            slug: c.slug,
            name_fr: c.name.fr,
            name_ar: c.name.ar,
            description_fr: c.description.fr,
            description_ar: c.description.ar,
            image: c.image
        };
        if (UUID_RE.test(c.id)) row.id = c.id;
        const { data, error } = await sb.from("categories").upsert(row, {
            onConflict: "slug"
        }).select("id").single();
        if (error) throw error;
        idBySlug.set(c.slug, data.id);
    }
    for (const p of products){
        const cat = categories.find((c)=>c.id === p.categoryId);
        await upsertProduct(sb, p, cat ? idBySlug.get(cat.slug) : undefined);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "averageRating",
    ()=>averageRating,
    "cn",
    ()=>cn,
    "formatPrice",
    ()=>formatPrice,
    "isAlgerianPhone",
    ()=>isAlgerianPhone,
    "isEmail",
    ()=>isEmail,
    "orderReference",
    ()=>orderReference,
    "slugify",
    ()=>slugify,
    "timeAgo",
    ()=>timeAgo,
    "uid",
    ()=>uid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
;
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
function formatPrice(amount, locale) {
    const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
        maximumFractionDigits: 0
    }).format(amount);
    return locale === "ar" ? `${formatted} د.ج` : `${formatted} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCY_CODE"]}`;
}
function slugify(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function orderReference() {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `VL-${n}`;
}
function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function averageRating(ratings) {
    if (!ratings.length) return 0;
    return Math.round(ratings.reduce((a, b)=>a + b, 0) / ratings.length * 10) / 10;
}
function isAlgerianPhone(phone) {
    const cleaned = phone.replace(/[\s\-_().]/g, "");
    return /^(0|\+213|00213)?[5-7]\d{8}$/.test(cleaned) || /^\d{9,10}$/.test(cleaned);
}
function isEmail(value) {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function timeAgo(dateString, locale = "ar") {
    try {
        const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
        if (diff < 60) {
            return locale === "ar" ? "الآن" : "À l'instant";
        }
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) {
            return locale === "ar" ? `منذ ${minutes} دقيقة` : `Il y a ${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return locale === "ar" ? `منذ ${hours} ساعة` : `Il y a ${hours} h`;
        }
        const days = Math.floor(hours / 24);
        if (days < 30) {
            return locale === "ar" ? `منذ ${days} يوم` : `Il y a ${days} j`;
        }
        return new Date(dateString).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ");
    } catch  {
        return dateString;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/providers/locale-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocaleProvider",
    ()=>LocaleProvider,
    "useLocale",
    ()=>useLocale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const LocaleContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function LocaleProvider({ locale, dict, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocaleContext.Provider, {
        value: {
            locale,
            dict
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/locale-provider.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c = LocaleProvider;
function useLocale() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
    return ctx;
}
_s(useLocale, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "LocaleProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/providers/session-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionProvider",
    ()=>SessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/catalog-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SessionProvider({ children }) {
    _s();
    const init = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "SessionProvider.useAuthStore[init]": (s)=>s.init
    }["SessionProvider.useAuthStore[init]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SessionProvider.useEffect": ()=>{
            void init();
            void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$catalog$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogStore"].getState().refresh().catch({
                "SessionProvider.useEffect": (error)=>{
                    console.error("Failed to load the product catalog", error);
                }
            }["SessionProvider.useEffect"]);
        }
    }["SessionProvider.useEffect"], [
        init
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/session-provider.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_s(SessionProvider, "xBFm28midGKl9EWRu31HMxk3CEE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = SessionProvider;
var _c;
__turbopack_context__.k.register(_c, "SessionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/auth-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/configured.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/data.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
let started = false;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        user: null,
        ready: false,
        init: async ()=>{
            if (started) return;
            started = true;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
                if ("TURBOPACK compile-time truthy", 1) {
                    try {
                        const saved = localStorage.getItem("velora-demo-user");
                        if (saved) set({
                            user: JSON.parse(saved)
                        });
                    } catch  {
                    // ignore
                    }
                }
                set({
                    ready: true
                });
                return;
            }
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (!sb) {
                set({
                    ready: true
                });
                return;
            }
            const load = async ()=>{
                const { data: { user } } = await sb.auth.getUser();
                if (!user) {
                    set({
                        user: null
                    });
                    return;
                }
                const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProfile"])(sb, user.id);
                set({
                    user: profile ?? {
                        id: user.id,
                        email: user.email ?? "",
                        fullName: user.user_metadata?.full_name ?? "",
                        role: "customer",
                        createdAt: user.created_at
                    }
                });
            };
            await load();
            sb.auth.onAuthStateChange(()=>{
                void load();
            });
            set({
                ready: true
            });
        },
        login: async (email, password)=>{
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (!sb) {
                // الوضع التجريبي (بدون Supabase): تسجيل دخول مباشر كمدير
                const demoUser = {
                    id: "demo-admin",
                    email,
                    fullName: email.split("@")[0] || "Administrateur",
                    role: "admin",
                    createdAt: new Date().toISOString()
                };
                if ("TURBOPACK compile-time truthy", 1) {
                    try {
                        localStorage.setItem("velora-demo-user", JSON.stringify(demoUser));
                    } catch  {
                    // ignore
                    }
                }
                set({
                    user: demoUser
                });
                return null;
            }
            const { data, error } = await sb.auth.signInWithPassword({
                email,
                password
            });
            if (error) return error.message;
            if (data.user) {
                const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProfile"])(sb, data.user.id);
                set({
                    user: profile ?? {
                        id: data.user.id,
                        email: data.user.email ?? "",
                        fullName: data.user.user_metadata?.full_name ?? "",
                        role: "customer",
                        createdAt: data.user.created_at
                    }
                });
            }
            return null;
        },
        register: async ({ email, password, fullName, phone })=>{
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (!sb) {
                // الوضع التجريبي (بدون Supabase): تسجيل حساب فوري كمدير
                const demoUser = {
                    id: "demo-admin",
                    email,
                    fullName: fullName || email.split("@")[0] || "Administrateur",
                    phone,
                    role: "admin",
                    createdAt: new Date().toISOString()
                };
                if ("TURBOPACK compile-time truthy", 1) {
                    try {
                        localStorage.setItem("velora-demo-user", JSON.stringify(demoUser));
                    } catch  {
                    // ignore
                    }
                }
                set({
                    user: demoUser
                });
                return null;
            }
            const { error } = await sb.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone
                    }
                }
            });
            if (error) {
                return error.message.toLowerCase().includes("already") ? "exists" : "error";
            }
            const { data: { user } } = await sb.auth.getUser();
            if (user) {
                const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProfile"])(sb, user.id);
                if (profile) set({
                    user: profile
                });
            }
            return null;
        },
        logout: async ()=>{
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (sb) {
                await sb.auth.signOut();
            }
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    localStorage.removeItem("velora-demo-user");
                } catch  {
                // ignore
                }
            }
            set({
                user: null
            });
        },
        updateProfile: async (patch)=>{
            const user = get().user;
            if (!user) return;
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (sb) {
                const { error } = await sb.from("profiles").update({
                    full_name: patch.fullName ?? user.fullName,
                    phone: patch.phone ?? null,
                    address: patch.address ?? null,
                    wilaya: patch.wilaya ?? null
                }).eq("id", user.id);
                if (!error) set({
                    user: {
                        ...user,
                        ...patch
                    }
                });
                return;
            }
            const updated = {
                ...user,
                ...patch
            };
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    localStorage.setItem("velora-demo-user", JSON.stringify(updated));
                } catch  {
                // ignore
                }
            }
            set({
                user: updated
            });
        },
        updateEmail: async (newEmail)=>{
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (!sb) return "no-supabase";
            const { error } = await sb.auth.updateUser({
                email: newEmail
            });
            if (error) return error.message;
            return null;
        },
        updatePassword: async (currentPassword, newPassword)=>{
            const user = get().user;
            if (!user) return "not-logged-in";
            const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (!sb) return "no-supabase";
            // تحقق من كلمة المرور الحالية أولاً
            const { error: signInError } = await sb.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            });
            if (signInError) return "wrong-password";
            const { error } = await sb.auth.updateUser({
                password: newPassword
            });
            if (error) return error.message;
            return null;
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/cart-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
"use client";
;
;
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        items: [],
        addItem: (item)=>{
            const existing = get().items.find((i)=>i.variantId === item.variantId);
            if (existing) {
                set({
                    items: get().items.map((i)=>i.variantId === item.variantId ? {
                            ...i,
                            quantity: i.quantity + item.quantity
                        } : i)
                });
            } else {
                set({
                    items: [
                        ...get().items,
                        item
                    ]
                });
            }
        },
        removeItem: (variantId)=>set({
                items: get().items.filter((i)=>i.variantId !== variantId)
            }),
        setQty: (variantId, quantity)=>{
            if (quantity < 1) {
                get().removeItem(variantId);
                return;
            }
            set({
                items: get().items.map((i)=>i.variantId === variantId ? {
                        ...i,
                        quantity
                    } : i)
            });
        },
        clear: ()=>set({
                items: []
            })
    }), {
    name: "velora-cart"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/catalog-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "newProductDraft",
    ()=>newProductDraft,
    "useCatalogStore",
    ()=>useCatalogStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog/seed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog/queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog/catalog-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/configured.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const initialOrders = [
    {
        id: "ord_01",
        reference: "VL-849201",
        customerName: "Benrmas samah",
        phone: "0798355584",
        wilaya: "31 - وهران",
        commune: "وهران",
        address: "وسط المدينة",
        status: "confirmed",
        paymentMethod: "cod",
        subtotal: 3800,
        shipping: 600,
        total: 4400,
        offerTitle: "فستان + توصيل",
        createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_1",
                productId: "p_robe_rope",
                variantId: "p_robe_rope_Standard_FFB6C1",
                name: {
                    fr: "Rope",
                    ar: "فستان روب عصري"
                },
                size: "Standard",
                color: {
                    fr: "Rose",
                    ar: "وردي"
                },
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3800,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_02",
        reference: "VL-739102",
        customerName: "محاني",
        phone: "0775396053",
        wilaya: "23 - عنابة",
        commune: "عنابة",
        address: "سيدي إبراهيم",
        status: "processing",
        paymentMethod: "cod",
        subtotal: 3800,
        shipping: 650,
        total: 4450,
        offerTitle: "فستان صيفي",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_2",
                productId: "p_robe_rope",
                variantId: "p_robe_rope_XL_FFB6C1",
                name: {
                    fr: "Rope",
                    ar: "فستان روب عصري"
                },
                size: "XL",
                color: {
                    fr: "Rose",
                    ar: "وردي"
                },
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3800,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_03",
        reference: "VL-619283",
        customerName: "تواتي",
        phone: "0554951345",
        wilaya: "09 - البليدة",
        commune: "البليدة",
        address: "باب الخويخة",
        status: "processing",
        paymentMethod: "cod",
        subtotal: 3800,
        shipping: 500,
        total: 4300,
        offerTitle: "فستان روب",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_3",
                productId: "p_robe_rope",
                variantId: "p_robe_rope_Standard_FFB6C1",
                name: {
                    fr: "Rope",
                    ar: "فستان روب عصري"
                },
                size: "Standard",
                color: {
                    fr: "Rose",
                    ar: "وردي"
                },
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3800,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_04",
        reference: "VL-502847",
        customerName: "بشوشي إلياس",
        phone: "0542372877",
        wilaya: "16 - الجزائر",
        commune: "الجزائر الوسطى",
        address: "حيدرة شارع ديدوش",
        status: "pending",
        paymentMethod: "cod",
        subtotal: 1750,
        shipping: 500,
        total: 2250,
        offerTitle: "تيشرت 1750 دج",
        createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_4",
                productId: "p_old_money",
                variantId: "p_old_money_L_111111",
                name: {
                    fr: "Old money",
                    ar: "Old money"
                },
                size: "L",
                color: {
                    fr: "Noir",
                    ar: "أسود"
                },
                image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 1750,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_05",
        reference: "VL-491028",
        customerName: "طاهر براهيمي",
        phone: "0667454335",
        wilaya: "03 - الأغواط",
        commune: "الأغواط",
        address: "حي المحطة",
        status: "cancelled",
        paymentMethod: "cod",
        subtotal: 1750,
        shipping: 500,
        total: 2250,
        offerTitle: "Old money تيشرت",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_5",
                productId: "p_old_money",
                variantId: "p_old_money_XL_FFFFFF",
                name: {
                    fr: "Old money",
                    ar: "Old money"
                },
                size: "XL",
                color: {
                    fr: "Blanc",
                    ar: "أبيض"
                },
                image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 1750,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_06",
        reference: "VL-381920",
        customerName: "بن منصور أمير",
        phone: "0792627815",
        wilaya: "05 - باتنة",
        commune: "باتنة",
        address: "حي كشيدة",
        status: "delivered",
        paymentMethod: "cod",
        subtotal: 3700,
        shipping: 500,
        total: 4200,
        offerTitle: "بنطلون 2 قطع",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_6",
                productId: "p_pantalon_lin",
                variantId: "p_pantalon_lin_M_E8DCB8",
                name: {
                    fr: "Pontalon lin",
                    ar: "بنطلون كتان صيفي"
                },
                size: "M",
                color: {
                    fr: "Beige",
                    ar: "بيج"
                },
                image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3700,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_07",
        reference: "VL-274819",
        customerName: "بشرى",
        phone: "0781337683",
        wilaya: "38 - تسمسيلت",
        commune: "تسمسيلت",
        address: "حي النور",
        status: "delivered",
        paymentMethod: "cod",
        subtotal: 3700,
        shipping: 500,
        total: 4200,
        offerTitle: "عقد صيفي",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_7",
                productId: "p_robe_rope",
                variantId: "p_robe_rope_Standard_FFB6C1",
                name: {
                    fr: "Rope",
                    ar: "فستان روب عصري"
                },
                size: "Standard",
                color: {
                    fr: "Rose",
                    ar: "وردي"
                },
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3700,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_08",
        reference: "VL-164728",
        customerName: "abir",
        phone: "0673276509",
        wilaya: "30 - ورقلة",
        commune: "ورقلة",
        address: "حي سيدي عابد",
        status: "delivered",
        paymentMethod: "cod",
        subtotal: 3600,
        shipping: 600,
        total: 4200,
        offerTitle: "عرض خاص",
        createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_8",
                productId: "p_robe_rope",
                variantId: "p_robe_rope_Standard_FFB6C1",
                name: {
                    fr: "Rope",
                    ar: "فستان روب عصري"
                },
                size: "Standard",
                color: {
                    fr: "Rose",
                    ar: "وردي"
                },
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3600,
                quantity: 1
            }
        ]
    },
    {
        id: "ord_09",
        reference: "VL-053629",
        customerName: "ميمي",
        phone: "0564877791",
        wilaya: "16 - الجزائر",
        commune: "باب الزوار",
        address: "حي 5 جويلية",
        status: "delivered",
        paymentMethod: "cod",
        subtotal: 3800,
        shipping: 500,
        total: 4300,
        offerTitle: "روب صيفي",
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        items: [
            {
                id: "oi_9",
                productId: "p_robe_rope",
                variantId: "p_robe_rope_Standard_FFB6C1",
                name: {
                    fr: "Rope",
                    ar: "فستان روب عصري"
                },
                size: "Standard",
                color: {
                    fr: "Rose",
                    ar: "وردي"
                },
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
                unitPrice: 3800,
                quantity: 1
            }
        ]
    }
];
function getStoredProducts() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const saved = localStorage.getItem("velora_products");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeSeedProducts"])(parsed, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"]);
            }
        }
    } catch  {
    // ignore
    }
    return [];
}
function getStoredOrders() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const saved = localStorage.getItem("velora_orders");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch  {
    // ignore
    }
    return initialOrders;
}
function saveProducts(products) {
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            localStorage.setItem("velora_products", JSON.stringify(products));
        } catch  {
        // ignore
        }
    }
}
function saveOrders(orders) {
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            localStorage.setItem("velora_orders", JSON.stringify(orders));
        } catch  {
        // ignore
        }
    }
}
function getStoredAbandonedCheckouts() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const saved = localStorage.getItem("velora_abandoned_checkouts");
        if (!saved) return [];
        const drafts = JSON.parse(saved);
        if (!Array.isArray(drafts)) return [];
        return drafts.filter((draft)=>Date.parse(draft.expiresAt) > Date.now());
    } catch  {
        return [];
    }
}
function saveAbandonedCheckouts(drafts) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem("velora_abandoned_checkouts", JSON.stringify(drafts));
}
const sb = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])() : null;
const useCatalogStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        products: getStoredProducts(),
        categories: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"],
        catalogLoadState: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])() ? "loading" : "ready",
        orders: getStoredOrders(),
        abandonedCheckouts: getStoredAbandonedCheckouts(),
        reviews: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reviews"],
        refresh: async ()=>{
            const client = sb();
            if (!client) {
                set({
                    catalogLoadState: "ready"
                });
                return;
            }
            set({
                catalogLoadState: "loading"
            });
            try {
                const { categories, products, reviews } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCatalog"](client);
                const finalProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeCatalogProducts"])(products, get().products);
                set((state)=>({
                        categories: categories.length ? categories : state.categories,
                        products: finalProducts,
                        reviews: reviews.length ? reviews : state.reviews,
                        catalogLoadState: "ready"
                    }));
                saveProducts(finalProducts);
            } catch (error) {
                set({
                    catalogLoadState: "error"
                });
                throw error;
            }
        },
        refreshOrders: async (all = false)=>{
            const client = sb();
            if (!client) return;
            const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchOrders"](client, {
                all
            });
            set({
                orders
            });
            saveOrders(orders);
        },
        refreshAbandonedCheckouts: async ()=>{
            const client = sb();
            const drafts = client ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAbandonedCheckouts"](client) : getStoredAbandonedCheckouts();
            set({
                abandonedCheckouts: drafts
            });
        },
        saveAbandonedCheckout: async (draft)=>{
            const client = sb();
            if (client) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAbandonedCheckout"](client, draft);
                set((state)=>({
                        abandonedCheckouts: [
                            draft,
                            ...state.abandonedCheckouts.filter((item)=>item.sessionId !== draft.sessionId)
                        ]
                    }));
                return;
            }
            const updated = [
                draft,
                ...get().abandonedCheckouts.filter((item)=>item.sessionId !== draft.sessionId)
            ];
            set({
                abandonedCheckouts: updated
            });
            saveAbandonedCheckouts(updated);
        },
        completeAbandonedCheckout: async (sessionId, orderReference)=>{
            const client = sb();
            const updated = get().abandonedCheckouts.filter((item)=>item.sessionId !== sessionId);
            set({
                abandonedCheckouts: updated
            });
            if (!client) saveAbandonedCheckouts(updated);
        },
        upsertProduct: async (product)=>{
            const client = sb();
            if (client) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPersistedProductId"])(product.id)) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertProduct"](client, product);
                } else {
                    const inserted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertProductIfMissing"](client, product);
                    if (!inserted) {
                        throw new Error("A product with this URL already exists. Reload the catalog and edit the saved product instead of replacing it with a local copy.");
                    }
                }
                await get().refresh();
                return;
            }
            const current = get().products;
            const exists = current.some((p)=>p.id === product.id);
            const updated = exists ? current.map((p)=>p.id === product.id ? product : p) : [
                product,
                ...current
            ];
            set({
                products: updated
            });
            saveProducts(updated);
        },
        importLocalProducts: async ()=>{
            const client = sb();
            if (!client) {
                throw new Error("Supabase is not configured; local products cannot be shared with customers.");
            }
            const candidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocalProductsToImport"])(get().products, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"]);
            let imported = 0;
            let skipped = 0;
            const failed = [];
            for (const product of candidates){
                try {
                    const inserted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertProductIfMissing"](client, product);
                    if (inserted) imported += 1;
                    else skipped += 1;
                } catch (error) {
                    failed.push({
                        slug: product.slug,
                        message: error instanceof Error ? error.message : "Unknown error"
                    });
                }
            }
            if (imported > 0) {
                try {
                    await get().refresh();
                } catch (error) {
                    failed.push({
                        slug: "catalog-refresh",
                        message: error instanceof Error ? error.message : "Unknown error"
                    });
                }
            }
            return {
                imported,
                skipped,
                failed
            };
        },
        deleteProduct: async (id)=>{
            const client = sb();
            if (client && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPersistedProductId"])(id)) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteProduct"](client, id);
                await get().refresh();
                return "deleted";
            }
            const updated = get().products.filter((p)=>p.id !== id);
            set({
                products: updated
            });
            saveProducts(updated);
            return "removed-local";
        },
        deleteAllProducts: async ()=>{
            const products = get().products;
            const client = sb();
            if (client && get().catalogLoadState !== "ready") {
                throw new Error("The database catalog must finish loading successfully before deleting all products.");
            }
            const persistedIds = [
                ...new Set(products.filter((product)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPersistedProductId"])(product.id)).map((product)=>product.id))
            ];
            const removedLocally = products.length - persistedIds.length;
            let deletedFromDatabase = 0;
            if (client && persistedIds.length > 0) {
                deletedFromDatabase = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteProducts"](client, persistedIds);
            }
            set({
                products: []
            });
            saveProducts([]);
            if (client) {
                await get().refresh();
                if (get().products.length > 0) {
                    throw new Error("Some products remain in the database catalog. Verify admin permissions and reload before retrying.");
                }
            }
            return {
                deletedFromDatabase,
                removedLocally
            };
        },
        toggleProductActive: async (id)=>{
            const product = get().products.find((item)=>item.id === id);
            if (!product) return;
            const active = product.active === false;
            const client = sb();
            if (client && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$catalog$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPersistedProductId"])(id)) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProductActive"](client, id, active);
                await get().refresh();
                return;
            }
            const updated = get().products.map((p)=>p.id === id ? {
                    ...p,
                    active
                } : p);
            set({
                products: updated
            });
            saveProducts(updated);
        },
        updateProductOffers: (productId, offers)=>{
            const updated = get().products.map((p)=>p.id === productId ? {
                    ...p,
                    offers
                } : p);
            set({
                products: updated
            });
            saveProducts(updated);
        },
        addOrder: (order)=>{
            const updated = [
                order,
                ...get().orders
            ];
            set({
                orders: updated
            });
            saveOrders(updated);
        },
        updateOrder: (order)=>{
            const updated = get().orders.map((o)=>o.id === order.id ? order : o);
            set({
                orders: updated
            });
            saveOrders(updated);
        },
        deleteOrder: (id)=>{
            const updated = get().orders.filter((o)=>o.id !== id);
            set({
                orders: updated
            });
            saveOrders(updated);
        },
        setOrderStatus: async (id, status)=>{
            const client = sb();
            if (client) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateOrderStatus"](client, id, status);
            }
            const updated = get().orders.map((o)=>o.id === id ? {
                    ...o,
                    status
                } : o);
            set({
                orders: updated
            });
            saveOrders(updated);
        },
        bulkSetOrderStatus: (ids, status)=>{
            const updated = get().orders.map((o)=>ids.includes(o.id) ? {
                    ...o,
                    status
                } : o);
            set({
                orders: updated
            });
            saveOrders(updated);
        },
        updateOrderDelivery: async (id, deliveryData)=>{
            const dispatchedAt = new Date().toISOString();
            const status = deliveryData.status || "shipped";
            const updated = get().orders.map((o)=>o.id === id ? {
                    ...o,
                    deliveryCompany: deliveryData.deliveryCompany,
                    trackingCode: deliveryData.trackingCode,
                    status,
                    deliveryDispatchedAt: dispatchedAt,
                    labelUrl: deliveryData.labelUrl || o.labelUrl
                } : o);
            set({
                orders: updated
            });
            saveOrders(updated);
            const client = sb();
            if (client && UUID_RE.test(id)) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateOrderDelivery"](client, id, {
                    deliveryCompany: deliveryData.deliveryCompany,
                    trackingCode: deliveryData.trackingCode,
                    status,
                    dispatchedAt,
                    labelUrl: deliveryData.labelUrl
                });
            }
        },
        setVariantStock: async (productId, variantId, stock)=>{
            const client = sb();
            if (client) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setVariantStock"](client, variantId, stock);
                await get().refresh();
                return;
            }
            const updated = get().products.map((p)=>p.id !== productId ? p : {
                    ...p,
                    variants: p.variants.map((v)=>v.id === variantId ? {
                            ...v,
                            stock: Math.max(0, stock)
                        } : v)
                });
            set({
                products: updated
            });
            saveProducts(updated);
        },
        listProducts: (filters)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyFilters"])(get().products, filters),
        getProduct: (slug)=>get().products.find((p)=>p.slug === slug || p.id === slug)
    }));
function newProductDraft() {
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])("p"),
        slug: `piece-${Date.now().toString(36)}`,
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        name: {
            fr: "",
            ar: ""
        },
        description: {
            fr: "",
            ar: ""
        },
        categoryId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"][0].id,
        price: 1500,
        compareAtPrice: 2200,
        images: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])("img"),
                url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
                alt: {
                    fr: "",
                    ar: ""
                }
            }
        ],
        variants: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])("var"),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])("SKU").toUpperCase(),
                size: "M",
                color: {
                    fr: "Noir",
                    ar: "أسود"
                },
                colorHex: "#1A1A1A",
                stock: 25
            }
        ],
        sizes: [
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: {
                    fr: "Noir",
                    ar: "أسود"
                },
                hex: "#1A1A1A"
            }
        ],
        offers: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])("off"),
                quantity: 1,
                title: {
                    ar: "قطعة واحدة",
                    fr: "1 Pièce"
                },
                price: 1500,
                originalPrice: 2200
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])("off"),
                quantity: 2,
                title: {
                    ar: "2 قطع",
                    fr: "2 Pièces"
                },
                price: 2800,
                originalPrice: 4400,
                badge: {
                    ar: "الأكثر طلباً",
                    fr: "Populaire"
                }
            }
        ],
        active: true,
        views: 0,
        featured: false,
        isNew: true,
        rating: 5,
        reviewCount: 1,
        createdAt: new Date().toISOString()
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/settings-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsStore",
    ()=>useSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/default-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/configured.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$pixels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics/pixels.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const useSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        settings: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_STORE_SETTINGS"],
        updateSettings: (partial)=>{
            set((state)=>({
                    settings: {
                        ...state.settings,
                        ...partial
                    }
                }));
        },
        updateWilayaPrice: (code, updates)=>{
            set((state)=>{
                const current = state.settings.wilayaPrices[code];
                if (!current) return state;
                return {
                    settings: {
                        ...state.settings,
                        wilayaPrices: {
                            ...state.settings.wilayaPrices,
                            [code]: {
                                ...current,
                                ...updates
                            }
                        }
                    }
                };
            });
        },
        bulkUpdateWilayas: (updates)=>{
            set((state)=>{
                const newMap = {
                    ...state.settings.wilayaPrices
                };
                Object.keys(newMap).forEach((code)=>{
                    newMap[code] = {
                        ...newMap[code],
                        ...updates.homePrice !== undefined && {
                            homePrice: updates.homePrice
                        },
                        ...updates.deskPrice !== undefined && {
                            deskPrice: updates.deskPrice
                        },
                        ...updates.enabled !== undefined && {
                            enabled: updates.enabled
                        }
                    };
                });
                return {
                    settings: {
                        ...state.settings,
                        wilayaPrices: newMap
                    }
                };
            });
        },
        updateEcoTrack: (ecotrackUpdates)=>{
            set((state)=>({
                    settings: {
                        ...state.settings,
                        ecotrack: {
                            ...state.settings.ecotrack,
                            ...ecotrackUpdates
                        }
                    }
                }));
        },
        updateNordEtOuest: (nordUpdates)=>{
            set((state)=>({
                    settings: {
                        ...state.settings,
                        nordEtOuest: {
                            ...state.settings.nordEtOuest || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_STORE_SETTINGS"].nordEtOuest,
                            ...nordUpdates
                        }
                    }
                }));
        },
        updatePixels: async (pixelSettings)=>{
            const pixels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$pixels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizePixelSettings"])(pixelSettings);
            const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])() : null;
            if (client) await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savePixelSettings"](client, pixels);
            set((state)=>({
                    settings: {
                        ...state.settings,
                        pixels
                    }
                }));
        },
        refreshPixels: async ()=>{
            const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$configured$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])() : null;
            if (!client) return;
            const pixels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2f$pixels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizePixelSettings"])(await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPixelSettings"](client));
            set((state)=>({
                    settings: {
                        ...state.settings,
                        pixels
                    }
                }));
        },
        getShippingFee: (wilayaValue, deliveryType)=>{
            const { settings } = get();
            if (settings.shippingType === "free") return 0;
            if (settings.shippingType === "fixed") {
                return deliveryType === "home" ? settings.defaultHomePrice : settings.defaultDeskPrice;
            }
            // البحث عن الولاية بالكود أو الاسم
            const prices = settings.wilayaPrices;
            let matched = Object.values(prices).find((w)=>wilayaValue.includes(w.code) || wilayaValue.includes(w.nameAr) || wilayaValue.toLowerCase().includes(w.nameFr.toLowerCase()));
            if (!matched) {
                return deliveryType === "home" ? settings.defaultHomePrice : settings.defaultDeskPrice;
            }
            return deliveryType === "home" ? matched.homePrice : matched.deskPrice;
        }
    }), {
    name: "velora_store_settings_v1",
    version: 2,
    migrate: (persistedState)=>{
        const persisted = persistedState;
        return {
            ...persisted,
            settings: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_STORE_SETTINGS"],
                ...persisted?.settings,
                pixels: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_STORE_SETTINGS"].pixels
            }
        };
    }
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1lnhk06._.js.map