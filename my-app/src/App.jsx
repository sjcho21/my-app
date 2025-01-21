import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { workersState } from "./assets/project/atom";
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
        { id: 3, title: "UI 개선 필요3", status: "완료", description: "API 응답 속도를 개선 완료하였습니다." },
      ],
    },
    {
      division: "리서치",
      name: "프로젝트 A",
      client: "고객사 A",
      startDate: "2020.06.03",
      term: "90일",
      progress: "45%",
      manager: "박진형",
      issue: "2개",
      issues: [
        { id: 4, title: "UI 개선 필요4", status: "진행 중", description: "UI를 좀 더 깔끔하게 개선해야 합니다." },
        { id: 5, title: "API 응답 속도 느림1", status: "완료", description: "API 응답 속도를 개선 완료하였습니다." },
        { id: 6, title: "UI 개선 필요4", status: "진행 중", description: "UI를 좀 더 깔끔하게 개선해야 합니다." },
        { id: 7, title: "API 응답 속도 느림1", status: "완료", description: "API 응답 속도를 개선 완료하였습니다." }
      ],
    },
  ]);

  const workers = useRecoilValue(workersState); //작업자 목록(recoil)

  const processedItems = items.map((item) => ({
    ...item,
    issue: `${item.issues.length}개`,
  }));

  const updateIssue = (updatedIssue) => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        issues: item.issues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        ),
      }))
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const openIssueModal = (issue) => {
    setSelectedIssue(issue);
    setIsSecondModalOpen(true);
  };

  const closeIssueModal = () => {
    setSelectedIssue(null);
    setIsSecondModalOpen(false);
  };

  return (
    <div className="app">
      <DataTable headers={headers} items={processedItems} onRowClick={openModal} />
      <GraphTable items={items} calculateActiveMonths={calculateActiveMonths} />
      {isModalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={closeModal}
          onIssueClick={openIssueModal}
        />
      )}
      {isSecondModalOpen && (
      <IssueModal
      issue={selectedIssue}
      workers={workers}
      onClose={closeIssueModal}
      onSave={(updatedIssue) => {
        updateIssue(updatedIssue); // 상위 상태 업데이트
        setSelectedIssue(updatedIssue); // 모달에도 즉시 반영
      }}
    />   
      )}
    </div>
  );
}

export default App;