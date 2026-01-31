import React from "react";

function formatCurrency(value) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(value);
  } catch (_error) {
    return `$${Number(value).toFixed(2)}`;
  }
}

export default function Summary({ balance, totalIncome, totalExpense }) {
  return (
    <div className="summary">
      <div className="summary-card">
        <div className="summary-label">Balance</div>
        <div className="summary-value">{formatCurrency(balance)}</div>
      </div>
      <div className="summary-card income">
        <div className="summary-label">Income</div>
        <div className="summary-value">{formatCurrency(totalIncome)}</div>
      </div>
      <div className="summary-card expense">
        <div className="summary-label">Expense</div>
        <div className="summary-value">{formatCurrency(totalExpense)}</div>
      </div>
    </div>
  );
}
