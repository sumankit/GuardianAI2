import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { AuthProvider } from "./context/AuthContext";
import LenisScroll from "./components/LenisScroll";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <LenisScroll />
      <ScrollToTop />
      <Navbar />
      <AppRoutes />
      <Footer />
    </AuthProvider>
  );
}
