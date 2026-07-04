import { createContext, useContext } from "react";
import { useUser, useAuth, useClerk } from "@clerk/clerk-react";

// AuthContext wraps Clerk's hooks so the rest of the app
// only imports from one place and stays decoupled from Clerk.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { signOut, openSignIn, openSignUp } = useClerk();

  const isLoaded = userLoaded && authLoaded;

  // Convenience: get a fresh JWT for API calls
  const getAuthToken = async () => {
    if (!isSignedIn) return null;
    return await getToken();
  };

  const value = {
    user,           // Clerk user object  (user.firstName, user.emailAddresses, etc.)
    isLoaded,       // true once Clerk has fetched session
    isSignedIn,     // boolean
    getAuthToken,   // async () => string | null
    signOut,        // () => void
    openSignIn,     // opens Clerk's sign-in modal
    openSignUp,     // opens Clerk's sign-up modal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook — use this everywhere instead of importing from Clerk directly
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
