import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FiltersPage from "./pages/FiltersPage";
import ChartsPage from "./pages/ChartsPage";
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import RegisterPage from "./pages/RegisterPage"; // Import RegisterPage
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider and useAuth

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Create a new component for the main app content that will be protected
function AppContent() {
  const { user, logoutUser } = useAuth(); // Consolidate useAuth call

  const [transactions, setTransactions] = useState(() => {
    if (!user) return []; // If no user, return empty array
    try {
      const stored = localStorage.getItem(`transactions_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (_error) {
      return [];
    }
  });
  const [editing, setEditing] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (_e) {}
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }
    return "dark";
  });
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: "all",
    category: "all",
    search: "",
  });

  // theme initializes from localStorage or system preference above

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `transactions_${user.id}`,
        JSON.stringify(transactions)
      );
    } else {
      // If user logs out, clear their data from state and localStorage
      localStorage.removeItem(`transactions_${user.id}`);
    }
  }, [transactions, user]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.type !== "all") {
        if (filters.type === "income" && tx.amount < 0) return false;
        if (filters.type === "expense" && tx.amount >= 0) return false;
      }
      if (filters.category !== "all" && tx.category !== filters.category)
        return false;
      if (filters.dateFrom && new Date(tx.date) < new Date(filters.dateFrom))
        return false;
      if (filters.dateTo && new Date(tx.date) > new Date(filters.dateTo))
        return false;
      if (
        filters.search &&
        !tx.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [transactions, filters]);

  const { balance, totalIncome, totalExpense } = useMemo(() => {
    const totals = filteredTransactions.reduce(
      (acc, tx) => {
        if (tx.amount >= 0) acc.income += tx.amount;
        else acc.expense += Math.abs(tx.amount);
        acc.balance += tx.amount;
        return acc;
      },
      { balance: 0, income: 0, expense: 0 }
    );
    return {
      balance: totals.balance,
      totalIncome: totals.income,
      totalExpense: totals.expense,
    };
  }, [filteredTransactions]);

  function handleAdd(newTx) {
    setTransactions((prev) =>
      [...prev, { ...newTx, id: generateId() }].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
  }

  function handleStartEdit(tx) {
    setEditing(tx);
  }

  function handleUpdate(updatedFields) {
    setTransactions((prev) =>
      prev
        .map((tx) => (tx.id === editing.id ? { ...tx, ...updatedFields } : tx))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    setEditing(null);
  }

  function handleCancelEdit() {
    setEditing(null);
  }

  function handleDelete(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="container">
      <div className="header-row">
        <div>
          <h1>Expense Tracker</h1>
          <div className="muted">
            Add, edit, and track your income and expenses.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user && (
            <button
              className="btn"
              onClick={logoutUser}
              style={{ marginLeft: "auto" }}
            >
              Logout
            </button>
          )}
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      <nav className="nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/filters"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Filters
        </NavLink>
        <NavLink
          to="/charts"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Charts
        </NavLink>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              totals={{ balance, totalIncome, totalExpense }}
              transactions={filteredTransactions}
              editing={editing}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onCancelEdit={handleCancelEdit}
              onStartEdit={handleStartEdit}
              onDelete={handleDelete}
            />
          }
        />
        <Route
          path="/filters"
          element={
            <FiltersPage
              filters={filters}
              onChangeFilters={setFilters}
              filteredTransactions={filteredTransactions}
              totals={{ balance, totalIncome, totalExpense }}
            />
          }
        />
        <Route
          path="/charts"
          element={<ChartsPage transactions={filteredTransactions} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
