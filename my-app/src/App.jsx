import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { workersState } from "./assets/project/atom"; //작업자 명단
import { header } from "./assets/project/atom"; //프로젝트 헤더 목록
import { project } from "./assets/project/atom"; //프로젝트 목록
import { calculateMonths } from "./assets/project/date_util.jsx"; //프로젝트 기간 계산
import IssueModal from "./assets/project/issue_modal.jsx";
import DataTable from "./assets/project/data_table.jsx";
import GraphTable from "./assets/project/graph_table.jsx";
import ProjectModal from "./assets/project/project_modal.jsx";
import ProjectAddModal from "./assets/project/add_project_modal.jsx";
import "./App.css";

function App() {
  const headers = useRecoilValue(header) //헤더목록
    
  const [items, setItems] = useRecoilState(project); //프로젝트 데이터

  const workers = useRecoilValue(workersState) // 작업자 명단

  const processedItems = items.map((item) => {
    const totalDays = item.issues.reduce((sum, issue) => {
      const days = Number(issue.days) || 0; 
      return sum + days;
    }, 0);
  
    return {
      ...item,
      issue: `${item.issues.length}개`, // 이슈 개수
      term: totalDays, // days 기준으로 term 표시
    };
  });

  const calculateOverallProgress = (issues) => {
    if (issues.length === 0) return 0; // 이슈가 없으면 진행률은 0
    const totalProgress = issues.reduce((total, issue) => total + issue.expRate, 0);
    return Math.floor(totalProgress / issues.length); // 이슈들의 평균 진행률
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueModalMode, setIssueModalMode] = useState("edit"); 
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    id: null,
    name: "",
    manager: "",
    startDate: "",
    issues: [],
  });

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


  // 프로젝트 모달 열기/닫기
  const openProjectModal = () => {
    setNewProject({
      id: null,
      division: "",
      name: "",
      client: "",
      manager: "",
      startDate: "",
      term: "",
      issues: [],
    }); 
    setIsProjectModalOpen(true);
  };
  
  const closeProjectModal = () => {
    setNewProject({
      id: null,
      division: "",
      name: "",
      client: "",
      manager: "",
      startDate: "",
      term: "",
      issues: [],
    }); 
    setIsProjectModalOpen(false);
  };
  
  // 이슈 수정
