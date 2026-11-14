"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/stores/settings-store";
import {
  marketingConsentSnapshot,
  serverMarketingConsentSnapshot,
  subscribeToMarketingConsent,
} from "@/lib/analytics/consent";
import { enabledMetaPixelIds, enabledTikTokPixelIds } from "@/lib/analytics/pixels";

export type EventData = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number; item_price: number }>;
  content_name?: string;
  content_type?: string;
  order_id?: string;
  num_items?: number;
};

export function track(eventName: string, data: EventData = {}, eventId?: string) {
  if (typeof window === "undefined" || marketingConsentSnapshot() === "rejected") return;

  // Track Meta Pixel
  if (typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", eventName, data, { eventID: eventId });
    } else {
      window.fbq("track", eventName, data);
    }
  } else if (eventName !== "PageView") {
    window.__veloraPendingMetaEvents ??= [];
    window.__veloraPendingMetaEvents.push({ event: eventName, data, eventId });
  }

  // Track TikTok Pixel
  if (eventName === "PageView") {
    window.ttq?.page?.();
  } else if (typeof window.ttq?.track === "function") {
    window.ttq.track(eventName, data);
  } else if (eventName !== "PageView") {
    window.__veloraPendingTikTokEvents ??= [];
    window.__veloraPendingTikTokEvents.push({ event: eventName, data });
  }
}

export function trackViewContentEvent(product: {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
}) {
  track("ViewContent", {
    content_ids: [product.productId],
    content_name: product.productName,
    content_type: "product",
    value: product.price,
    currency: product.currency || "DZD",
  });
}

export function trackAddToCartEvent(product: {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  currency?: string;
}) {
  const qty = product.quantity || 1;
  track("AddToCart", {
    content_ids: [product.productId],
    content_name: product.productName,
    content_type: "product",
    value: product.price * qty,
    currency: product.currency || "DZD",
    num_items: qty,
  });
}

export function trackInitiateCheckoutEvent(data: {
  productId: string;
  productName: string;
  value: number;
  quantity: number;
}) {
  track("InitiateCheckout", {
    content_ids: [data.productId],
    content_name: data.productName,
    content_type: "product",
    value: data.value,
    currency: "DZD",
    num_items: data.quantity,
  });
}

export function trackPurchaseEvent(orderData: {
  orderId: string;
  total: number;
  currency?: string;
  items?: Array<{ productId?: string; name: string; price: number; quantity: number }>;
}) {
  if (typeof window === "undefined" || marketingConsentSnapshot() === "rejected") return;

  const currency = orderData.currency || "DZD";
  const numItems = orderData.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;
  const contentIds = orderData.items?.map((item) => item.productId).filter((id): id is string => Boolean(id)) || [];
  const contents = orderData.items?.map((item) => ({
    id: item.productId || item.name,
    quantity: item.quantity || 1,
    item_price: item.price || 0,
  })) || [];

  const data: EventData = {
    value: Number(orderData.total) || 0,
    currency,
    content_type: "product",
    content_name: orderData.items?.[0]?.name || ("Order #" + orderData.orderId),
    content_ids: contentIds,
    contents,
    order_id: orderData.orderId,
    num_items: numItems,
  };

  // Safe tracking with queue support and eventID for deduplication
  track("Purchase", data, orderData.orderId);
  if (typeof window.ttq?.track === "function") {
    window.ttq.track("CompletePayment", data);
  } else {
    window.__veloraPendingTikTokEvents ??= [];
    window.__veloraPendingTikTokEvents.push({ event: "CompletePayment", data });
  }
}

export function AnalyticsScripts() {
  const pathname = usePathname();
  const pixels = useSettingsStore((state) => state.settings.pixels);
  const refreshPixels = useSettingsStore((state) => state.refreshPixels);
  const consent = useSyncExternalStore(
    subscribeToMarketingConsent,
    marketingConsentSnapshot,
    serverMarketingConsentSnapshot,
  );
  const metaIds = consent !== "rejected" ? enabledMetaPixelIds(pixels) : [];
  const tiktokIds = consent !== "rejected" ? enabledTikTokPixelIds(pixels) : [];
  const lastPathname = useRef(pathname);

  useEffect(() => {
    void refreshPixels().catch((error) => {
      console.error("Failed to load public pixel settings", error);
    });
  }, [refreshPixels]);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    if (consent === "rejected") return;
    track("PageView");
  }, [consent, pathname]);

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
    queued.forEach(function(item){
      if(item.eventId) {
        fbq('track',item.event,item.data,{eventID:item.eventId});
      } else {
        fbq('track',item.event,item.data);
      }
    });
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

  return (
    <>
      {metaIds.length > 0 && (
        <Script
          id={`velora-meta-pixels-${metaIds.join("-")}`}
          strategy="afterInteractive"
        >
          {metaBootstrap}
        </Script>
      )}
      {tiktokIds.length > 0 && (
        <Script
          id={`velora-tiktok-pixels-${tiktokIds.join("-")}`}
          strategy="afterInteractive"
        >
          {tiktokBootstrap}
        </Script>
      )}
    </>
  );
}
