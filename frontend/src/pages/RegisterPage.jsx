import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Brand from "../components/Brand.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { replace: true, state: { registered: true } });
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
          <p className="eyebrow">BẮT ĐẦU NGAY</p>
          <h1>Tạo tài khoản</h1>
          <p>Điền thông tin bên dưới để tạo tài khoản quản lý.</p>
        </div>
        <Alert>{error}</Alert>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tên người dùng</span>
            <input
              autoComplete="username"
              name="username"
              placeholder="Ví dụ: nguyenvana"
              value={form.username}
              onChange={updateField}
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              type="email"
              name="email"
              placeholder="ban@vidu.com"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Mật khẩu</span>
              <input
                autoComplete="new-password"
                type="password"
                name="password"
                minLength={8}
                placeholder="Tối thiểu 8 ký tự"
                value={form.password}
                onChange={updateField}
                required
              />
            </label>
            <label className="field">
              <span>Xác nhận mật khẩu</span>
              <input
                autoComplete="new-password"
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={updateField}
                required
              />
            </label>
          </div>
          <button className="button button-primary button-full" type="submit" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </section>
      <p className="auth-footnote">Student Management <span>·</span> Nền tảng quản lý người dùng</p>
    </main>
  );
}
