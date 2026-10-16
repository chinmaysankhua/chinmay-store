import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts";
const STORAGE_KEY = "chinmay-store-user";

function readSavedUser() {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function createUserSession(user, expiresIn) {
  return {
    ...user,
    expiresIn,
    tokenExpiresAt: Date.now() + Number(expiresIn) * 1000,
  };
}

async function firebaseAuthRequest(endpoint, payload) {
  if (!API_KEY) {
    throw new Error("Firebase API key is missing. Check your .env file.");
  }

  const response = await fetch(`${AUTH_URL}:${endpoint}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      result?.error?.message || "Authentication failed.";

    throw new Error(errorMessage);
  }

  return result;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  // Persist the current session.
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Unable to save authentication state:", error);
    }
  }, [user]);

  // Synchronize React state when tokenManager refreshes a token.
  useEffect(() => {
    const handleAuthUpdate = (event) => {
      setUser(event.detail ?? null);
    };

    window.addEventListener("chinmay-auth-updated", handleAuthUpdate);

    return () => {
      window.removeEventListener(
        "chinmay-auth-updated",
        handleAuthUpdate,
      );
    };
  }, []);

  const register = useCallback(
    async ({ email, password, displayName }) => {
      const data = await firebaseAuthRequest("signUp", {
        email: email.trim(),
        password,
        returnSecureToken: true,
      });

      const updatedData = await firebaseAuthRequest("update", {
        idToken: data.idToken,
        displayName: displayName.trim(),
        returnSecureToken: true,
      });

      const idToken = updatedData.idToken || data.idToken;
      const refreshToken = updatedData.refreshToken || data.refreshToken;
      const expiresIn = updatedData.expiresIn || data.expiresIn;

      const newUser = createUserSession(
        {
          uid: updatedData.localId || data.localId,
          email: updatedData.email || data.email,
          displayName: updatedData.displayName || displayName.trim(),
          idToken,
          refreshToken,
        },
        expiresIn,
      );

      setUser(newUser);
      return newUser;
    },
    [],
  );

  const login = useCallback(async ({ email, password }) => {
    const data = await firebaseAuthRequest("signInWithPassword", {
      email: email.trim(),
      password,
      returnSecureToken: true,
    });

    const loggedInUser = createUserSession(
      {
        uid: data.localId,
        email: data.email,
        displayName: data.displayName || "",
        idToken: data.idToken,
        refreshToken: data.refreshToken,
      },
      data.expiresIn,
    );

    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user?.idToken),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}