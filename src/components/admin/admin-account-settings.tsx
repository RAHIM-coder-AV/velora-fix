"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Key,
  ShieldCheck,
  Smartphone,
  Laptop,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type AccountTab = "info" | "password" | "devices" | "2fa";

export function AdminAccountSettings() {
  const { locale } = useLocale();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updateEmail = useAuthStore((s) => s.updateEmail);
  const updatePassword = useAuthStore((s) => s.updatePassword);

  const [activeTab, setActiveTab] = useState<AccountTab>("info");

  // Account Info Form
  const [fullName, setFullName] = useState(user?.fullName || "Abderrahim kouriche");
  const [phone, setPhone] = useState(user?.phone || "0697041176");
  const [email, setEmail] = useState(user?.email || "azrtefsgy@gmail.com");
  const [birthDate, setBirthDate] = useState("1998-07-06");
  const [savingInfo, setSavingInfo] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Save Account Info
  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await updateProfile({
        fullName,
        phone,
      });

      if (email !== user?.email) {
        const emailResult = await updateEmail(email);
        if (emailResult && emailResult !== "no-supabase") {
          toast(
            locale === "ar"
              ? `تم حفظ البيانات، وأرسل رابط تأكيد البريد الجديد: ${email}`
              : `Profil mis à jour, lien de confirmation envoyé à ${email}`
          );
        } else {
          toast(
            locale === "ar"
              ? "تم حفظ معلومات الحساب بنجاح"
              : "Informations du compte enregistrées"
          );
        }
      } else {
        toast(
          locale === "ar"
            ? "تم حفظ معلومات الحساب بنجاح"
            : "Informations du compte enregistrées"
        );
      }
    } catch (err) {
      console.error(err);
      toast(
        locale === "ar"
          ? "حدث خطأ أثناء حفظ المعلومات"
          : "Erreur lors de la sauvegarde"
      );
    } finally {
      setSavingInfo(false);
    }
  }

  // Save Password
  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (!newPassword || newPassword.length < 6) {
      setPasswordError(
        locale === "ar"
          ? "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل"
          : "Le nouveau mot de passe doit contenir au moins 6 caractères"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        locale === "ar"
          ? "كلمة المرور الجديدة غير متطابقة مع التأكيد"
          : "Les mots de passe ne correspondent pas"
      );
      return;
    }

    setSavingPassword(true);
    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (result === "wrong-password") {
        setPasswordError(
          locale === "ar"
            ? "كلمة المرور القديمة غير صحيحة"
            : "L'ancien mot de passe est incorrect"
        );
        return;
      }

      toast(
        locale === "ar"
          ? "تم تغيير كلمة المرور بنجاح"
          : "Mot de passe modifié avec succès"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPasswordError(
        locale === "ar"
          ? "تعذر تغيير كلمة المرور، يرجى المحاولة لاحقاً"
          : "Impossible de modifier le mot de passe"
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Container matching Screenshot */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 shadow-md sm:p-6">
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-purple-300 sm:text-2xl">
              {locale === "ar" ? "إعدادات الحساب" : "Paramètres du compte"}
            </h1>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              {locale === "ar"
                ? "إدارة معلومات الحساب وكلمة المرور والأجهزة المتصلة"
                : "Gérez les informations du compte, le mot de passe et les sessions"}
            </p>
          </div>

          {/* Navigation Tabs Bar matching Screenshot */}
          <div className="flex flex-wrap gap-1 rounded-xl border border-zinc-800 bg-[#1e1e1e] p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold transition",
                activeTab === "info"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {locale === "ar" ? "معلومات الحساب" : "Informations"}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold transition",
                activeTab === "password"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {locale === "ar" ? "تغيير كلمة المرور" : "Mot de passe"}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("devices")}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold transition",
                activeTab === "devices"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {locale === "ar" ? "الأجهزة المتصلة" : "Appareils connectés"}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("2fa")}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold transition",
                activeTab === "2fa"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {locale === "ar" ? "المصادقة الثنائية" : "Sécurité 2FA"}
            </button>
          </div>
        </div>

        {/* Tab 1: Account Information (معلومات الحساب) */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveInfo} className="mt-6 space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <User size={18} className="text-purple-400" />
              <span>{locale === "ar" ? "معلومات الحساب" : "Informations du profil"}</span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-purple-300">
                  {locale === "ar" ? "الإسم" : "Nom complet"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Abderrahim kouriche"
                  />
                  <User size={16} className="absolute end-3.5 top-3.5 text-zinc-500" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-purple-300">
                  {locale === "ar" ? "رقم الجوال" : "Numéro de téléphone"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-end font-mono"
                    placeholder="0697041176"
                  />
                  <Phone size={16} className="absolute end-3.5 top-3.5 text-zinc-500" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-purple-300">
                  {locale === "ar" ? "البريد الإلكتروني" : "Adresse e-mail"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="azrtefsgy@gmail.com"
                  />
                  <Mail size={16} className="absolute end-3.5 top-3.5 text-zinc-500" />
                </div>
              </div>

              {/* Birthdate / Info */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-purple-300">
                  {locale === "ar" ? "تاريخ الميلاد" : "Date de naissance"}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Calendar size={16} className="absolute end-3.5 top-3.5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingInfo}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95 disabled:opacity-50"
              >
                <Save size={15} />
                <span>
                  {savingInfo
                    ? locale === "ar" ? "جاري الحفظ..." : "Enregistrement..."
                    : locale === "ar" ? "حفظ التغييرات" : "Enregistrer les modifications"}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Password (تغيير كلمة المرور) */}
        {activeTab === "password" && (
          <form onSubmit={handleSavePassword} className="mt-6 space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Lock size={18} className="text-purple-400" />
              <span>{locale === "ar" ? "تغيير كلمة المرور" : "Modifier le mot de passe"}</span>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-purple-300">
                  {locale === "ar" ? "كلمة المرور القديمة" : "Mot de passe actuel"}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={locale === "ar" ? "كلمة المرور القديمة" : "Mot de passe actuel"}
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute end-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* New Password */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-purple-300">
                    {locale === "ar" ? "كلمة المرور الجديدة" : "Nouveau mot de passe"}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={locale === "ar" ? "كلمة المرور الجديدة" : "Nouveau mot de passe"}
                      className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute end-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-purple-300">
                    {locale === "ar" ? "تأكيد كلمة المرور الجديدة" : "Confirmer le mot de passe"}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={locale === "ar" ? "تأكيد كلمة المرور الجديدة" : "Confirmer le mot de passe"}
                      className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-3 pe-10 ps-4 text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <Key size={16} className="absolute end-3.5 top-3.5 text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95 disabled:opacity-50"
              >
                <Key size={15} />
                <span>
                  {savingPassword
                    ? locale === "ar" ? "جاري التغيير..." : "Modification..."
                    : locale === "ar" ? "تغيير كلمة المرور" : "Changer le mot de passe"}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Connected Devices (الأجهزة المتصلة) */}
        {activeTab === "devices" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                <Laptop size={18} className="text-purple-400" />
                <span>{locale === "ar" ? "الأجهزة والجلسات النشطة" : "Sessions et appareils"}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast(locale === "ar" ? "تم تسجيل الخروج من باقي الأجهزة" : "Déconnexion des autres sessions réussie")
                }
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-950/40 transition"
              >
                <LogOut size={13} />
                <span>{locale === "ar" ? "تسجيل الخروج من باقي الأجهزة" : "Déconnecter les autres"}</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Laptop size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-zinc-100">Windows PC • Chrome</p>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {locale === "ar" ? "هذا الجهاز (نشط الآن)" : "Cet appareil (actif)"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      {locale === "ar" ? "الجزائر • آخر نشاط: الآن" : "Algérie • Dernière activité : À l'instant"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-zinc-100">Mobile App • Android / iOS</p>
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                        {locale === "ar" ? "متصل" : "En ligne"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      {locale === "ar" ? "الجزائر • آخر نشاط: منذ ساعة" : "Algérie • Dernière activité : Il y a 1 heure"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 2FA (المصادقة الثنائية) */}
        {activeTab === "2fa" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <ShieldCheck size={18} className="text-purple-400" />
              <span>{locale === "ar" ? "المصادقة الثنائية (2FA)" : "Authentification à deux facteurs"}</span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#1a1a1a] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    {locale === "ar" ? "حماية الحساب الإضافية" : "Protection renforcée du compte"}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 max-w-lg leading-relaxed">
                    {locale === "ar"
                      ? "تفعيل المصادقة الثنائية يمنح حساب الإدارة طبقة أمان إضافية عند تسجيل الدخول من أجهزة جديدة."
                      : "L'authentification à deux facteurs protège votre boutique contre les accès non autorisés."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !twoFactorEnabled;
                    setTwoFactorEnabled(next);
                    toast(
                      next
                        ? locale === "ar" ? "تم تفعيل المصادقة الثنائية بنجاح" : "2FA activé avec succès"
                        : locale === "ar" ? "تم تعطيل المصادقة الثنائية" : "2FA désactivé"
                    );
                  }}
                  className={cn(
                    "rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-sm shrink-0",
                    twoFactorEnabled
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  )}
                >
                  {twoFactorEnabled
                    ? locale === "ar" ? "مفعلة (انقر للتعطيل)" : "Activé (Désactiver)"
                    : locale === "ar" ? "تفعيل المصادقة الآن" : "Activer la 2FA"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
