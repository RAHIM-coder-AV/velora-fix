"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Truck,
  Search,
  CheckCircle2,
  Save,
  Radio,
  Share2,
  Store,
  Tags,
  ClipboardList,
  House,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { PixelSettingsEditor } from "@/components/admin/pixel-settings-editor";
import { AdminCategoriesSettings } from "@/components/admin/admin-categories-settings";
import type { Category } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";
import { isSupabaseConfigured } from "@/lib/supabase/configured";

type SettingsSection =
  | "overview"
  | "delivery"
  | "integrations"
  | "ecotrack"
  | "nord_ouest"
  | "pixels"
  | "form"
  | "categories"
  | "identity"
  | "thankyou";

interface AdminSettingsViewProps {
  categories: Category[];
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onOpenHomepage: () => void;
}

export function AdminSettingsView({
  categories,
  onSaveCategory,
  onDeleteCategory,
  onOpenHomepage,
}: AdminSettingsViewProps) {
  const { locale } = useLocale();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const updateWilayaPrice = useSettingsStore((s) => s.updateWilayaPrice);
  const bulkUpdateWilayas = useSettingsStore((s) => s.bulkUpdateWilayas);
  const updateEcoTrack = useSettingsStore((s) => s.updateEcoTrack);
  const updateNordEtOuest = useSettingsStore((s) => s.updateNordEtOuest);
  const refreshSharedSettings = useSettingsStore((s) => s.refreshSharedSettings);
  const saveSharedSettings = useSettingsStore((s) => s.saveSharedSettings);
  const [savingShared, setSavingShared] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<SettingsSection>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkHome, setBulkHome] = useState("");
  const [bulkDesk, setBulkDesk] = useState("");

  // EcoTrack Local State
  const [ecotrackToken, setEcotrackToken] = useState(settings.ecotrack?.token || "");
  const [ecotrackUrl, setEcotrackUrl] = useState(settings.ecotrack?.baseUrl || "");
  const [ecotrackEnabled, setEcotrackEnabled] = useState(settings.ecotrack?.enabled ?? true);
  const [ecotrackAutoSend, setEcotrackAutoSend] = useState(settings.ecotrack?.autoSendConfirmed ?? false);
  const [isTestingEcoTrack, setIsTestingEcoTrack] = useState(false);

  // Nord Et Ouest Local State
  const [nordToken, setNordToken] = useState(settings.nordEtOuest?.token || "");
  const [nordUrl, setNordUrl] = useState(settings.nordEtOuest?.baseUrl || "https://api.nordetouest.com/api/v1");
  const [nordEnabled, setNordEnabled] = useState(settings.nordEtOuest?.enabled ?? true);
  const [nordAutoSend, setNordAutoSend] = useState(settings.nordEtOuest?.autoSendConfirmed ?? false);
  const [isTestingNord, setIsTestingNord] = useState(false);

  const storefront = settings.storefront;

  useEffect(() => {
    void refreshSharedSettings().catch((error) => {
      console.error("Failed to load shared store settings", error);
      toast(locale === "ar" ? "تعذر تحميل إعدادات المتجر المشتركة." : "Impossible de charger les paramètres partagés.");
    });
  }, [locale, refreshSharedSettings]);

  function updateStorefront(
    patch: Partial<typeof storefront>,
  ) {
    updateSettings({ storefront: { ...useSettingsStore.getState().settings.storefront, ...patch } });
  }

  async function saveShared() {
    if (!isSupabaseConfigured()) {
      toast(locale === "ar" ? "حُفظت الإعدادات على هذا المتصفح فقط. اربط Supabase لمشاركتها مع الزوار." : "Paramètres enregistrés sur ce navigateur uniquement. Configurez Supabase pour les partager.");
      return;
    }
    setSavingShared(true);
    try {
      await saveSharedSettings();
      toast(locale === "ar" ? "تم حفظ إعدادات المتجر لجميع الزوار." : "Paramètres enregistrés pour la boutique.");
    } catch (error) {
      console.error("Failed to save shared store settings", error);
      toast(locale === "ar" ? "تعذر الحفظ المشترك. تحقق من تطبيق migration 0009 وصلاحيات المدير." : "Échec. Vérifiez la migration 0009 et les droits admin.");
    } finally {
      setSavingShared(false);
    }
  }

  // Filter Wilayas
  const filteredWilayas = useMemo(() => {
    const list = Object.values(settings.wilayaPrices);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (w) =>
        w.code.includes(q) ||
        w.nameAr.toLowerCase().includes(q) ||
        w.nameFr.toLowerCase().includes(q)
    );
  }, [settings.wilayaPrices, searchQuery]);

  function handleSaveEcoTrack() {
    updateEcoTrack({
      token: ecotrackToken.trim(),
      baseUrl: ecotrackUrl.trim(),
      enabled: ecotrackEnabled,
      autoSendConfirmed: ecotrackAutoSend,
    });
    toast(locale === "ar" ? "تم حفظ إعدادات EcoTrack بنجاح!" : "Paramètres EcoTrack enregistrés !");
  }

  function handleSaveNordEtOuest() {
    updateNordEtOuest({
      token: nordToken.trim(),
      baseUrl: nordUrl.trim(),
      enabled: nordEnabled,
      autoSendConfirmed: nordAutoSend,
    });
    toast(locale === "ar" ? "تم حفظ إعدادات Nord Et Ouest بنجاح!" : "Paramètres Nord Et Ouest enregistrés !");
  }

  async function handleTestEcoTrack() {
    setIsTestingEcoTrack(true);
    try {
      const token = ecotrackToken.trim();
      const url = new URL(ecotrackUrl.trim());
      if (
        !ecotrackEnabled ||
        token.length < 10 ||
        token.startsWith("demo_") ||
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.port ||
        url.search ||
        url.hash ||
        !url.hostname.endsWith(".ecotrack.dz") ||
        url.hostname === "api.ecotrack.dz"
      ) {
        toast(locale === "ar"
          ? "أدخل رمز API حقيقيًا ورابط شركة التوصيل التي تستخدم EcoTrack، مثل https://dhd.ecotrack.dz/api/v1."
          : "Saisissez un vrai jeton API et l'URL du transporteur EcoTrack, par ex. https://dhd.ecotrack.dz/api/v1.");
        return;
      }
      const response = await fetch("/api/delivery/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: "ecotrack",
          token,
          baseUrl: ecotrackUrl.trim(),
        }),
      });
      const result = await response.json();
      toast(
        response.ok && result.success
          ? locale === "ar"
            ? "✅ تم الاتصال بـ EcoTrack والتحقق من صلاحية الرمز."
            : "✅ Connexion EcoTrack et jeton vérifiés."
          : result.error ||
              (locale === "ar" ? "تعذر التحقق من اتصال EcoTrack." : "Impossible de vérifier EcoTrack."),
      );
    } catch {
      toast(locale === "ar" ? "تعذر الوصول إلى خادم فحص EcoTrack." : "Impossible de joindre le vérificateur EcoTrack.");
    } finally {
      setIsTestingEcoTrack(false);
    }
  }

  async function handleTestNord() {
    setIsTestingNord(true);
    try {
      const token = nordToken.trim();
      const url = new URL(nordUrl.trim());
      if (
        !nordEnabled ||
        token.length < 10 ||
        token.startsWith("demo_") ||
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.port ||
        url.search ||
        url.hash ||
        (url.hostname !== "nordetouest.com" &&
          !url.hostname.endsWith(".nordetouest.com"))
      ) {
        toast(locale === "ar"
          ? "تحقق من تفعيل الربط، والرمز الحقيقي، ورابط Nord Et Ouest الآمن."
          : "Vérifiez l'activation, le jeton réel et l'URL Nord Et Ouest sécurisée.");
        return;
      }
      toast(locale === "ar"
        ? "الإعدادات مكتملة. هذا الفحص لا يتصل بحسابك ولا ينشئ شحنة؛ تأكد من الربط برفع طلب حقيقي."
        : "Configuration complète. Aucun appel ni envoi n'est effectué par ce contrôle.");
    } catch {
      toast(locale === "ar" ? "رابط Nord Et Ouest غير صالح." : "URL Nord Et Ouest invalide.");
    } finally {
      setIsTestingNord(false);
    }
  }

  function handleApplyBulk() {
    const updates: { homePrice?: number; deskPrice?: number } = {};
    if (bulkHome && !isNaN(Number(bulkHome))) updates.homePrice = Number(bulkHome);
    if (bulkDesk && !isNaN(Number(bulkDesk))) updates.deskPrice = Number(bulkDesk);

    if (Object.keys(updates).length > 0) {
      bulkUpdateWilayas(updates);
      toast(locale === "ar" ? "تم تحديث أسعار جميع الولايات بنجاح!" : "Prix mis à jour pour toutes les wilayas !");
      setBulkHome("");
      setBulkDesk("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {locale === "ar" ? "إعدادات المتجر" : "Paramètres du magasin"}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            {locale === "ar"
              ? "إدارة الشحن والخدمات والنماذج والفئات وهوية المتجر وصفحة الشكر من مكان واحد."
              : "Gérez la livraison, les intégrations, les formulaires, les catégories, l’identité et la page de remerciement."}
          </p>
        </div>

        {activeSubTab !== "overview" && (
          <button type="button" onClick={() => setActiveSubTab("overview")} className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
            {locale === "ar" ? "العودة إلى أقسام الإعدادات" : "Retour aux paramètres"}
          </button>
        )}

        {activeSubTab === "overview" && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {([
              { title: locale === "ar" ? "أسعار الشحن والتوصيل" : "Tarifs de livraison", description: locale === "ar" ? "تعديل أسعار المنزل والمكتب حسب الولاية." : "Tarifs domicile et point relais par wilaya.", icon: Truck, tab: "delivery" as const },
              { title: locale === "ar" ? "الربط مع الخدمات" : "Intégrations", description: locale === "ar" ? "إعداد Meta Pixel وTikTok وخدمات الشحن." : "Meta Pixel, TikTok et transporteurs.", icon: Share2, tab: "integrations" as const },
              { title: locale === "ar" ? "إعدادات النموذج" : "Formulaires", description: locale === "ar" ? "التحكم في حقول الطلب في السلة وصفحة المنتج." : "Champs de commande du panier et du produit.", icon: ClipboardList, tab: "form" as const },
              { title: locale === "ar" ? "الصفحة الرئيسية وصفحة المنتج" : "Accueil et page produit", description: locale === "ar" ? "تحرير محتوى الصفحة الرئيسية ومظهر صفحات المنتجات." : "Modifier l’accueil et les pages produit.", icon: House, action: "homepage" as const },
              { title: locale === "ar" ? "إعدادات المتجر" : "Identité du magasin", description: locale === "ar" ? "اسم المتجر وشعاره النصي ورابط الشعار." : "Nom, slogan et logo de la boutique.", icon: Store, tab: "identity" as const },
              { title: locale === "ar" ? "إدارة الفئات" : "Catégories", description: locale === "ar" ? "إضافة الفئات وتعديل أسمائها ووصفها وصورها." : "Créer et modifier les catégories.", icon: Tags, tab: "categories" as const },
              { title: locale === "ar" ? "صفحة الشكر" : "Page de remerciement", description: locale === "ar" ? "تعديل العنوان والنص الظاهر بعد إتمام الطلب." : "Personnaliser le message après la commande.", icon: Check, tab: "thankyou" as const },
            ] satisfies Array<{ title: string; description: string; icon: LucideIcon; tab?: SettingsSection; action?: "homepage" }>).map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => card.action === "homepage" ? onOpenHomepage() : card.tab && setActiveSubTab(card.tab)}
                  className="flex min-h-24 items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-start transition hover:border-purple-400 hover:bg-purple-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-700 dark:hover:bg-purple-950/20"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"><Icon size={20} /></span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">{card.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-zinc-500">{card.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeSubTab !== "overview" && (
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 sm:inline-flex sm:w-auto sm:grid-cols-none dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setActiveSubTab("delivery")}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-[11px] font-bold transition sm:px-3.5 sm:py-1.5 sm:text-xs ${
              activeSubTab === "delivery"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Truck size={14} className="text-purple-600" />
            <span>{locale === "ar" ? "أسعار التوصيل (58 ولاية)" : "Tarifs Livraison"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("integrations")}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-[11px] font-bold transition sm:px-3.5 sm:py-1.5 sm:text-xs ${
              activeSubTab === "integrations" || activeSubTab === "ecotrack" || activeSubTab === "nord_ouest" || activeSubTab === "pixels"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Share2 size={14} className="text-emerald-600" />
            <span>{locale === "ar" ? "ربط الخدمات" : "Intégrations"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("nord_ouest")}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-[11px] font-bold transition sm:px-3.5 sm:py-1.5 sm:text-xs ${
              activeSubTab === "nord_ouest"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Truck size={14} className="text-blue-600" />
            <span>{locale === "ar" ? "شركة Nord Et Ouest" : "Nord Et Ouest"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("pixels")}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-[11px] font-bold transition sm:px-3.5 sm:py-1.5 sm:text-xs ${
              activeSubTab === "pixels"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Radio size={14} className="text-purple-600" />
            <span>{locale === "ar" ? "البيكسل الإعلاني" : "Pixels"}</span>
          </button>
        </div>
        )}
      </div>

      {activeSubTab === "integrations" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([
            { label: "EcoTrack", description: locale === "ar" ? "رفع الطلبات وإنشاء الشحنات." : "Expédition des commandes.", tab: "ecotrack" as const, icon: Truck },
            { label: "Nord Et Ouest", description: locale === "ar" ? "إعداد اتصال شركة التوصيل." : "Configurer le transporteur.", tab: "nord_ouest" as const, icon: Truck },
            { label: locale === "ar" ? "Meta Pixel وTikTok" : "Meta Pixel et TikTok", description: locale === "ar" ? "معرفات التتبع وموافقة التسويق." : "Pixels et consentement marketing.", tab: "pixels" as const, icon: Radio },
          ]).map((service) => {
            const Icon = service.icon;
            return <button key={service.tab} type="button" onClick={() => setActiveSubTab(service.tab)} className="rounded-xl border border-zinc-200 bg-white p-5 text-start hover:border-purple-400 dark:border-zinc-800 dark:bg-zinc-900"><Icon size={20} className="mb-3 text-purple-600" /><span className="block text-sm font-bold">{service.label}</span><span className="mt-1 block text-xs text-zinc-500">{service.description}</span></button>;
          })}
        </div>
      )}

      {/* TAB 1: DELIVERY PRICING */}
      {activeSubTab === "delivery" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <label className="min-w-48 flex-1 space-y-1 text-xs font-semibold">
              <span>{locale === "ar" ? "نظام حساب التوصيل" : "Calcul de la livraison"}</span>
              <select value={settings.shippingType} onChange={(event) => updateSettings({ shippingType: event.target.value as typeof settings.shippingType })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                <option value="custom">{locale === "ar" ? "حسب الولاية" : "Par wilaya"}</option>
                <option value="fixed">{locale === "ar" ? "سعر ثابت" : "Prix fixe"}</option>
                <option value="free">{locale === "ar" ? "توصيل مجاني" : "Gratuit"}</option>
              </select>
            </label>
            <label className="space-y-1 text-xs font-semibold">
              <span>{locale === "ar" ? "ثابت للمنزل" : "Fixe domicile"}</span>
              <input type="number" min="0" value={settings.defaultHomePrice} onChange={(event) => updateSettings({ defaultHomePrice: Math.max(0, Number(event.target.value)) })} className="block w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
            </label>
            <label className="space-y-1 text-xs font-semibold">
              <span>{locale === "ar" ? "ثابت للمكتب" : "Fixe point relais"}</span>
              <input type="number" min="0" value={settings.defaultDeskPrice} onChange={(event) => updateSettings({ defaultDeskPrice: Math.max(0, Number(event.target.value)) })} className="block w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
            </label>
            <label className="space-y-1 text-xs font-semibold">
              <span>{locale === "ar" ? "الشحن مجاني ابتداءً من (د.ج)" : "Livraison gratuite dès (DZD)"}</span>
              <input type="number" min="0" value={settings.freeShippingThreshold} onChange={(event) => updateSettings({ freeShippingThreshold: Math.max(0, Number(event.target.value)) })} className="block w-40 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
            </label>
            <button type="button" disabled={savingShared} onClick={() => void saveShared()} className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Save size={14} />{locale === "ar" ? "حفظ أسعار وإعدادات التوصيل" : "Enregistrer les tarifs"}</button>
          </div>

          {/* Quick Bulk Pricing Tool */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {locale === "ar" ? "⚡ تسعير سريع لجميع الولايات دفعة واحدة" : "Mise à jour globale des tarifs"}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{locale === "ar" ? "سعر المنزل:" : "Domicile :"}</span>
                <input
                  type="number"
                  placeholder="مثال: 600"
                  value={bulkHome}
                  onChange={(e) => setBulkHome(e.target.value)}
                  className="w-28 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{locale === "ar" ? "سعر المكتب (Stop Desk):" : "Stop Desk :"}</span>
                <input
                  type="number"
                  placeholder="مثال: 400"
                  value={bulkDesk}
                  onChange={(e) => setBulkDesk(e.target.value)}
                  className="w-28 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <button
                type="button"
                onClick={handleApplyBulk}
                className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-purple-700 active:scale-95"
              >
                {locale === "ar" ? "تطبيق على كل الولايات" : "Appliquer à tous"}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search size={15} className="absolute start-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "ar" ? "ابحث عن ولاية أو رقم..." : "Rechercher une wilaya..."}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 ps-9 pe-4 text-xs font-medium focus:border-purple-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>

            <span className="text-xs text-zinc-400">
              {locale === "ar" ? `${filteredWilayas.length} ولاية` : `${filteredWilayas.length} wilayas`}
            </span>
          </div>

          {/* Wilayas Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWilayas.map((w) => (
              <div
                key={w.code}
                className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                  w.enabled
                    ? "border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                    : "border-zinc-200/50 bg-zinc-100/50 opacity-60 dark:border-zinc-800/40 dark:bg-zinc-900/40"
                }`}
              >
                <div>
                  {/* Wilaya Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {locale === "ar" ? w.nameAr : w.nameFr}
                    </span>

                    <label className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={w.enabled}
                        onChange={(e) => updateWilayaPrice(w.code, { enabled: e.target.checked })}
                        className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-zinc-500">
                        {w.enabled ? (locale === "ar" ? "متاح" : "Actif") : (locale === "ar" ? "معطل" : "Inactif")}
                      </span>
                    </label>
                  </div>

                  {/* Prices Inputs */}
                  <div className="space-y-2">
                    {/* Home Delivery */}
                    <div>
                      <label className="mb-0.5 block text-[10px] text-zinc-500">
                        {locale === "ar" ? "🏠 توصيل للمنزل (د.ج):" : "🏠 Domicile (DZD) :"}
                      </label>
                      <input
                        type="number"
                        disabled={!w.enabled}
                        value={w.homePrice}
                        onChange={(e) => updateWilayaPrice(w.code, { homePrice: Number(e.target.value) })}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>

                    {/* Desk Delivery */}
                    <div>
                      <div className="mb-0.5 flex items-center justify-between">
                        <label className="text-[10px] text-zinc-500">
                          {locale === "ar" ? "🏢 استلام من المكتب (د.ج):" : "🏢 Stop Desk (DZD) :"}
                        </label>
                        <label className="flex items-center gap-1 text-[9px] text-zinc-400">
                          <input
                            type="checkbox"
                            checked={w.deskEnabled}
                            onChange={(e) => updateWilayaPrice(w.code, { deskEnabled: e.target.checked })}
                            className="h-3 w-3 rounded text-purple-600"
                          />
                          {locale === "ar" ? "متوفر" : "Dispo"}
                        </label>
                      </div>
                      <input
                        type="number"
                        disabled={!w.enabled || !w.deskEnabled}
                        value={w.deskPrice}
                        onChange={(e) => updateWilayaPrice(w.code, { deskPrice: Number(e.target.value) })}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "form" && (
        <div className="max-w-3xl space-y-5" dir={locale === "ar" ? "rtl" : "ltr"}>
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <h2 className="font-bold">{locale === "ar" ? "إعدادات نموذج السلة" : "Formulaire du panier"}</h2>
              <p className="mt-1 text-xs text-zinc-500">{locale === "ar" ? "التحكم في ظهور البريد والملاحظات والنص الإرشادي." : "Affichez ou masquez l’e-mail et les notes."}</p>
            </div>
            <label className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <span>{locale === "ar" ? "إظهار البريد الإلكتروني في نموذج السلة" : "Afficher l’e-mail dans le panier"}</span>
              <input type="checkbox" checked={storefront.checkout.showEmail} onChange={(event) => updateStorefront({ checkout: { ...storefront.checkout, showEmail: event.target.checked } })} />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <span>{locale === "ar" ? "إظهار خانة ملاحظات الطلب" : "Afficher les notes de commande"}</span>
              <input type="checkbox" checked={storefront.checkout.showNotes} onChange={(event) => updateStorefront({ checkout: { ...storefront.checkout, showNotes: event.target.checked } })} />
            </label>
            {(["ar", "fr"] as const).map((language) => (
              <label key={language} className="block space-y-1 text-xs font-semibold">
                <span>{locale === "ar" ? "النص الإرشادي لنموذج السلة" : "Texte du formulaire panier"} ({language === "ar" ? "العربية" : "Français"})</span>
                <input dir={language === "ar" ? "rtl" : "ltr"} value={storefront.checkout.intro[language]} onChange={(event) => updateStorefront({ checkout: { ...storefront.checkout, intro: { ...storefront.checkout.intro, [language]: event.target.value } } })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
              </label>
            ))}
          </section>
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-bold">{locale === "ar" ? "نموذج الطلب السريع في صفحة المنتج" : "Formulaire rapide de la page produit"}</h2>
            <label className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <span>{locale === "ar" ? "إظهار خانة العنوان" : "Afficher l’adresse"}</span>
              <input type="checkbox" checked={storefront.productForm.showAddress} onChange={(event) => updateStorefront({ productForm: { ...storefront.productForm, showAddress: event.target.checked } })} />
            </label>
            {(["ar", "fr"] as const).map((language) => (
              <label key={language} className="block space-y-1 text-xs font-semibold">
                <span>{locale === "ar" ? "النص الإرشادي لصفحة المنتج" : "Texte de la page produit"} ({language === "ar" ? "العربية" : "Français"})</span>
                <input dir={language === "ar" ? "rtl" : "ltr"} value={storefront.productForm.intro[language]} onChange={(event) => updateStorefront({ productForm: { ...storefront.productForm, intro: { ...storefront.productForm.intro, [language]: event.target.value } } })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
              </label>
            ))}
          </section>
          <button type="button" disabled={savingShared} onClick={() => void saveShared()} className="flex items-center gap-2 rounded-lg bg-purple-700 px-5 py-3 text-xs font-bold text-white disabled:opacity-50"><Save size={14} />{locale === "ar" ? "حفظ إعدادات النماذج" : "Enregistrer les formulaires"}</button>
        </div>
      )}

      {activeSubTab === "identity" && (
        <section className="max-w-2xl space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900" dir={locale === "ar" ? "rtl" : "ltr"}>
          <h2 className="font-bold">{locale === "ar" ? "هوية المتجر" : "Identité du magasin"}</h2>
          <label className="block space-y-1 text-xs font-semibold">
            <span>{locale === "ar" ? "اسم المتجر" : "Nom du magasin"}</span>
            <input value={storefront.storeName} onChange={(event) => updateStorefront({ storeName: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </label>
          <label className="block space-y-1 text-xs font-semibold">
            <span>{locale === "ar" ? "الشعار النصي" : "Slogan"}</span>
            <input value={storefront.storeTagline} onChange={(event) => updateStorefront({ storeTagline: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </label>
          <label className="block space-y-1 text-xs font-semibold">
            <span>{locale === "ar" ? "رابط صورة الشعار (اختياري)" : "URL du logo (facultatif)"}</span>
            <input dir="ltr" type="url" value={storefront.logoUrl} onChange={(event) => updateStorefront({ logoUrl: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </label>
          <p className="text-xs text-zinc-500">{locale === "ar" ? "يظهر الاسم والشعار في شريط المتجر. اترك رابط الصورة فارغًا لاستخدام الاسم كنص." : "Le nom et le logo apparaissent dans l’en-tête."}</p>
          <button type="button" disabled={savingShared} onClick={() => void saveShared()} className="flex items-center gap-2 rounded-lg bg-purple-700 px-5 py-3 text-xs font-bold text-white disabled:opacity-50"><Save size={14} />{locale === "ar" ? "حفظ هوية المتجر" : "Enregistrer l’identité"}</button>
        </section>
      )}

      {activeSubTab === "thankyou" && (
        <section className="max-w-3xl space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900" dir={locale === "ar" ? "rtl" : "ltr"}>
          <div><h2 className="font-bold">{locale === "ar" ? "محتوى صفحة الشكر" : "Contenu de la page de remerciement"}</h2><p className="mt-1 text-xs text-zinc-500">{locale === "ar" ? "يظهر بعد إنشاء الطلب. استخدم {ref} لإظهار رقم الطلب." : "Affiché après la commande. Utilisez {ref} pour insérer sa référence."}</p></div>
          {(["title", "body", "buttonLabel"] as const).map((field) => (
            <fieldset key={field} className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-2 text-xs font-bold">{field === "title" ? locale === "ar" ? "العنوان" : "Titre" : field === "body" ? locale === "ar" ? "رسالة التأكيد" : "Message" : locale === "ar" ? "زر المتابعة" : "Bouton"}</legend>
              {(["ar", "fr"] as const).map((language) => <label key={language} className="space-y-1 text-xs font-medium"><span>{language === "ar" ? "العربية" : "Français"}</span><textarea rows={field === "body" ? 3 : 1} dir={language === "ar" ? "rtl" : "ltr"} value={storefront.thankYou[field][language]} onChange={(event) => updateStorefront({ thankYou: { ...storefront.thankYou, [field]: { ...storefront.thankYou[field], [language]: event.target.value } } })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" /></label>)}
            </fieldset>
          ))}
          <button type="button" disabled={savingShared} onClick={() => void saveShared()} className="flex items-center gap-2 rounded-lg bg-purple-700 px-5 py-3 text-xs font-bold text-white disabled:opacity-50"><Save size={14} />{locale === "ar" ? "حفظ صفحة الشكر" : "Enregistrer la page"}</button>
        </section>
      )}

      {activeSubTab === "categories" && (
        <AdminCategoriesSettings categories={categories} onSave={onSaveCategory} onDelete={onDeleteCategory} />
      )}

      {/* TAB 2: ECOTRACK INTEGRATION */}
      {activeSubTab === "ecotrack" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <Truck size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {locale === "ar" ? "ربط شركة التوصيل (EcoTrack)" : "Intégration EcoTrack"}
                </h2>
                <p className="text-xs text-zinc-500">
                  {locale === "ar"
                    ? "ربط المتجر بمنصة EcoTrack لإرسال الطلبات وتوليد بوليصات الشحن تلقائياً."
                    : "Connectez votre boutique à EcoTrack pour l'expédition automatique."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enable EcoTrack Toggle */}
              <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/60">
                <div>
                  <p className="text-xs font-bold">{locale === "ar" ? "تفعيل الربط مع EcoTrack" : "Activer EcoTrack"}</p>
                  <p className="text-[11px] text-zinc-400">
                    {locale === "ar" ? "السماح بإرسال الطلبات إلى خوادم التوصيل" : "Permettre l'envoi des commandes"}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={ecotrackEnabled}
                    onChange={(e) => setEcotrackEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-zinc-300 peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-focus:outline-none after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all" />
                </label>
              </div>

              {/* API Token */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "رمز الوصول الخاص بك (API Token) *" : "Jeton API (Token) *"}
                </label>
                <input
                  type="password"
                  value={ecotrackToken}
                  onChange={(e) => setEcotrackToken(e.target.value)}
                  placeholder="Bearer xxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <p className="mt-1 text-[10px] text-zinc-400">
                  {locale === "ar"
                    ? "يمكنك الحصول عليه من لوحة تحكم حسابك في EcoTrack من قسم Paramètres > API."
                    : "Disponible dans vos paramètres API EcoTrack."}
                </p>
              </div>

              {/* API Base URL */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "رابط خادم EcoTrack (Endpoint)" : "URL du serveur API"}
                </label>
                <input
                  type="text"
                  value={ecotrackUrl}
                  onChange={(e) => setEcotrackUrl(e.target.value)}
                  placeholder="https://dhd.ecotrack.dz/api/v1"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <p className="mt-1 text-[10px] text-zinc-400">
                  {locale === "ar"
                    ? "استخدم نطاق شركة التوصيل التي تتعامل معها (مثل dhd.ecotrack.dz أو packers.ecotrack.dz)، وليس api.ecotrack.dz."
                    : "Utilisez le domaine de votre transporteur (ex. dhd.ecotrack.dz), pas api.ecotrack.dz."}
                </p>
              </div>

              {/* Auto send on confirm */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800">
                <input
                  type="checkbox"
                  checked={ecotrackAutoSend}
                  onChange={(e) => setEcotrackAutoSend(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {locale === "ar" ? "إرسال تلقائي للطلب عند تحويله إلى 'مؤكد'" : "Envoi automatique après confirmation"}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {locale === "ar"
                      ? "عند تغيير حالة الطلب في لوحة التحكم إلى 'مؤكد'، يتم إرساله فوراً لشركة التوصيل."
                      : "Dès que vous confirmez la commande, elle est expédiée sur EcoTrack."}
                  </p>
                </div>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestEcoTrack}
                  disabled={isTestingEcoTrack}
                  className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  {isTestingEcoTrack ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  <span>{locale === "ar" ? "اختبار الاتصال" : "Tester la connexion"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveEcoTrack}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-95"
                >
                  <Save size={15} />
                  <span>{locale === "ar" ? "حفظ إعدادات EcoTrack" : "Enregistrer EcoTrack"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: NORD ET OUEST */}
      {activeSubTab === "nord_ouest" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                <Truck size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {locale === "ar" ? "ربط شركة التوصيل (Nord Et Ouest)" : "Intégration Nord Et Ouest"}
                </h2>
                <p className="text-xs text-zinc-500">
                  {locale === "ar"
                    ? "ربط المتجر بشركة Nord Et Ouest لإرسال الطلبات وتوليد بوليصات الشحن تلقائياً."
                    : "Connectez votre boutique à Nord Et Ouest pour l'expédition automatique."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enable Nord Et Ouest Toggle */}
              <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/60">
                <div>
                  <p className="text-xs font-bold">{locale === "ar" ? "تفعيل الربط مع Nord Et Ouest" : "Activer Nord Et Ouest"}</p>
                  <p className="text-[11px] text-zinc-400">
                    {locale === "ar" ? "السماح بإرسال الطلبات إلى خوادم Nord Et Ouest" : "Permettre l'envoi des commandes"}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={nordEnabled}
                    onChange={(e) => setNordEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-zinc-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all" />
                </label>
              </div>

              {/* API Token */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "رمز الوصول الخاص بك (API Token) *" : "Jeton API (Token) *"}
                </label>
                <input
                  type="password"
                  value={nordToken}
                  onChange={(e) => setNordToken(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <p className="mt-1 text-[10px] text-zinc-400">
                  {locale === "ar"
                    ? "يمكنك الحصول عليه من لوحة تحكم حسابك في Nord Et Ouest."
                    : "Disponible dans votre tableau de bord Nord Et Ouest."}
                </p>
              </div>

              {/* API Base URL */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "رابط خادم Nord Et Ouest (Endpoint)" : "URL du serveur API"}
                </label>
                <input
                  type="text"
                  value={nordUrl}
                  onChange={(e) => setNordUrl(e.target.value)}
                  placeholder="https://api.nordetouest.com/api/v1"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              {/* Auto send on confirm */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800">
                <input
                  type="checkbox"
                  checked={nordAutoSend}
                  onChange={(e) => setNordAutoSend(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {locale === "ar" ? "إرسال تلقائي للطلب عند تحويله إلى 'مؤكد'" : "Envoi automatique après confirmation"}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {locale === "ar"
                      ? "عند تغيير حالة الطلب إلى 'مؤكد'، يتم إرساله فوراً لشركة Nord Et Ouest."
                      : "Dès que vous confirmez la commande, elle est expédiée sur Nord Et Ouest."}
                  </p>
                </div>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestNord}
                  disabled={isTestingNord}
                  className="flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                >
                  {isTestingNord ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  <span>{locale === "ar" ? "فحص الإعدادات" : "Vérifier la configuration"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveNordEtOuest}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-95"
                >
                  <Save size={15} />
                  <span>{locale === "ar" ? "حفظ إعدادات Nord Et Ouest" : "Enregistrer Nord Et Ouest"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "pixels" && <PixelSettingsEditor />}
    </div>
  );
}
