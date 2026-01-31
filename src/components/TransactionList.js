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

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return <div className="tx-empty">No transactions yet. Add one above.</div>;
  }

  return (
    <ul className="tx-list">
      {transactions.map((tx) => (
        <li
          key={tx.id}
          className={`tx-item ${tx.amount >= 0 ? "income" : "expense"}`}
        >
          <div className="tx-main">
            <div className="tx-title">{tx.description}</div>
            <div className="tx-meta">
              <span className="tx-date">
                {new Date(tx.date).toLocaleDateString()}
              </span>
              <span className="tx-category">{tx.category}</span>
            </div>
          </div>
          <div className="tx-amount">{formatCurrency(tx.amount)}</div>
          <div className="tx-actions">
            <button
              className="icon-btn"
              aria-label="Edit"
              title="Edit"
              onClick={() => onEdit(tx)}
            >
              ✏️
            </button>
            <button
              className="icon-btn"
              aria-label="Delete"
              title="Delete"
              onClick={() => onDelete(tx.id)}
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
