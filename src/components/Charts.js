import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function monthKey(dateString) {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(key) {
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default function Charts({ transactions }) {
  const {
    labels,
    incomeSeries,
    expenseSeries,
    categoryLabels,
    categorySeries,
  } = useMemo(() => {
    const byMonth = new Map();
    const byCategoryExpense = new Map();

    for (const tx of transactions) {
      const key = monthKey(tx.date);
      if (!byMonth.has(key)) byMonth.set(key, { income: 0, expense: 0 });
      const bucket = byMonth.get(key);
      if (tx.amount >= 0) bucket.income += tx.amount;
      else bucket.expense += Math.abs(tx.amount);

      if (tx.amount < 0) {
        const cur = byCategoryExpense.get(tx.category) || 0;
        byCategoryExpense.set(tx.category, cur + Math.abs(tx.amount));
      }
    }

    const sortedKeys = Array.from(byMonth.keys()).sort();
    const labels = sortedKeys.map(formatMonthLabel);
    const incomeSeries = sortedKeys.map((k) => byMonth.get(k).income);
    const expenseSeries = sortedKeys.map((k) => byMonth.get(k).expense);

    const categoryLabels = Array.from(byCategoryExpense.keys());
    const categorySeries = categoryLabels.map((c) => byCategoryExpense.get(c));

    return {
      labels,
      incomeSeries,
      expenseSeries,
      categoryLabels,
      categorySeries,
    };
  }, [transactions]);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeSeries,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        tension: 0.35,
        fill: true,
      },
      {
        label: "Expense",
        data: expenseSeries,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Expenses by category",
        data: categorySeries,
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#f472b6",
          "#fbbf24",
          "#a78bfa",
          "#f87171",
          "#4ade80",
          "#22d3ee",
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: "top", labels: { color: "#e5e7eb" } } },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  const doughnutOptions = {
    plugins: { legend: { position: "right", labels: { color: "#e5e7eb" } } },
  };

  return (
    <div className="charts-grid">
      <div className="panel">
        <div className="section-title">Monthly income vs expense</div>
        {labels.length ? (
          <Line data={lineData} options={lineOptions} />
        ) : (
          <div className="tx-empty">No data yet.</div>
        )}
      </div>
      <div className="panel">
        <div className="section-title">Expenses by category</div>
        {doughnutData.labels.length && doughnutData.datasets[0].data.length ? (
          <Doughnut data={doughnutData} options={doughnutOptions} />
        ) : (
          <div className="tx-empty">No expenses yet.</div>
        )}
      </div>
    </div>
  );
}
