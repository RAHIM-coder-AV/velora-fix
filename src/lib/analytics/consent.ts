"use client";

const CONSENT_KEY = "velora_marketing_consent";
const CHANGE_EVENT = "velora:marketing-consent";
let memoryConsent: MarketingConsent = null;

export type MarketingConsent = "accepted" | "rejected" | null;

export function getMarketingConsent(): MarketingConsent {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "rejected") memoryConsent = value;
    return value === "accepted" || value === "rejected" ? value : memoryConsent;
  } catch {
    return memoryConsent;
  }
}

export function setMarketingConsent(consent: Exclude<MarketingConsent, null>) {
  memoryConsent = consent;
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch (error) {
    console.error("Could not persist marketing consent", error);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function resetMarketingConsent() {
  memoryConsent = null;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch (error) {
    console.error("Could not reset marketing consent", error);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToMarketingConsent(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function marketingConsentSnapshot(): MarketingConsent {
  return getMarketingConsent();
}

export function serverMarketingConsentSnapshot(): MarketingConsent {
  return null;
}
