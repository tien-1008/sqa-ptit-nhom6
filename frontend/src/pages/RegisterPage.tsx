import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await register(name, email, password);
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Dang ky that bai.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-panel">
      <div className="section-copy">
        <p className="eyebrow">Registration</p>
        <h1>Tao tai khoan moi</h1>
        <p>Password can toi thieu 8 ky tu, co chu hoa, chu thuong va chu so.</p>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <label>
          Ho ten
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
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
          <UserRoundPlus size={18} />
          {submitting ? "Dang xu ly..." : "Dang ky"}
        </button>
        <p className="inline-note">
          Da co tai khoan? <Link to="/login">Dang nhap</Link>
        </p>
      </form>
    </section>
  );
}
