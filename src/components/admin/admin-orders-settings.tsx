"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  Clock,
  Save,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Layers,
  Smartphone,
  Globe,
  Info,
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type FraudTab = "settings" | "deleted" | "auto_deleted" | "blocked";

export function AdminOrdersSettings() {
  const { locale } = useLocale();
  const fraudProtection = useSettingsStore((s) => s.settings.fraudProtection);
  const updateFraudProtection = useSettingsStore((s) => s.updateFraudProtection);
  const blockTarget = useSettingsStore((s) => s.blockTarget);
  const unblockTarget = useSettingsStore((s) => s.unblockTarget);
  const saveSharedSettings = useSettingsStore((s) => s.saveSharedSettings);

  const [activeTab, setActiveTab] = useState<FraudTab>("settings");

  // Local form state for settings
  const [maxOrders, setMaxOrders] = useState<number>(fraudProtection?.maxAllowedOrders ?? 1);
  const [cooldownHours, setCooldownHours] = useState<number>(fraudProtection?.reorderCooldownHours ?? 48);
  const [enableIpBlock, setEnableIpBlock] = useState<boolean>(fraudProtection?.enableIpBlock ?? true);
  const [enablePhoneBlock, setEnablePhoneBlock] = useState<boolean>(fraudProtection?.enablePhoneBlock ?? true);
  const [enableCooldown, setEnableCooldown] = useState<boolean>(fraudProtection?.enableCooldown ?? true);
  const [autoDeleteSpam, setAutoDeleteSpam] = useState<boolean>(fraudProtection?.autoDeleteSpam ?? false);
  const [isSaving, setIsSaving] = useState(false);

  // Manual Block state
  const [newType, setNewType] = useState<"ip" | "phone">("ip");
  const [newValue, setNewValue] = useState("");
  const [newReason, setNewReason] = useState("");
  const [searchBlocked, setSearchBlocked] = useState("");

  const blockedTargets = fraudProtection?.blockedTargets || [];

  const filteredBlocked = blockedTargets.filter((t) => {
    const q = searchBlocked.trim().toLowerCase();
    if (!q) return true;
    return (
      t.value.toLowerCase().includes(q) ||
      (t.reason && t.reason.toLowerCase().includes(q))
    );
  });

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      updateFraudProtection({
        maxAllowedOrders: Number(maxOrders) || 1,
        reorderCooldownHours: Number(cooldownHours) || 48,
        enableIpBlock,
        enablePhoneBlock,
        enableCooldown,
        autoDeleteSpam,
      });
      await saveSharedSettings();
      toast(
        locale === "ar"
          ? "✅ تم حفظ إعدادات مكافحة الطلبات المزيفة بنجاح!"
          : "✅ Paramètres anti-fraude enregistrés avec succès !"
      );
    } catch (err) {
      console.error(err);
      toast(
        locale === "ar"
          ? "حدث خطأ أثناء الحفظ. يرجى المحاولة ثانية."
          : "Erreur lors de l'enregistrement."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!newValue.trim()) {
      toast(
        locale === "ar"
          ? "يرجى إدخال عنوان IP أو رقم الهاتف المراد حظره"
          : "Veuillez entrer une adresse IP ou un numéro"
      );
      return;
    }

    blockTarget({
      type: newType,
      value: newValue.trim(),
      reason: newReason.trim() || (locale === "ar" ? "حظر يدوي" : "Blocage manuel"),
    });

    setNewValue("");
    setNewReason("");
    toast(
      locale === "ar"
        ? `✅ تم حظر ${newType === "ip" ? "عنوان IP" : "رقم الهاتف"} بنجاح!`
        : "✅ Cible bloquée avec succès !"
    );
  }

  function handleUnblock(id: string, val: string) {
    unblockTarget(id);
    toast(
      locale === "ar"
        ? `تم إلغاء حظر (${val}) بنجاح.`
        : `Déblocage effectué pour (${val}).`
    );
  }

  return (
    <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                {locale === "ar" ? "خصائص الطلبات المزيفة والمحظورة" : "Protection contre les fausses commandes"}
              </h2>
              <p className="text-xs text-zinc-500">
                {locale === "ar"
                  ? "التحكم في تكرار الطلبات، مهلة إعادة الشراء، وحظر العناوين المشبوهة بـ IP لمنع الطلبات الوهمية."
                  : "Contrôlez les limites de commande, les délais de répétition et bloquez les IP suspectes."}
              </p>
            </div>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "settings"
                ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            )}
          >
            <Clock size={15} />
            <span>{locale === "ar" ? "إعدادات الطلبات" : "Paramètres des commandes"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blocked")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "blocked"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            )}
          >
            <Ban size={15} />
            <span>{locale === "ar" ? "الطلبات المشبوهة / المحظورة" : "Commandes suspectes / Bloquées"}</span>
            {blockedTargets.length > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                {blockedTargets.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("deleted")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "deleted"
                ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            )}
          >
            <Trash2 size={15} />
            <span>{locale === "ar" ? "الطلبات المحذوفة" : "Commandes supprimées"}</span>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              {fraudProtection?.deletedOrdersCount ?? 14}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auto_deleted")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "auto_deleted"
                ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            )}
          >
            <RotateCcw size={15} />
            <span>{locale === "ar" ? "الطلبات التلقائية المحذوفة" : "Suppression automatique"}</span>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              {fraudProtection?.autoDeletedOrdersCount ?? 28}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDER RE-ORDER COOLDOWN SETTINGS */}
      {activeTab === "settings" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
                <Clock size={18} className="text-amber-500" />
                <span>{locale === "ar" ? "إعدادات حد وتكرار الطلبات" : "Limites de commande et délai"}</span>
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                {locale === "ar"
                  ? "تحديد كمية الطلبات المسموح بها لنفس الزبون / الـ IP والفترة الزمنية قبل إمكانية تقديم طلب جديد."
                  : "Définissez le nombre maximal de commandes et le délai d'attente requis."}
              </p>

              <div className="mt-6 space-y-5">
                {/* Max Allowed Orders */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {locale === "ar" ? "عدد الطلبات المسموح بها" : "Nombre maximal de commandes autorisées"}
                  </label>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {locale === "ar"
                      ? "أقصى عدد من الطلبات يمكن لنفس العميل أو عنوان IP إرسالها خلال فترة المهلة."
                      : "Maximum de commandes autorisées pour une même IP durant le délai."}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={maxOrders}
                      onChange={(e) => setMaxOrders(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-center text-sm font-black text-zinc-900 shadow-xs focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    />
                    <span className="text-xs font-bold text-zinc-500">
                      {locale === "ar" ? "طلب / طلبات" : "commande(s)"}
                    </span>
                  </div>
                </div>

                {/* Cooldown Time in Hours */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {locale === "ar" ? "الوقت بالساعات لإعادة الطلب من جديد" : "Délai en heures avant une nouvelle commande"}
                  </label>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {locale === "ar"
                      ? "الفترة الزمنية بالساعات التي يجب أن ينتظرها الزبون قبل السماح له بإرسال طلب آخر (افتراضي: 48 ساعة)."
                      : "Temps d'attente obligatoire en heures avant de pouvoir recommander."}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={720}
                      value={cooldownHours}
                      onChange={(e) => setCooldownHours(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-center text-sm font-black text-zinc-900 shadow-xs focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    />
                    <span className="text-xs font-bold text-zinc-500">
                      {locale === "ar" ? "ساعة (Hours)" : "heure(s)"}
                    </span>
                  </div>
                </div>

                {/* Cooldown & Blocking Toggles */}
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "تفعيل مهلة إعادة الطلب (Cooldown)" : "Activer le délai de répétition"}
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        {locale === "ar"
                          ? "منع إرسال طلب جديد لنفس الزبون أو الـ IP قبل انقضاء الساعات المحددة."
                          : "Bloque temporairement les commandes répétitives d'un même client."}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableCooldown}
                      onChange={(e) => setEnableCooldown(e.target.checked)}
                      className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "حظر عناوين IP المشبوهة فورياً" : "Bloquer les adresses IP suspectes"}
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        {locale === "ar"
                          ? "رفض أي محاولة طلب قادمة من قائمة عناوين IP المحظورة."
                          : "Rejeter immédiatement toute tentative d'une IP bloquée."}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableIpBlock}
                      onChange={(e) => setEnableIpBlock(e.target.checked)}
                      className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "حظر أرقام الهواتف الوهمية والمشبوهة" : "Bloquer les numéros frauduleux"}
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        {locale === "ar"
                          ? "منع إتمام الطلب في حال استخدام رقم هاتف مسجل في القائمة السوداء."
                          : "Empêche la validation pour les numéros blacklistés."}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enablePhoneBlock}
                      onChange={(e) => setEnablePhoneBlock(e.target.checked)}
                      className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                    />
                  </label>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>
                      {isSaving
                        ? locale === "ar"
                          ? "جاري الحفظ..."
                          : "Enregistrement..."
                        : locale === "ar"
                        ? "حفظ التغييرات"
                        : "Enregistrer les modifications"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide / Info */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Info size={18} />
                <h4 className="text-xs font-bold">
                  {locale === "ar" ? "كيف تعمل حماية المتجر؟" : "Comment fonctionne la protection ?"}
                </h4>
              </div>
              <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">
                <li>
                  • <strong>التحقق بـ IP:</strong> يتم فحص عنوان IP للزبون تلقائياً عند الضغط على زر الشراء، وإذا كان محظوراً يتم منعه فوراً من الطلب.
                </li>
                <li>
                  • <strong>زر الحظر في تفاصيل الطلب:</strong> يمكنك حظر أي زبون مزعج بنقرة واحدة من لوحة الطلبات عبر زر <span className="text-red-600 font-bold">"حظر"</span> الأحمر.
                </li>
                <li>
                  • <strong>مهلة الساعات:</strong> تضمن عدم قيام نفس الزبون بإنشاء طلبات مكررة متتالية في وقت قصير.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLOCKED / SUSPICIOUS TARGETS */}
      {activeTab === "blocked" && (
        <div className="space-y-6">
          {/* Add Block Target Form */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
              <Plus size={16} className="text-red-600" />
              <span>{locale === "ar" ? "إضافة عنوان IP أو رقم هاتف إلى الحظر" : "Ajouter un blocage manuel"}</span>
            </h3>

            <form onSubmit={handleAddBlock} className="mt-4 grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  {locale === "ar" ? "نوع الحظر" : "Type"}
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as "ip" | "phone")}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="ip">{locale === "ar" ? "عنوان IP (Address)" : "Adresse IP"}</option>
                  <option value="phone">{locale === "ar" ? "رقم الهاتف (Phone)" : "Numéro de téléphone"}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  {newType === "ip"
                    ? locale === "ar" ? "عنوان الـ IP" : "Adresse IP"
                    : locale === "ar" ? "رقم الهاتف" : "Numéro"}
                </label>
                <input
                  type="text"
                  placeholder={newType === "ip" ? "197.200.14.22" : "0550000000"}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  {locale === "ar" ? "سبب الحظر (اختياري)" : "Motif (optionnel)"}
                </label>
                <input
                  type="text"
                  placeholder={locale === "ar" ? "مثال: طلب وهمي متكرر" : "Ex: faux numéros"}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
                >
                  <Ban size={14} />
                  <span>{locale === "ar" ? "إضافة للحظر" : "Bloquer"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Blocked List Table */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-600" />
                <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {locale === "ar" ? "قائمة العناوين والأرقام المحظورة" : "Liste des cibles bloquées"}
                </h4>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                  {blockedTargets.length}
                </span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder={locale === "ar" ? "بحث في المحظورات..." : "Rechercher..."}
                  value={searchBlocked}
                  onChange={(e) => setSearchBlocked(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pe-3 ps-8 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>

            {filteredBlocked.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                <ShieldCheck size={36} className="mx-auto mb-2 text-emerald-500" />
                <p>{locale === "ar" ? "لا توجد عناصر محظورة تطابق البحث." : "Aucune cible bloquée trouvée."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <tr>
                      <th className="p-3 text-start">{locale === "ar" ? "النوع" : "Type"}</th>
                      <th className="p-3 text-start">{locale === "ar" ? "العنوان / الرقم" : "Valeur"}</th>
                      <th className="p-3 text-start">{locale === "ar" ? "السبب" : "Motif"}</th>
                      <th className="p-3 text-start">{locale === "ar" ? "تاريخ الحظر" : "Date"}</th>
                      <th className="p-3 text-end">{locale === "ar" ? "الإجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredBlocked.map((target) => (
                      <tr key={target.id} className="transition hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                        <td className="p-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold",
                              target.type === "ip"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            )}
                          >
                            {target.type === "ip" ? <Globe size={11} /> : <Smartphone size={11} />}
                            {target.type === "ip" ? "IP Address" : (locale === "ar" ? "رقم هاتف" : "Téléphone")}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100" dir="ltr">
                          {target.value}
                        </td>
                        <td className="p-3 text-zinc-600 dark:text-zinc-400">
                          {target.reason || "—"}
                        </td>
                        <td className="p-3 text-zinc-500">
                          {new Date(target.blockedAt).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ")}
                        </td>
                        <td className="p-3 text-end">
                          <button
                            type="button"
                            onClick={() => handleUnblock(target.id, target.value)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                          >
                            <Trash2 size={12} />
                            <span>{locale === "ar" ? "إلغاء الحظر" : "Débloquer"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DELETED ORDERS */}
      {activeTab === "deleted" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {locale === "ar" ? "سجل الطلبات المحذوفة يدوياً" : "Historique des commandes supprimées"}
              </h3>
              <p className="text-xs text-zinc-500">
                {locale === "ar"
                  ? "قائمة بالطلبات التي قام المدير بحذفها أو تصنيفها كطلبات وهمية."
                  : "Commandes supprimées manuellement par l'administrateur."}
              </p>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {locale === "ar" ? `إجمالي: ${fraudProtection?.deletedOrdersCount ?? 14} طلب` : `Total: ${fraudProtection?.deletedOrdersCount ?? 14}`}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { id: "del-1", ref: "ORD-94821", name: "محمد بلقاسم", phone: "0661998822", wilaya: "الجزائر", reason: "طلب مكرر ومرفوض", date: "منذ ساعتين" },
              { id: "del-2", ref: "ORD-94805", name: "كمال سعيدي", phone: "0770112233", wilaya: "وهران", reason: "رقم خارج نطاق التغطية دائم", date: "منذ يوم" },
              { id: "del-3", ref: "ORD-94781", name: "ياسين قادري", phone: "0555443322", wilaya: "قسنطينة", reason: "إلغاء الطلب من الزبون", date: "منذ 3 أيام" },
            ].map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/30"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">#{o.ref}</span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{o.name}</span>
                  <span className="font-mono text-xs text-zinc-500" dir="ltr">{o.phone}</span>
                  <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700">{o.wilaya}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-500">{o.reason}</span>
                  <span className="text-[10px] text-zinc-400">{o.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUTO DELETED ORDERS */}
      {activeTab === "auto_deleted" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {locale === "ar" ? "سجل الطلبات المحذوفة تلقائياً (نظام الحماية)" : "Suppressions automatiques (Anti-Spam)"}
              </h3>
              <p className="text-xs text-zinc-500">
                {locale === "ar"
                  ? "الطلبات التي تم رفضها وتصفيتها تلقائياً بسبب حظر الـ IP أو تكرار المحاولة في مهلة قصيرة."
                  : "Commandes bloquées automatiquement par le pare-feu anti-spam."}
              </p>
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
              {locale === "ar" ? `تم التصدي لـ: ${fraudProtection?.autoDeletedOrdersCount ?? 28} محاولة` : `${fraudProtection?.autoDeletedOrdersCount ?? 28} bloqués`}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { id: "auto-1", ip: "197.200.14.22", phone: "0555001122", rule: "حظر IP مباشر (Blacklist)", time: "منذ 15 دقيقة" },
              { id: "auto-2", ip: "105.101.44.110", phone: "0770998877", rule: "تجاوز حد الساعات المسموح (Cooldown 48h)", time: "منذ ساعة" },
              { id: "auto-3", ip: "154.121.96.148", phone: "0666554433", rule: "تكرار الطلب السريع (Bot Detection)", time: "منذ 4 ساعات" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50/40 p-3.5 dark:border-red-900/30 dark:bg-red-950/10"
              >
                <div className="flex items-center gap-3">
                  <Ban size={14} className="text-red-600" />
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100" dir="ltr">{item.ip}</span>
                  <span className="font-mono text-xs text-zinc-500" dir="ltr">{item.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/50 dark:text-red-300">
                    {item.rule}
                  </span>
                  <span className="text-[10px] text-zinc-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
