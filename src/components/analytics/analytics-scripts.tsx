"use client";

import Script from "next/script";
import { useSettingsStore } from "@/stores/settings-store";

export function AnalyticsScripts() {
  const pixels = useSettingsStore((s) => s.settings.pixels);

  return (
    <>
      {/* Meta (Facebook) Pixel 1 */}
      {pixels.facebookPixel1Enabled && pixels.facebookPixel1 && (
        <Script id="meta-pixel-1" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixels.facebookPixel1.trim()}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Meta (Facebook) Pixel 2 */}
      {pixels.facebookPixel2Enabled && pixels.facebookPixel2 && (
        <Script id="meta-pixel-2" strategy="afterInteractive">
          {`
            if (window.fbq) {
              fbq('init', '${pixels.facebookPixel2.trim()}');
            }
          `}
        </Script>
      )}

      {/* TikTok Pixel */}
      {pixels.tiktokPixelEnabled && pixels.tiktokPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('${pixels.tiktokPixel.trim()}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}

// دالة مساعدة لإرسال حدث الشراء لـ Facebook و TikTok
export function trackPurchaseEvent(orderData: {
  orderId: string;
  total: number;
  currency?: string;
  items?: Array<{ name: string; price: number; quantity: number }>;
}) {
  if (typeof window === "undefined") return;

  // 1. Meta / Facebook
  if ((window as any).fbq) {
    (window as any).fbq("track", "Purchase", {
      value: orderData.total,
      currency: orderData.currency || "DZD",
      content_type: "product",
      order_id: orderData.orderId,
    });
  }

  // 2. TikTok
  if ((window as any).ttq) {
    (window as any).ttq.track("CompletePayment", {
      content_type: "product",
      value: orderData.total,
      currency: orderData.currency || "DZD",
    });
  }
}
