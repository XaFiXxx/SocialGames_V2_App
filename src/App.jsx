import { Routes, Route, Navigate } from "react-router";
import ScrollToTop from "./components/ScroolToTop";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import LoginPage from "./pages/connections/Login";
import RegisterPage from "./pages/connections/Register";
import FeedPage from "./pages/Feed";
import ProfilePage from "./pages/profile/profile";
import EditProfilePage from "./pages/profile/Edit";
import MessagesPage from "./pages/messages/Index";
import EmailVerifiedPage from "./pages/mails/EmailVerifiedPage";
import VerifyEmailPage from "./pages/mails/VerifyEmailPage";

import PublicProfile from "./pages/profile/public/PublicProfile";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)]">
        Chargement...
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/feed" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/feed" replace /> : <AuthLayout />
          }
        >
          <Route index element={<LoginPage />} />
        </Route>

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/feed" replace /> : <AuthLayout />
          }
        >
          <Route index element={<RegisterPage />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />

        <Route
          element={
            isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/users/:id" element={<PublicProfile />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}