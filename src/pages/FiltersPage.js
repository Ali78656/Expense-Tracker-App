import React from "react";
import Filters from "../components/Filters";
import TransactionList from "../components/TransactionList";
import Summary from "../components/Summary";

export default function FiltersPage({
  filters,
  onChangeFilters,
  filteredTransactions,
  totals,
}) {
  return (
    <>
      <div className="title-bar" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: "var(--text)" }}>Filters</h2>
        <span className="title-pill">Refine results</span>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="section-title">Filters</div>
        <Filters filters={filters} onChange={onChangeFilters} />
      </div>
      <Summary
        balance={totals.balance}
        totalIncome={totals.totalIncome}
        totalExpense={totals.totalExpense}
      />
      <div className="panel">
        <div className="section-title">Filtered transactions</div>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </>
  );
}
