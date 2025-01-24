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

  const processedItems = items.map((item) => ({ //이슈 갯수계산
    ...item,
    issue: `${item.issues.length}개`,
  }));

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
  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);

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

   // 프로젝트 등록
   const handleAddProject = () => {
    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    setItems([...items, { ...newProject, id: newId }]);
    closeProjectModal();
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
      <button onClick={openProjectModal} className="add-project-button">
        PJT 등록
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
          onIssueClick={(issue) => openIssueModal(issue, "edit")} // 수정 모드
          onAddIssue={() => openIssueModal(null, "add")} // 등록 모드
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