import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomeLoanPage from "./pages/HomeLoanPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TestPage from "./pages/TestPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/users"
        element={
          <ProtectedPage>
            <UsersPage />
          </ProtectedPage>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedPage>
            <TestPage />
          </ProtectedPage>
        }
      />
      <Route
        path="/home-loan"
        element={
          <AppShell>
            <HomeLoanPage />
          </AppShell>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
