"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { isEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { LocaleLink } from "@/components/layout/language-switcher";
import { toast } from "@/components/ui/toast";

export function AccountView() {
  const { locale, dict } = useLocale();
  const ready = useAuthStore((s) => s.ready);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updateEmail = useAuthStore((s) => s.updateEmail);
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const orders = useCatalogStore((s) => s.orders);
  const refreshOrders = useCatalogStore((s) => s.refreshOrders);
  const router = useRouter();

  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (ready && user) void refreshOrders(false);
  }, [ready, user, refreshOrders]);

  const mine = useMemo(
    () => orders.filter((o) => o.userId === user?.id || o.email === user?.email),
    [orders, user],
  );

  if (!ready) return <p>{dict.common.loading}</p>;
  if (!user) {
    router.replace(`/${locale}/login`);
    return null;
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    updateProfile({ fullName: name, phone });
    toast(dict.account.saved);
  }

  async function onChangeEmail(e: FormEvent) {
    e.preventDefault();
    setEmailError("");
    if (!isEmail(newEmail)) {
      setEmailError(dict.checkout.errors.email);
      return;
    }
    setEmailLoading(true);
    const err = await updateEmail(newEmail);
    setEmailLoading(false);
    if (err === "no-supabase") {
      setEmailError(dict.account.noSupabase);
      return;
    }
    if (err) {
      setEmailError(err);
      return;
    }
    setNewEmail("");
    toast(dict.account.emailSent);
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError(dict.auth.weak);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(dict.auth.mismatch);
      return;
    }
    setPasswordLoading(true);
    const err = await updatePassword(currentPassword, newPassword);
    setPasswordLoading(false);
    if (err === "no-supabase") {
      setPasswordError(dict.account.noSupabase);
      return;
    }
    if (err === "wrong-password") {
      setPasswordError(dict.account.wrongPassword);
      return;
    }
    if (err) {
      setPasswordError(err);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast(dict.account.passwordChanged);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* ── عمود يسار: الملف الشخصي + الأمان ── */}
      <div className="space-y-12">
        {/* الملف الشخصي */}
        <div>
          <h1 className="font-serif text-4xl">{dict.account.title}</h1>
          <p className="mt-2 text-sm text-muted">{user.email}</p>
          {user.role === "admin" ? (
            <LocaleLink href="/admin" className="mt-4 inline-block text-sm uppercase tracking-widest underline">
              {dict.nav.admin}
            </LocaleLink>
          ) : null}
          <form onSubmit={onSave} className="mt-8 space-y-4">
            <Field label={dict.checkout.name}>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label={dict.checkout.phone}>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Button type="submit">{dict.account.save}</Button>
          </form>
          <button
            type="button"
            className="mt-8 text-xs uppercase tracking-widest text-muted"
            onClick={() => {
              logout();
              router.push(`/${locale}`);
            }}
          >
            {dict.auth.logout}
          </button>
        </div>

        {/* قسم الأمان */}
        <div>
          <h2 className="font-serif text-2xl">{dict.account.security}</h2>

          {/* تغيير الإيميل */}
          <form onSubmit={onChangeEmail} className="mt-6 space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-widest">{dict.account.changeEmail}</h3>
            <Field label={dict.account.newEmail}>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={user.email}
              />
            </Field>
            {emailError ? <p className="text-sm text-red-800">{emailError}</p> : null}
            <Button type="submit" disabled={emailLoading}>
              {emailLoading ? dict.common.loading : dict.account.changeEmailBtn}
            </Button>
          </form>

          {/* تغيير كلمة المرور */}
          <form onSubmit={onChangePassword} className="mt-8 space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-widest">{dict.account.changePassword}</h3>
            <Field label={dict.account.currentPassword}>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
            <Field label={dict.account.newPassword}>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
            <Field label={dict.auth.confirm}>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
            {passwordError ? <p className="text-sm text-red-800">{passwordError}</p> : null}
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? dict.common.loading : dict.account.changePasswordBtn}
            </Button>
          </form>
        </div>
      </div>

      {/* ── عمود يمين: الطلبات ── */}
      <div>
        <h2 className="font-serif text-2xl">{dict.account.orders}</h2>
        {mine.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{dict.account.noOrders}</p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {mine.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-4 text-sm">
                <div>
                  <p className="font-medium">{o.reference}</p>
                  <p className="text-muted">
                    {new Date(o.createdAt).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ")} ·{" "}
                    {dict.status[o.status]}
                  </p>
                </div>
                <p>{formatPrice(o.total, locale)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

