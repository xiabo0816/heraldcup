import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function withQuery(
  path: string,
  params: Record<string, string | undefined>
) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const searchString = search.toString();
  return searchString ? `${path}?${searchString}` : path;
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}