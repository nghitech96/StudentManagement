import { useState } from "react";
import { api } from "../api/http.js";
import Alert from "../components/Alert.jsx";
import PageHeading from "../components/PageHeading.jsx";

export default function TestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runHealthCheck() {
    setLoading(true);
    setResult(null);
    try {
      setResult({ ok: true, body: await api.health() });
    } catch (error) {
      setResult({ ok: false, message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="DEVELOPER TOOLS"
        title="Kiểm tra hệ thống"
        description="Kiểm tra kết nối giữa giao diện React và dịch vụ Spring Boot."
      />
      <section className="panel test-panel">
        <div className="test-icon" aria-hidden="true">⌁</div>
        <div className="test-copy">
          <h2>Backend API health check</h2>
          <p>Gửi GET request tới <code>/api/health</code> thông qua proxy local.</p>
          <div className="endpoint-line"><span className="method-chip">GET</span><code>/api/health</code></div>
        </div>
        <button className="button button-primary" type="button" onClick={runHealthCheck} disabled={loading}>
          {loading ? "Đang kiểm tra..." : "Chạy kiểm tra"}
        </button>
        {result && (
          <div className="test-result">
            <Alert type={result.ok ? "success" : "error"}>
              {result.ok ? "Kết nối backend thành công." : `Không thể kết nối backend: ${result.message}`}
            </Alert>
            {result.ok && <pre>{JSON.stringify(result.body, null, 2)}</pre>}
          </div>
        )}
      </section>
      <section className="test-info-grid">
        <article className="info-card">
          <span className="info-label">FRONTEND</span>
          <strong>React + Vite</strong>
          <small>http://localhost:5173</small>
        </article>
        <article className="info-card">
          <span className="info-label">BACKEND</span>
          <strong>Spring Boot</strong>
          <small>http://localhost:8082</small>
        </article>
        <article className="info-card">
          <span className="info-label">DATABASE</span>
          <strong>H2 · Local</strong>
          <small>In-memory database</small>
        </article>
      </section>
    </>
  );
}
