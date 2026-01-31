import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, registerUser } = useAuth();
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const result = await registerUser(email, password);
    if (result.success) {
      setMessage("Registration successful! You can now log in.");
    } else {
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
          Register
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
              Register
            </button>
          </div>
        </form>
        {message && (
          <p
            style={{
              color: message.includes("successful")
                ? "var(--income)"
                : "var(--expense)",
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--primary)", textDecoration: "none" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
