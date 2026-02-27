const AUTH_KEY = "pomoCube_authenticated";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function login(password: string): boolean {
  const correctPassword = process.env.NEXT_PUBLIC_ACCESS_PASSWORD;
  if (password === correctPassword) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_KEY);
}
