import React from "react";
import Summary from "../components/Summary";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Dashboard({
  totals,
  transactions,
  editing,
  onAdd,
  onUpdate,
  onCancelEdit,
  onStartEdit,
  onDelete,
}) {
  return (
    <>
      <div className="title-bar" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: "var(--text)" }}>Overview</h2>
        <span className="title-pill">This month</span>
      </div>
      <Summary
        balance={totals.balance}
        totalIncome={totals.totalIncome}
        totalExpense={totals.totalExpense}
      />
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="section-title">
          {editing ? "Edit transaction" : "Add transaction"}
        </div>
        <TransactionForm
          onSubmit={editing ? onUpdate : onAdd}
          onCancel={onCancelEdit}
          initialValue={editing}
        />
      </div>
      <div className="panel">
        <div className="section-title">Transaction history</div>
        <TransactionList
          transactions={transactions}
          onEdit={onStartEdit}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}
