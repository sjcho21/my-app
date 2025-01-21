import React, { useState } from "react";

function IssueModal({ issue, workers, onClose, onSave, mode }) {
  const [editedIssue, setEditedIssue] = useState(issue); // 수정 데이터

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedIssue); // 상위 컴포넌트에 저장 요청
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "add" ? "이슈 등록" : "이슈 상세 정보"}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {mode === "view" ? ( // 보기 모드
            <>
              <p>
                <strong>제목:</strong> {issue.title}
              </p>
              <p>
                <strong>상태:</strong> {issue.status}
              </p>
              <p>
                <strong>설명:</strong> {issue.description}
              </p>
              <p>
                <strong>작업자:</strong> {issue.worker || "미지정"}
              </p>
            </>
          ) : ( // 추가 또는 수정 모드
            <>
              <p>
                <strong>제목:</strong>
                <input
                  name="title"
                  value={editedIssue.title}
                  onChange={handleChange}
                />
              </p>
              <p>
                <strong>상태:</strong>
                <input
                  name="status"
                  value={editedIssue.status}
                  onChange={handleChange}
                />
              </p>
              <p>
                <strong>설명:</strong>
                <textarea
                  name="description"
                  value={editedIssue.description}
                  onChange={handleChange}
                />
              </p>
              <p>
                <strong>작업자:</strong>
                <select
                  name="worker"
                  value={editedIssue.worker || ""}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    작업자 선택
                  </option>
                  {workers.map((worker, index) => (
                    <option key={index} value={worker}>
                      {worker}
                    </option>
                  ))}
                </select>
              </p>
              <div className="modal-footer">
                <button onClick={handleSave}>
                  {mode === "add" ? "등록" : "저장"}
                </button>
                <button onClick={onClose}>취소</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default IssueModal;