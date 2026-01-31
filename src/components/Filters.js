import React from "react";
import { CATEGORIES } from "../constants";

export default function Filters({ filters, onChange }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <form className="tx-form" onSubmit={(e) => e.preventDefault()}>
      <div className="row">
        <label>
          From
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
          />
        </label>
        <label>
          To
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
          />
        </label>
        <label>
          Type
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Category
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="all">All</option>
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
          Search
          <input
            type="text"
            name="search"
            placeholder="Search description..."
            value={filters.search}
            onChange={handleChange}
          />
        </label>
      </div>
    </form>
  );
}
