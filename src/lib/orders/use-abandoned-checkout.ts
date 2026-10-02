"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackInitiateCheckoutEvent } from "@/components/analytics/analytics-scripts";
import { useCatalogStore } from "@/stores/catalog-store";
import type { AbandonedCheckout } from "@/types";

interface DraftInput {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  value: number;
  contactConsent: boolean;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
}

export function useAbandonedCheckout(input: DraftInput) {
  const saveDraft = useCatalogStore((state) => state.saveAbandonedCheckout);
  const completeDraft = useCatalogStore((state) => state.completeAbandonedCheckout);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const sessionId = useRef<string | null>(null);
  const createdAt = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveNow = useCallback(async () => {
    if (!startedRef.current) return null;

    sessionId.current ??= crypto.randomUUID();
    createdAt.current ??= new Date().toISOString();
    const draft: AbandonedCheckout = {
      sessionId: sessionId.current,
      productId: input.productId,
      productName: input.productName.slice(0, 200),
      size: input.size.slice(0, 40),
      color: input.color.slice(0, 80),
      quantity: Math.max(1, Math.min(1000, Math.trunc(input.quantity) || 1)),
      value: Math.max(0, Math.trunc(input.value) || 0),
      contactConsent: input.contactConsent,
      ...(input.contactConsent
        ? {
            customerName: input.customerName,
            phone: input.phone,
            wilaya: input.wilaya,
            commune: input.commune,
          }
        : {}),
      createdAt: createdAt.current,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    await saveDraft(draft);
    return sessionId.current;
  }, [input, saveDraft]);

  useEffect(() => {
    if (!started) return;
    timer.current = setTimeout(() => {
      void saveNow().catch((error) => {
        console.error("Failed to save abandoned checkout draft", error);
      });
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [started, saveNow]);

  const startTracking = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    trackInitiateCheckoutEvent({
      productId: input.productId,
      productName: input.productName,
      value: input.value,
      quantity: input.quantity,
    });
  }, [input.productId, input.productName, input.quantity, input.value]);

  const saveBeforeSubmit = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    return saveNow();
  }, [saveNow]);

  const markCompleted = useCallback(async (orderReference: string) => {
    if (!sessionId.current) return;
    if (timer.current) clearTimeout(timer.current);
    await completeDraft(sessionId.current, orderReference);
  }, [completeDraft]);

  return { startTracking, saveBeforeSubmit, markCompleted };
}
