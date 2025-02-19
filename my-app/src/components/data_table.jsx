import React from "react";

function DataTable({ headers, items, onRowClick }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.text}>{header.text}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index} onClick={() => onRowClick(item)} className="clickable">
            {headers.map((header) => (
              <td key={header.value}>{item[header.value]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;