
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

function readSavedUser() {
  try {
    const savedUser = localStorage.getItem("chinmay-store-user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

async function firebaseAuthRequest(endpoint, payload) {
  if (!API_KEY) {
    throw new Error("Firebase API key is missing. Check your .env file.");
  }

  const response = await fetch(
    `${AUTH_URL}:${endpoint}?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      result?.error?.message || "Authentication failed.";

    console.error(`Firebase ${endpoint} error:`, errorMessage);

    throw new Error(errorMessage);
  }

  return result;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("chinmay-store-user", JSON.stringify(user));
      } else {
        localStorage.removeItem("chinmay-store-user");
      }
    } catch (error) {
      console.error("Unable to save authentication state:", error);
    }
  }, [user]);

  const register = useCallback(
    async ({ email, password, displayName }) => {
      // Step 1: Create the Firebase Authentication account.
      const data = await firebaseAuthRequest("signUp", {
        email: email.trim(),
        password,
        returnSecureToken: true,
      });

      // Step 2: Update the user's display name.
      let updatedData;

      try {
        updatedData = await firebaseAuthRequest("update", {
          idToken: data.idToken,
          displayName: displayName.trim(),
          returnSecureToken: true,
        });
      } catch (error) {
        // The account may already exist even if updating its
        // display name fails. Do not silently hide the error.
        console.error(
          "Account created, but display-name update failed:",
          error.message
        );
        throw error;
      }

      const newUser = {
        uid: updatedData.localId || data.localId,
        email: updatedData.email || data.email,
        displayName: updatedData.displayName || displayName.trim(),
        idToken: updatedData.idToken || data.idToken,
        refreshToken: updatedData.refreshToken || data.refreshToken,
        expiresIn: updatedData.expiresIn || data.expiresIn,
      };

      setUser(newUser);
      return newUser;
    },
    []
  );

  const login = useCallback(async ({ email, password }) => {
    const data = await firebaseAuthRequest("signInWithPassword", {
      email: email.trim(),
      password,
      returnSecureToken: true,
    });

    const loggedInUser = {
      uid: data.localId,
      email: data.email,
      displayName: data.displayName || "",
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    };

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
