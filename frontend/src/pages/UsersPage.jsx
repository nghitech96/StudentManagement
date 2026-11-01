import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/http.js";
import Alert from "../components/Alert.jsx";
import PageHeading from "../components/PageHeading.jsx";

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.users()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          window.localStorage.removeItem("student-management-user");
          navigate("/login", { replace: true });
          return;
        }
        setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [navigate]);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      `${user.username} ${user.email} ${user.id}`.toLowerCase().includes(query),
    );
  }, [search, users]);

  return (
    <>
      <PageHeading
        eyebrow="DANH BẠ"
        title="Quản lý người dùng"
        description="Theo dõi các tài khoản đã đăng ký trong hệ thống."
        action={<span className="count-pill">{users.length} tài khoản</span>}
      />
      <section className="panel">
        <div className="panel-toolbar">
          <div>
            <h2>Danh sách tài khoản</h2>
            <p>Thông tin được tải trực tiếp từ cơ sở dữ liệu.</p>
          </div>
          <label className="search-field">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              aria-label="Tìm người dùng"
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        <Alert>{error}</Alert>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>NGƯỜI DÙNG</th><th>EMAIL</th><th>MÃ TÀI KHOẢN</th><th>TRẠNG THÁI</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="table-message" colSpan="4">Đang tải danh sách...</td></tr>
              ) : visibleUsers.length ? visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="table-user">
                      <span className="table-avatar">{user.username?.charAt(0)?.toUpperCase() || "U"}</span>
                      <strong>{user.username}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td><code>{user.id}</code></td>
                  <td><span className="status-pill"><span />Đang hoạt động</span></td>
                </tr>
              )) : (
                <tr><td className="table-message" colSpan="4">
                  {search ? "Không tìm thấy người dùng phù hợp." : "Chưa có tài khoản nào được đăng ký."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          Hiển thị <strong>{visibleUsers.length}</strong> trên <strong>{users.length}</strong> tài khoản
        </div>
      </section>
    </>
  );
}
