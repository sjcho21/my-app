import { useRecoilValue, useSetRecoilState } from "recoil";
import { issuesState, project } from "./atom";

function ProjectModal({ projectId, onClose, onIssueClick, onAddIssue }) {

  const projects = useRecoilValue(project);
  const issues = useRecoilValue(issuesState);
  const currentProject = projects.find((p) => p.projectId === projectId); // 선택한 프로젝트 (Modal 에 Display 되는 프로젝트)
  const projectIssues = issues.filter((issue) => issue.projectId === currentProject.projectId); //(projectId 로 종속된 이슈)

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{currentProject.name}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <ul>
            <li>
              <strong>담당자:</strong> {currentProject.manager}
            </li>
            <li>
              <strong>시작일:</strong> {currentProject.startDate}
            </li>
            <li>
              <strong>종료일:</strong> {currentProject.endDate}
            </li>
          </ul>
          <h3>이슈</h3>
          <button className="add-button" onClick={() => onAddIssue(projectId)}>이슈 등록</button>
          <table className="issues-table">
            <thead>
              <tr>
                <th>이슈 ID</th>
                <th>제목</th>
                <th>상태</th>
                <th>작업자</th>
              </tr>
            </thead>
            <tbody>
              {projectIssues.map((issue) => (
                <tr key={issue.issueId} onClick={() => onIssueClick(issue.issueId)} className="clickable">
                  <td>{issue.issueId}</td>
                  <td>{issue.title}</td>
                  <td>{issue.status}</td>
                  <td>{issue.workerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default ProjectModal;