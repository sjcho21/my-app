import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { workersState } from "./assets/project/atom"; //작업자 명단
import { issuesState } from "./assets/project/atom";
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
  const [issues, setIssues] = useRecoilState(issuesState); //이슈 데이터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueModalMode, setIssueModalMode] = useState("edit"); 
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [updatedProjectId, setUpdatedProjectId] = useState(null); // 변경된 프로젝트 추적
  const [newProject, setNewProject] = useState({
    id: "",
    name: "",
    manager: "",
    startDate: "",
  });

  //진행준인 프로젝트의 이슈 갯수
  const processedItems = items.map((item) => {
    const issuesCount = issues.filter(
      (issue) => issue.projectId === item.projectId
    ).length;
    return {
      ...item,
      issue: `${issuesCount}개`,
    };
  });

  // 전체 이슈 계산(진척룰, 시작일, 종료일)
const calculateProjectMetrics = (projectId, issues) => {
  const projectIssues = issues.filter(issue => issue.projectId === projectId);

  // 프로젝트 시작일 계산
  const updatedStartDate = projectIssues.length > 0
    ? projectIssues
        .map(issue => new Date(issue.startDate))
        .reduce((earliest, current) => (current < earliest ? current : earliest))
        .toISOString()
        .split("T")[0]
    : null;

  // 프로젝트 종료일 계산
  const updatedEndDate = projectIssues.length > 0
    ? projectIssues
        .map(issue => new Date(issue.endDate))
        .reduce((latest, current) => (current > latest ? current : latest))
        .toISOString()
        .split("T")[0]
    : null;

  // 총 작업 일수 계산
  const totalDays = projectIssues.reduce((sum, issue) => sum + (parseInt(issue.days, 10) || 0), 0);

  // 전체 진행률 계산
  const overallProgress = calculateOverallProgress(projectIssues);

  return {
    startDate: updatedStartDate,
    endDate: updatedEndDate,
    term: totalDays,
    progress: overallProgress,
  };
};

  
  //진행률 계산
  const calculateOverallProgress = (issues) => {
    if (issues.length === 0) return 0; // 이슈가 없으면 진행률은 0
    const totalProgress = issues.reduce((total, issue) => total + issue.expRate, 0);
    return Math.floor(totalProgress / issues.length); // 이슈들의 평균 진행률
  };

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
      projectId: null,
      division: "",
      name: "",
      client: "",
      manager: "",
      startDate: "",
      term: ""    
    }); 
    setIsProjectModalOpen(true);
  };
  
  const closeProjectModal = () => {
    setNewProject({
      projectId: null,
      division: "",
      name: "",
      client: "",
      manager: "",
      startDate: "",
      term: ""
    }); 
    setIsProjectModalOpen(false);
  };
  
  const updateIssue = (updIssue) => {
    setIssues((prevIssues) => prevIssues.map((issue) => (issue.issueId === updIssue.issueId ? updIssue : issue)));
    setUpdatedProjectId(updIssue.projectId);
  };
  
  useEffect(() => {
    if (!updatedProjectId) return;
  
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.projectId === updatedProjectId) {
          const updatedMetrics = calculateProjectMetrics(updatedProjectId, issues);
          return {
            ...item,
            ...updatedMetrics,
          };
        }
        return item;
      })
    );
  
    setSelectedProject((prevProject) => {
      if (!prevProject || prevProject.projectId !== updatedProjectId) return prevProject;
  
      const updatedMetrics = calculateProjectMetrics(updatedProjectId, issues);
  
      return {
        ...prevProject,
        issues: issues.filter((issue) => issue.projectId === updatedProjectId),
        ...updatedMetrics,
      };
    });
  
    // 업데이트 완료 후 상태 초기화
    setUpdatedProjectId(null);
  }, [updatedProjectId, issues]); // updatedProjectId나 issues가 변경될 때 실행


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
    const newId = items.length > 0 ? items[items.length - 1].projectId + 1 : 1;
    setItems([...items, { ...newProject, projectId: newId }]);
    closeProjectModal();
  };


  // 이슈 등록 (이슈 날짜에 따른 프로젝트 날짜 변경)
  const addIssue = (newIssue) => {

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.projectId === selectedProject.projectId) {
          
          let updatedIssues;
          if (Array.isArray(item.issues)) {
            updatedIssues = [...item.issues, newIssue]; 
          } else if (typeof item.issues === "object" && item.issues !== null) {
            updatedIssues = [item.issues, newIssue]; 
          } else {
            updatedIssues = [newIssue]; 
          }

          const updatedMetrics = calculateProjectMetrics(newIssue.projectId, [...issues, newIssue]);
  
          const updatedStartDate = updatedIssues
            .map((issue) => new Date(issue.startDate))
            .reduce((earliest, current) => (current < earliest ? current : earliest), new Date())
            .toISOString()
            .split("T")[0];
  
          const updatedEndDate = updatedIssues
            .map((issue) => new Date(issue.endDate))
            .reduce((latest, current) => (current > latest ? current : latest), new Date())
            .toISOString()
            .split("T")[0];
  
          return {
            ...item,
            ...updatedMetrics
          };
        }
        return item;
      })
    );
  
    setSelectedProject((prevProject) => {
      if (!prevProject) return prevProject; 
  
      let updatedIssues;
      if (Array.isArray(prevProject.issues)) {
        updatedIssues = [...prevProject.issues, newIssue]; 
      } else if (typeof prevProject.issues === "object" && prevProject.issues !== null) {
        updatedIssues = [prevProject.issues, newIssue]; 
      } else {
        updatedIssues = [newIssue]; 
      }
  
      const updatedStartDate = updatedIssues
        .map((issue) => new Date(issue.startDate))
        .reduce((earliest, current) => (current < earliest ? current : earliest), new Date())
        .toISOString()
        .split("T")[0];
  
      const updatedEndDate = updatedIssues
        .map((issue) => new Date(issue.endDate))
        .reduce((latest, current) => (current > latest ? current : latest), new Date())
        .toISOString()
        .split("T")[0];
  
      return {
        ...prevProject,
        issues: updatedIssues, 
        startDate: updatedStartDate,
        endDate: updatedEndDate,
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
          projectId={selectedProject.projectId}
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
          onClose={closeIssueModal}
          projectId={selectedProject.projectId}
          onSave={(issue) => {          
            if (!issue.projectId) {
              issue = { ...issue, projectId: selectedProject?.projectId };
            }
          
            if (issueModalMode === "edit") {
              updateIssue(issue); //이슈 수장
            } else {
              addIssue(issue); // 이슈 등록
            }
          
            closeIssueModal();
          }}
        />
      )}
    </div>
  );
}

export default App;