import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("User@123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Dang nhap that bai.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-panel">
      <div className="section-copy">
        <p className="eyebrow">Authentication</p>
        <h1>Dang nhap he thong</h1>
        <p>Su dung tai khoan seed de demo cac luong user va admin.</p>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
        </label>
        <label>
          Mat khau
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" disabled={submitting} type="submit">
          <LogIn size={18} />
          {submitting ? "Dang xu ly..." : "Dang nhap"}
        </button>
        <p className="inline-note">
          Chua co tai khoan? <Link to="/register">Dang ky</Link>
        </p>
      </form>
    </section>
  );
}
