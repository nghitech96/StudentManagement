import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Brand from "../components/Brand.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/users", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <section className="auth-card">
        <Brand />
        <div className="auth-intro">
          <p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p>
          <h1>Đăng nhập</h1>
          <p>Đăng nhập để tiếp tục quản lý thông tin người dùng.</p>
        </div>
        {location.state?.registered && (
          <Alert type="success">Tài khoản đã được tạo. Hãy đăng nhập để tiếp tục.</Alert>
        )}
        <Alert>{error}</Alert>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              type="email"
              name="email"
              placeholder="ban@vidu.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Mật khẩu</span>
            <input
              autoComplete="current-password"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button className="button button-primary button-full" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="auth-switch">Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link></p>
      </section>
      <p className="auth-footnote">Student Management <span>·</span> Nền tảng quản lý người dùng</p>
    </main>
  );
}
