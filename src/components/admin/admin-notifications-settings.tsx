"use client";

import { useState } from "react";
import {
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Save,
  Radio,
  Phone,
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function AdminNotificationsSettings() {
  const { locale } = useLocale();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  // Telegram State
  const [telegramEnabled, setTelegramEnabled] = useState(
    settings.telegram?.enabled ?? false
  );
  const [botToken, setBotToken] = useState(settings.telegram?.botToken || "");
  const [chatId, setChatId] = useState(settings.telegram?.chatId || "");
  const [showToken, setShowToken] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);

  // WhatsApp State
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    settings.whatsapp?.enabled ?? true
  );
  const [storePhone, setStorePhone] = useState(
    settings.whatsapp?.storePhone || "0697041176"
  );
  const [autoOpenChat, setAutoOpenChat] = useState(
    settings.whatsapp?.autoOpenChat ?? true
  );

  const [saving, setSaving] = useState(false);

  // Test Telegram Bot
  async function handleTestTelegram() {
    if (!botToken.trim() || !chatId.trim()) {
      toast(
        locale === "ar"
          ? "يرجى إدخال Bot Token و Chat ID أولاً"
          : "Veuillez renseigner le Bot Token et Chat ID"
      );
      return;
    }

    setTestingTelegram(true);
    try {
      const res = await fetch("/api/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: botToken.trim(),
          chatId: chatId.trim(),
          isTest: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          locale === "ar"
            ? "✅ تم إرسال الإشعار التجريبي إلى التلغرام بنجاح! تفقد هاتفك."
            : "Notification de test envoyée avec succès sur Telegram !"
        );
      } else {
        toast(
          locale === "ar"
            ? `⚠️ تعذر الإرسال: ${data.error}`
            : `Erreur : ${data.error}`
        );
      }
    } catch (err) {
      console.error(err);
      toast(
        locale === "ar"
          ? "حدث خطأ أثناء الاتصال بسيرفر التلغرام"
          : "Erreur de connexion"
      );
    } finally {
      setTestingTelegram(false);
    }
  }

  // Save All Notification Settings
  function handleSave() {
    setSaving(true);
    try {
      updateSettings({
        telegram: {
          enabled: telegramEnabled,
          botToken: botToken.trim(),
          chatId: chatId.trim(),
        },
        whatsapp: {
          enabled: whatsappEnabled,
          storePhone: storePhone.trim(),
          autoOpenChat: autoOpenChat,
        },
      });
      toast(
        locale === "ar"
          ? "تم حفظ إعدادات الإشعارات بنجاح!"
          : "Paramètres de notification enregistrés !"
      );
    } catch (err) {
      console.error(err);
      toast(locale === "ar" ? "تعذر حفظ الإعدادات" : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-[#181818] to-purple-950/20 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
            <Radio size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {locale === "ar"
                ? "إشعارات الطلبات الفورية (Telegram & WhatsApp)"
                : "Notifications automatiques des commandes"}
            </h2>
            <p className="text-xs text-zinc-400">
              {locale === "ar"
                ? "احصل على إشعار صوتي فوري في هاتفك عبر التلغرام عند كل طلب، وأرسل رسائل تأكيد آلية للزبائن عبر الواتساب."
                : "Recevez des alertes instantanées sur Telegram et envoyez des messages de confirmation WhatsApp."}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Telegram Bot Section */}
      <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#229ED9]/20 text-[#229ED9]">
              <Send size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {locale === "ar"
                  ? "إشعارات التلغرام الفورية (Telegram Bot)"
                  : "Alertes Telegram Bot"}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {locale === "ar"
                  ? "يصلك إشعار لحظي كامل بتفاصيل كل طلب جديد"
                  : "Recevez une notification détaillée à chaque commande"}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={telegramEnabled}
              onChange={(e) => setTelegramEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
            <span className="ms-2 text-xs font-semibold text-zinc-300">
              {telegramEnabled
                ? locale === "ar"
                  ? "مفعل"
                  : "Activé"
                : locale === "ar"
                ? "معطل"
                : "Désactivé"}
            </span>
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Bot Token */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-300">
              {locale === "ar" ? "رمز البوت (Telegram Bot Token):" : "Token du Bot Telegram :"}
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="مثال: 7123456789:AAHq_AbcDefGhiJklMnoPqrStuVwxYz"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2.5 pe-10 text-xs font-mono text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute end-3 top-3 text-zinc-500 hover:text-zinc-300"
              >
                {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Chat ID */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-300">
              {locale === "ar" ? "معرف المحادثة (Telegram Chat ID):" : "ID du Chat Telegram :"}
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="مثال: 123456789 أو -100123456789 للمجموعات"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Test Button & Guide Box */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
          <button
            type="button"
            onClick={handleTestTelegram}
            disabled={testingTelegram}
            className="flex items-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1e8bc0] disabled:opacity-50"
          >
            {testingTelegram ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Send size={14} />
            )}
            <span>
              {testingTelegram
                ? locale === "ar"
                  ? "جاري إرسال الإشعار..."
                  : "Envoi..."
                : locale === "ar"
                ? "🧪 إرسال إشعار تجريبي الآن"
                : "Envoyer un test Telegram"}
            </span>
          </button>

          {/* Quick 3-Step Guide */}
          <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 text-xs text-zinc-400">
            <p className="font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-purple-400" />
              {locale === "ar" ? "كيف تحصل على البوت و Chat ID في دقيقة واحدة؟" : "Comment configurer le Bot en 1 minute ?"}
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-400">
              <li>
                {locale === "ar"
                  ? "افتح تطبيق تلغرام وابحث عن @BotFather وأرسل له /newbot لتحصل على الـ Token."
                  : "Cherchez @BotFather sur Telegram et envoyez /newbot pour obtenir le Token."}
              </li>
              <li>
                {locale === "ar"
                  ? "ادخل إلى بوتك الجديد واضغط على Start."
                  : "Ouvrez votre nouveau bot et cliquez sur Start."}
              </li>
              <li>
                {locale === "ar"
                  ? "احصل على معرفك (Chat ID) بإرسال أي رسالة للبوت @userinfobot ثم الصقه هنا واضغط إرسال تجريبي."
                  : "Envoyez un message à @userinfobot pour copier votre Chat ID, collez-le ici et testez."}
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* 2. WhatsApp Customer Messaging Section */}
      <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {locale === "ar"
                  ? "إشعارات ورسائل الواتساب للعملاء (WhatsApp)"
                  : "Notifications WhatsApp aux clients"}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {locale === "ar"
                  ? "تأكيد الطلبات وإشعار الزبائن فورياً بوصول طرودهم"
                  : "Confirmation des commandes et suivi de livraison via WhatsApp"}
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsappEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
            <span className="ms-2 text-xs font-semibold text-zinc-300">
              {whatsappEnabled
                ? locale === "ar"
                  ? "مفعل"
                  : "Activé"
                : locale === "ar"
                ? "معطل"
                : "Désactivé"}
            </span>
          </label>
        </div>

        <div className="mt-5 space-y-4">
          {/* Store WhatsApp Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-400" />
              <span>{locale === "ar" ? "رقم هاتف المتجر للواتساب (لخدمة العملاء):" : "Numéro WhatsApp de la boutique :"}</span>
            </label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder="0697041176"
              className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Auto WhatsApp Option */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoOpenChat}
                onChange={(e) => setAutoOpenChat(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-xs font-bold text-zinc-200">
                  {locale === "ar"
                    ? "إظهار زر تواصل مباشر بالواتساب في صفحة الشكر للزبون"
                    : "Afficher le bouton WhatsApp sur la page de remerciement"}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {locale === "ar"
                    ? "يسمح للزبون بمراسلة المتجر بنقرة واحدة لتأكيد طلبه ومتابعته."
                    : "Permet au client d'envoyer un message WhatsApp avec sa référence de commande."}
                </p>
              </div>
            </label>
          </div>

          {/* Templates Preview Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <h4 className="text-xs font-bold text-zinc-300 mb-2">
              {locale === "ar" ? "📋 نماذج الرسائل المجهزة تلقائياً:" : "Modèles de messages prêts :"}
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2 text-[11px] text-zinc-400">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
                <span className="font-bold text-emerald-400 block mb-1">📩 رسالة استلام الطلب</span>
                «مرحباً {`{اسم_الزبون}`}، تم تسجيل طلبك لـ {`{المنتج}`} بمبلغ {`{المجموع}`} دج. سنتصل بك هاتفياً لتأكيد الشحن...»
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
                <span className="font-bold text-blue-400 block mb-1">🚚 رسالة خروج الطرد مع الموزع</span>
                «مرحباً {`{اسم_الزبون}`}، طلبك في الطريق إليك مع كود التتبع {`{كود_التتبع}`}. يرجى إبقاء الهاتف متاحاً...»
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 disabled:opacity-60"
        >
          <Save size={15} />
          <span>{saving ? (locale === "ar" ? "جاري الحفظ..." : "Enregistrement...") : (locale === "ar" ? "حفظ إعدادات الإشعارات" : "Enregistrer")}</span>
        </button>
      </div>
    </div>
  );
}
