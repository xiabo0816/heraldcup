"use client";

import { useState, useTransition } from "react";
import { useAsyncFeedbackAction } from "@/hooks/use-async-feedback-action";
import { useIdentityClient } from "@/hooks/use-identity-client";
import type { IdentityFieldErrors } from "@/lib/identity-client-types";
import { loginIdentitySessionSchema, registerIdentityAccountSchema } from "@/lib/validators";

function mapFieldErrors(issues: Array<{ path: PropertyKey[]; message: string }>): IdentityFieldErrors {
  const nextErrors: IdentityFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in nextErrors)) {
      nextErrors[field as keyof IdentityFieldErrors] = issue.message;
    }
  }

  return nextErrors;
}

export function useIdentityAccountForms() {
  const identityClient = useIdentityClient();
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState<IdentityFieldErrors>({});
  const [loginErrors, setLoginErrors] = useState<IdentityFieldErrors>({});
  const registerAction = useAsyncFeedbackAction();
  const loginAction = useAsyncFeedbackAction();
  const [isSignOutPending, startSignOutTransition] = useTransition();

  function updateRegisterField(field: "name" | "email" | "password", value: string) {
    if (field === "name") {
      setRegisterName(value);
    }

    if (field === "email") {
      setRegisterEmail(value);
    }

    if (field === "password") {
      setRegisterPassword(value);
    }

    setRegisterErrors((current) => ({ ...current, [field]: undefined }));
    if (registerAction.tone === "error") {
      registerAction.clearMessage();
    }
  }

  function updateLoginField(field: "email" | "password", value: string) {
    if (field === "email") {
      setLoginEmail(value);
    }

    if (field === "password") {
      setLoginPassword(value);
    }

    setLoginErrors((current) => ({ ...current, [field]: undefined }));
    if (loginAction.tone === "error") {
      loginAction.clearMessage();
    }
  }

  function submitRegister() {
    const validation = registerIdentityAccountSchema.safeParse({
      name: registerName,
      email: registerEmail,
      password: registerPassword
    });

    if (!validation.success) {
      setRegisterErrors(mapFieldErrors(validation.error.issues));
      registerAction.clearMessage();
      return;
    }

    setRegisterErrors({});
    registerAction.run(async () => {
      return identityClient.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword
      });
    });
  }

  function submitLogin() {
    const validation = loginIdentitySessionSchema.safeParse({
      email: loginEmail,
      password: loginPassword
    });

    if (!validation.success) {
      setLoginErrors(mapFieldErrors(validation.error.issues));
      loginAction.clearMessage();
      return;
    }

    setLoginErrors({});
    loginAction.run(async () => {
      return identityClient.login({
        email: loginEmail,
        password: loginPassword
      });
    });
  }

  function submitLogout() {
    startSignOutTransition(async () => {
      await identityClient.logout();
    });
  }

  return {
    registerName,
    setRegisterName: (value: string) => updateRegisterField("name", value),
    registerEmail,
    setRegisterEmail: (value: string) => updateRegisterField("email", value),
    registerPassword,
    setRegisterPassword: (value: string) => updateRegisterField("password", value),
    loginEmail,
    setLoginEmail: (value: string) => updateLoginField("email", value),
    loginPassword,
    setLoginPassword: (value: string) => updateLoginField("password", value),
    registerErrors,
    loginErrors,
    registerMessage: registerAction.message,
    registerTone: registerAction.tone,
    loginMessage: loginAction.message,
    loginTone: loginAction.tone,
    isRegisterPending: registerAction.isPending,
    isLoginPending: loginAction.isPending,
    isSignOutPending,
    submitRegister,
    submitLogin,
    submitLogout
  };
}