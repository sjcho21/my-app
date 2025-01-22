import React from "react";

function GraphTable({ items, calculateMonths }) {
  return (
    <table className="graph-table">
      <thead>
        <tr>
          <th>프로젝트명</th>
          {Array.from({ length: 12 }).map((_, index) => (
            <th key={index}>{index + 1}월</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const { startMonth, endMonth } = calculateMonths(item.startDate, item.term);
          return (
            <tr key={index}>
              <td>{item.name}</td>
              {Array.from({ length: 12 }).map((_, monthIndex) => (
                <td
                  key={monthIndex}
                  className={monthIndex >= startMonth && monthIndex < endMonth ? "active" : ""}
                ></td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default GraphTable;