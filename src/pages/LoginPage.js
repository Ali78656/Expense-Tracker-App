import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, loginUser } = useAuth();
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const result = await loginUser(email, password);
    if (!result.success) {
      setMessage(result.message);
    }
  }

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="container"
      style={{ maxWidth: "400px", margin: "80px auto" }}
    >
      <div className="panel">
        <h2
          style={{
            color: "var(--text)",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Login
        </h2>
        <form className="tx-form" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div
            className="actions"
            style={{ justifyContent: "center", marginTop: "20px" }}
          >
            <button type="submit" className="btn primary">
              Login
            </button>
          </div>
        </form>
        {message && (
          <p
            style={{
              color: "var(--expense)",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}
        <p
          style={{
            color: "var(--muted)",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--primary)", textDecoration: "none" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
