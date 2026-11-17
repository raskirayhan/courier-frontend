import { User } from "./types";

export function decodeUserFromToken(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parsed.id,
      name: parsed.name || "User",
      email: parsed.email,
      role: parsed.role,
      status: "ACTIVE",
      emailVerified: true,
    };
  } catch (e) {
    console.error("Token decode error:", e);
    return null;
  }
}
