import React from "react";
import Charts from "../components/Charts";

export default function ChartsPage({ transactions }) {
  return (
    <>
      <div className="title-bar" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: "var(--text)" }}>Charts</h2>
        <span className="title-pill">Insights</span>
      </div>
      <div>
        <Charts transactions={transactions} />
      </div>
    </>
  );
}
