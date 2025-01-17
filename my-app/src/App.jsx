import React, { useState } from "react";
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

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSecondModalOpen] = useState(false);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const openIssueModal = () => {
    setIsSecondModalOpen();
  }

  const openSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  return (
    <div className="app">
      {/* 데이터 테이블 */}
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
            <tr
              key={index}
              onClick={() => openModal(item)}
              className="clickable"
            >
              {headers.map((header) => (
                <td key={header.value}>{item[header.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 그래프 테이블 */}
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

      {/* 모달 */}
      {isModalOpen && selectedProject && (
      <div className="modal">
        <div className="modal-content">
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>
          <div className = "modal-header">
            <h2>프로젝트 정보</h2>
            <button className="add-button" onClick={openIssueModal}>
              + 
            </button>
          </div>
          <ul>
          {Object.entries(selectedProject)
            .filter(([key]) => ["name", "manager", "startDate"].includes(key)) // 특정 key만 필터링
            .map(([key, value]) => {
            // headers에서 key에 해당하는 text를 찾음
            const headerText = headers.find((header) => header.value === key)?.text || key;
              return (
                <li key={key}>
                  <strong>{headerText}:</strong> {value}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    )}

    {/*이슈 등록모달*/}
    {openSecondModal(
      <div className="modal">
        <div className="modal-content">
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>
          <div className = "modal-header">
            <h2>이슈등록</h2>
          </div>
          <ul>
          {Object.entries(selectedProject)
            .filter(([key]) => ["name", "manager", "startDate"].includes(key)) // 특정 key만 필터링
            .map(([key, value]) => {
            // headers에서 key에 해당하는 text를 찾음
            const headerText = headers.find((header) => header.value === key)?.text || key;
              return (
                  "이슈등록 모달"
              );
            })}
          </ul>
        </div>
      </div>
    )}
    </div>
  );
}

export default App;