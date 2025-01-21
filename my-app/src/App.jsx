import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { workersState } from "./assets/project/atom";
import { headers } from "./assets/project/atom";
import IssueModal from "./assets/project/issue_modal";
import DataTable from "./assets/project/data_table.jsx";
import GraphTable from "./assets/project/graph_table.jsx";
import ProjectModal from "./assets/project/project_modal.jsx";
import { calculateActiveMonths } from "./assets/project/date_util.jsx";
import "./App.css";

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

  const [items, setItems] = useState([
    {
      division: "리서치",
      name: "프로젝트 A",
      client: "고객사 A",
      startDate: "2020.01.03",
      term: "90일",
      progress: "45%",
      manager: "박진형",
      issue: "2개",
      issues: [
        { id: 1, title: "UI 개선 필요1", status: "진행 중", description: "UI를 좀 더 깔끔하게 개선해야 합니다." },
        { id: 2, title: "UI 개선 필요2", status: "완료", description: "API 응답 속도를 개선 완료하였습니다." },
      ],
    },
  ]);

  const workers = ["홍길동", "김철수", "이영희", "박진형"]; // 작업자 명단

  const processedItems = items.map((item) => ({
    ...item,
    issue: `${item.issues.length}개`,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueModalMode, setIssueModalMode] = useState("edit"); // "edit" 또는 "add"

  // 프로젝트 모달 열기/닫기
  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  // 이슈 모달 열기/닫기
  const openIssueModal = (issue = null, mode = "edit") => {
    setSelectedIssue(issue);
    setIssueModalMode(mode);
    setIsSecondModalOpen(true);
  };

  const closeIssueModal = () => {
    setSelectedIssue(null);
    setIsSecondModalOpen(false);
  };

  // 이슈 수정
  const updateIssue = (updatedIssue) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === selectedProject.name
          ? {
              ...item,
              issues: item.issues.map((issue) =>
                issue.id === updatedIssue.id ? updatedIssue : issue
              ),
            }
          : item
      )
    );

    // 프로젝트 모달도 업데이트
    setSelectedProject((prevProject) => ({
      ...prevProject,
      issues: prevProject.issues.map((issue) =>
        issue.id === updatedIssue.id ? updatedIssue : issue
      ),
    }));
  };

  // 이슈 등록
  const addIssue = (newIssue) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === selectedProject.name
          ? {
              ...item,
              issues: [...item.issues, newIssue],
            }
          : item
      )
    );

    // 프로젝트 모달도 업데이트
    setSelectedProject((prevProject) => ({
      ...prevProject,
      issues: [...prevProject.issues, newIssue],
    }));
  };

  return (
    <div className="app">
      {/* 프로젝트 테이블 */}
      <DataTable headers={headers} items={processedItems} onRowClick={openModal} />
      <GraphTable items={items} calculateActiveMonths={calculateActiveMonths} />

      {/* 프로젝트 모달 */}
      {isModalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={closeModal}
          onIssueClick={(issue) => openIssueModal(issue, "edit")} // 수정 모드
          onAddIssue={() => openIssueModal(null, "add")} // 등록 모드
        />
      )}

      {/* 이슈 모달 */}
      {isSecondModalOpen && (
        <IssueModal
          issue={selectedIssue}
          mode={issueModalMode} // "edit" 또는 "add"
          workers={workers}
          onClose={closeIssueModal}
          onSave={(issue) => {
            issueModalMode === "edit"
              ? updateIssue(issue)
              : addIssue({ ...issue, id: Date.now() }); // 새 이슈는 ID 자동 생성
            closeIssueModal();
          }}
        />
      )}
    </div>
  );
}

export default App;