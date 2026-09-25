"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isEmail } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { LocaleLink } from "@/components/layout/language-switcher";

export function LoginForm() {
  const { locale, dict } = useLocale();
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError(dict.checkout.errors.email);
      return;
    }
    const err = await login(email, password);
    if (err) {
      setError(dict.auth.error);
      return;
    }
    const user = useAuthStore.getState().user;
    router.push(user?.role === "admin" ? `/${locale}/admin` : `/${locale}/account`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5">
      <h1 className="font-serif text-4xl">{dict.auth.loginTitle}</h1>
      <Field label={dict.checkout.email}>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label={dict.auth.password}>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <Button type="submit" className="w-full">
        {dict.auth.submitLogin}
      </Button>
      <p className="text-sm text-muted">
        {dict.auth.noAccount}{" "}
        <LocaleLink href="/register" className="underline">
          {dict.auth.submitRegister}
        </LocaleLink>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const { locale, dict } = useLocale();
  const register = useAuthStore((s) => s.register);
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setError(dict.checkout.errors.name);
      return;
    }
    if (!isEmail(email)) {
      setError(dict.checkout.errors.email);
      return;
    }
    if (password.length < 8) {
      setError(dict.auth.weak);
      return;
    }
    if (password !== confirm) {
      setError(dict.auth.mismatch);
      return;
    }
    const err = await register({ email, password, fullName });
    if (err === "exists") {
      setError(dict.auth.exists);
      return;
    }
    router.push(`/${locale}/account`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5">
      <h1 className="font-serif text-4xl">{dict.auth.registerTitle}</h1>
      <Field label={dict.checkout.name}>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </Field>
      <Field label={dict.checkout.email}>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label={dict.auth.password}>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <Field label={dict.auth.confirm}>
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </Field>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <Button type="submit" className="w-full">
        {dict.auth.submitRegister}
      </Button>
      <p className="text-sm text-muted">
        {dict.auth.hasAccount}{" "}
        <LocaleLink href="/login" className="underline">
          {dict.auth.submitLogin}
        </LocaleLink>
      </p>
    </form>
  );
}
