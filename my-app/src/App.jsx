import React from "react";
import "./App.css"; // CSS 파일 import

function App() {
  const headers = [
    { text: "구분", value: "division" },
    { text: "프로젝트명", value: "name" },
    { text: "거래처", value: "client" },
    { text: "시작일", value: "startDate" },
    { text: "투입기간", value: "term" },
    { text: "진행률", value: "progress" },
    { text: "담당자", value: "manager" },
    { text: "이슈", value: "issue" },
  ];

  const items = [
    {
      division: "리서치",
      name: "프로젝트 A",
      client: "고객사 A",
      startDate: "2020.01.03",
      term: "90일",
      progress: "45%",
      manager: "박진형",
      issue: "11개",
    },
    {
      division: "리서치",
      name: "프로젝트 B",
      client: "고객사 B",
      startDate: "2023.08.03",
      term: "90일",
      progress: "35%",
      manager: "박진형",
      issue: "11개",
    },
    {
      division: "리서치",
      name: "프로젝트 C",
      client: "고객사 C",
      startDate: "2024.11.03",
      term: "90일",
      progress: "15%",
      manager: "박진형",
      issue: "11개",
    },
  ];

  const calculateActiveMonths = (startDate, term) => {
    const startMonth = new Date(startDate).getMonth(); // 시작 월 (0~11)
    const termInMonths = Math.ceil(parseInt(term) / 30); // 투입 기간을 월 단위로 변환
    const endMonth = Math.min(startMonth + termInMonths, 12); // 종료 월 (최대 12)
    return { startMonth, endMonth };
  };

  return (
    <div className="app">
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
            <tr key={index}>
              {headers.map((header) => (
                <td key={header.value}>{item[header.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
            const { startMonth, endMonth } = calculateActiveMonths(
              item.startDate,
              item.term
            );
            return (
              <tr key={index}>
                <td>{item.name}</td>
                {Array.from({ length: 12 }).map((_, monthIndex) => (
                  <td
                    key={monthIndex}
                    className={
                      monthIndex >= startMonth && monthIndex < endMonth
                        ? "active"
                        : ""
                    }
                  ></td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;