const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const TOKEN_URL = "https://securetoken.googleapis.com/v1/token";
const STORAGE_KEY = "chinmay-store-user";
const REFRESH_BUFFER = 5 * 60 * 1000;

let refreshPromise = null;

function getSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

  window.dispatchEvent(
    new CustomEvent("chinmay-auth-updated", {
      detail: user,
    }),
  );
}

export async function getFreshIdToken() {
  const user = getSavedUser();

  if (!user?.idToken || !user?.refreshToken) {
    throw new Error("Please sign in again to continue.");
  }

  const expiresAt = Number(user.tokenExpiresAt || 0);

  if (expiresAt > Date.now() + REFRESH_BUFFER) {
    return user.idToken;
  }

  // Prevent multiple simultaneous refresh requests.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    if (!API_KEY) {
      throw new Error("Firebase API key is missing. Check your .env file.");
    }

    const response = await fetch(`${TOKEN_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.refreshToken,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorCode = result?.error?.message || "TOKEN_REFRESH_FAILED";

      if (
        [
          "INVALID_REFRESH_TOKEN",
          "USER_DISABLED",
          "USER_NOT_FOUND",
          "TOKEN_REVOKED",
        ].includes(errorCode)
      ) {
        localStorage.removeItem(STORAGE_KEY);

        window.dispatchEvent(
          new CustomEvent("chinmay-auth-updated", {
            detail: null,
          }),
        );

        throw new Error("Your session has expired. Please sign in again.");
      }

      throw new Error(`Could not refresh your session: ${errorCode}`);
    }

    const updatedUser = {
      ...user,
      uid: result.user_id || user.uid,
      idToken: result.id_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      tokenExpiresAt:
        Date.now() + Number(result.expires_in) * 1000,
    };

    saveUser(updatedUser);

    return updatedUser.idToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}