import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../constants";

const DEFAULT_FORM = {
  date: "",
  description: "",
  amount: "",
  type: "expense",
  category: "Food",
};

export default function TransactionForm({ onSubmit, onCancel, initialValue }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (initialValue) {
      setForm({
        date: initialValue.date || "",
        description: initialValue.description || "",
        amount: String(Math.abs(initialValue.amount ?? "")),
        type: initialValue.amount >= 0 ? "income" : "expense",
        category: initialValue.category || "Other",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [initialValue]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const parsedAmount = Number(form.amount);
    if (!form.description.trim() || !form.date || Number.isNaN(parsedAmount))
      return;
    const signedAmount =
      form.type === "income" ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);
    onSubmit({
      date: form.date,
      description: form.description.trim(),
      amount: signedAmount,
      category: form.category,
    });
    setForm(DEFAULT_FORM);
  }

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="row">
        <label>
          Date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="row">
        <label className="grow">
          Description
          <input
            type="text"
            name="description"
            placeholder="e.g., Grocery shopping"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="actions">
        <button type="submit" className="btn primary">
          {initialValue ? "Update" : "Add"}
        </button>
        {initialValue && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
