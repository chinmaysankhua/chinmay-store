
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
    throw new Error("Firebase API key is missing from your .env file.");
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Authentication request failed."
    );
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem("chinmay-store-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("chinmay-store-user");
    }
  }, [user]);

  const register = useCallback(async ({ email, password, displayName }) => {
    const data = await firebaseAuthRequest("signUp", {
      email,
      password,
      returnSecureToken: true,
    });

    const updatedData = await firebaseAuthRequest("update", {
      idToken: data.idToken,
      displayName,
      returnSecureToken: true,
    });

    const newUser = {
      uid: updatedData.localId,
      email: updatedData.email,
      displayName: updatedData.displayName || displayName,
      idToken: updatedData.idToken,
      refreshToken: updatedData.refreshToken,
      expiresIn: updatedData.expiresIn,
    };

    setUser(newUser);
    return newUser;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await firebaseAuthRequest("signInWithPassword", {
      email,
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
