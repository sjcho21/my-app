import React from "react";

function ProjectModal({ project, onClose, onIssueClick, onAddIssue }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{project.name}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <ul>
            <li>
              <strong>담당자:</strong> {project.manager}
            </li>
            <li>
              <strong>시작일:</strong> {project.startDate}
            </li>
          </ul>
          <h3>이슈</h3>
            <button onClick={() => onAddIssue()}>이슈 등록</button>
            <table className="issues-table">
            <thead>
                <tr>
                <th>이슈 ID</th>
                <th>제목</th>
                <th>상태</th>
                </tr>
            </thead>
            <tbody>
                {project.issues.map((issue) => (
                <tr key={issue.id} onClick={() => onIssueClick(issue, "view")} className="clickable">
                    <td>{issue.id}</td>
                    <td>{issue.title}</td>
                    <td>{issue.status}</td>
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