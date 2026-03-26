const IDENTITY_FLASH_KEY = "heraldcup.identity.flash";
const IDENTITY_FLASH_EVENT = "heraldcup:identity-flash";

export function writeIdentityFlashMessage(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextMessage = message.trim();
  if (!nextMessage) {
    return;
  }

  window.sessionStorage.setItem(IDENTITY_FLASH_KEY, nextMessage);
  window.dispatchEvent(new CustomEvent(IDENTITY_FLASH_EVENT));
}

export function readIdentityFlashMessage() {
  if (typeof window === "undefined") {
    return "";
  }

  const message = window.sessionStorage.getItem(IDENTITY_FLASH_KEY) ?? "";
  if (message) {
    window.sessionStorage.removeItem(IDENTITY_FLASH_KEY);
  }

  return message;
}

export function getIdentityFlashEventName() {
  return IDENTITY_FLASH_EVENT;
}