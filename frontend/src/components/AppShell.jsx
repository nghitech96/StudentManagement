import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "./Brand.jsx";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    if (!user) return;
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          <NavLink to="/users" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <span className="nav-icon" aria-hidden="true">◫</span>
            <span>Quản lý người dùng</span>
          </NavLink>
          <NavLink to="/test" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <span className="nav-icon" aria-hidden="true">⌁</span>
            <span>Kiểm tra hệ thống</span>
          </NavLink>
          <NavLink to="/home-loan" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <span className="nav-icon" aria-hidden="true">⌂</span>
            <span>Form vay mua nhà</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-dot" />
            <div><strong>Hệ thống hoạt động</strong><small>Spring Boot · Local</small></div>
          </div>
          {user && (
            <button className="nav-item logout-button" type="button" onClick={handleLogout}>
              <span className="nav-icon" aria-hidden="true">↪</span>
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">Student Management <span>/</span> <strong>Workspace</strong></div>
          <div className="profile">
            <div className="profile-avatar">{user?.username?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className="profile-details">
              <strong>{user?.username || "API Playground"}</strong>
              <span>{user?.email || "Public demo"}</span>
            </div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