const updateIssue = (updatedIssue) => {
  setItems((prevItems) =>
    prevItems.map((item) => {
      if (item.name === selectedProject.name) {
        const updatedIssues = item.issues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        );

        // 새로운 시작 날짜 계산
        const updatedStartDate = updatedIssues
          .map((issue) => new Date(issue.startDate))
          .reduce((earliest, current) => (current < earliest ? current : earliest))
          .toISOString()
          .split("T")[0];
        
        // 새로운 종료 날짜 계산 (가장 늦은 이슈의 종료 날짜)
        const updatedEndDate = updatedIssues
          .map((issue) => new Date(issue.endDate))
          .reduce((latest, current) => (current > latest ? current : latest))
          .toISOString()
          .split("T")[0];
        
          const totalDays = updatedIssues.reduce((sum, issue) => {
            const days = parseInt(issue.days, 10) || 0; // 'days'를 숫자로 변환
            return sum + days; // 숫자 합산
          }, 0);

        const overallProgress = calculateOverallProgress(updatedIssues);

        return {
          ...item,
          issues: updatedIssues,
          startDate: updatedStartDate,
          endDate: updatedEndDate,
          term: totalDays,
          progress: overallProgress
        };
      }
      return item;
    })
  );

  // 프로젝트 모달도 업데이트
  setSelectedProject((prevProject) => {
    const updatedIssues = prevProject.issues.map((issue) =>
      issue.id === updatedIssue.id ? updatedIssue : issue
    );
    const updatedStartDate = updatedIssues
      .map((issue) => new Date(issue.startDate))
      .reduce((earliest, current) => (current < earliest ? current : earliest))
      .toISOString()
      .split("T")[0];

    // 새로운 종료 날짜 계산 (가장 늦은 이슈의 종료 날짜)
    const updatedEndDate = updatedIssues
    .map((issue) => new Date(issue.endDate))
    .reduce((latest, current) => (current > latest ? current : latest))
    .toISOString()
    .split("T")[0];

    return {
      ...items,
      issues: updatedIssues,
      startDate: updatedStartDate,
      endDate: updatedEndDate,
    };
  });
};

   // 프로젝트 등록
   const handleAddProject = () => {

    if (!newProject.division) {
      alert("프로젝트 구분을 입력해 주세요.");
      return;
    }
    if (!newProject.name) {
      alert("프로젝트 이름을 입력해 주세요.");
      return;
    }
    if (!newProject.client) {
      alert("거래처를 입력해 주세요.");
      return;
    }
    if (!newProject.manager) {
      alert("담당자를 입력해 주세요.");
      return;
    }
    if (!newProject.term) {
      alert("투입기간을 입력해 주세요.");
      return;
    }
    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    setItems([...items, { ...newProject, id: newId }]);
    closeProjectModal();
  };


  // 이슈 등록
  const addIssue = (newIssue) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.name === selectedProject.name) {
        const updatedIssues = [...item.issues, newIssue];

        // 새로운 시작 날짜 계산
        const updatedStartDate = updatedIssues
        .map((issue) => new Date(issue.startDate))
        .reduce((earliest, current) => (current < earliest ? current : earliest))
        .toISOString()
        .split("T")[0];
      
        // 새로운 종료 날짜 계산 (가장 늦은 이슈의 종료 날짜)
        const updatedEndDate = updatedIssues
        .map((issue) => new Date(issue.endDate))
        .reduce((latest, current) => (current > latest ? current : latest))
        .toISOString()
        .split("T")[0];

        const totalDays = updatedIssues.reduce((sum, issue) => {
          const days = parseInt(issue.days, 10) || 0; // 'days'를 숫자로 변환
          return sum + days; // 숫자 합산
        }, 0);

        const overallProgress = calculateOverallProgress(updatedIssues);

        return {
          ...item,
          issues: updatedIssues,
          startDate: updatedStartDate,
          endDate: updatedEndDate,
          term: totalDays,
          progress: overallProgress
        };
      }
        return item;
      })
    );

    // 프로젝트 모달도 업데이트
    setSelectedProject((prevProject) => {
      const updatedIssues = [...prevProject.issues, newIssue];

      //새로운 날짜 계산
      const updatedStartDate = updatedIssues
        .map((issue) => new Date(issue.startDate))
        .reduce((earliest, current) => (current < earliest ? current : earliest))
        .toISOString()
        .split("T")[0];
      
       // 새로운 종료 날짜 계산 (가장 늦은 이슈의 종료 날짜)
       const updatedEndDate = updatedIssues
       .map((issue) => new Date(issue.endDate))
       .reduce((latest, current) => (current > latest ? current : latest))
       .toISOString()
       .split("T")[0];  
          

      return {
        ...prevProject,
        issues: updatedIssues,
        startDate: updatedStartDate,
        endDate: updatedEndDate
      };
    });
  };

  return (
    <div className="app">
      {/* 프로젝트 테이블 */}
      <DataTable headers={headers} items={processedItems} onRowClick={openModal} />
      <button onClick={openProjectModal} className="add-project-button">
        +
      </button>
      <GraphTable items={items} calculateMonths={calculateMonths} />

       {/* 프로젝트 등록 모달 */}
       <ProjectAddModal
         isOpen={isProjectModalOpen}
        workers={workers}
        newProject={newProject}
        onClose={closeProjectModal}
        onChange={setNewProject}
        onSubmit={handleAddProject}
      />

      {/* 프로젝트 모달 */}
      {isModalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={closeModal}
          onIssueClick={(issue) => openIssueModal(issue, "edit")} // 이슈 수정
          onAddIssue={() => openIssueModal(null, "add")} // 이슈 등록
        />
      )}

      {/* 이슈 모달 */}
      {isSecondModalOpen && (
         <IssueModal
         issue={selectedIssue}
         mode={issueModalMode} 
         workers={workers}
         onClose={closeIssueModal}
         onSave={(issue) => {
            const lastIssueId =
              selectedProject?.issues?.slice(-1)[0]?.id || 0; // 마지막 이슈 ID
            const newId = lastIssueId + 1; // 새로운 이슈 ID
     
           if (issueModalMode === "edit") {
             updateIssue(issue);
           } else {
             addIssue({ ...issue, id: newId }); 
           }
           closeIssueModal();
         }}
       />
      )}
    </div>
  );
}

export default App;