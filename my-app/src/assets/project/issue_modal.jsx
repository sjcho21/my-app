import React, { useState } from "react";

function IssueModal({ issue, workers, onClose, onSave, mode }) {
  const isEditMode = !!issue; // issue가 있으면 수정 모드, 없으면 등록 모드
  const [editedIssue, setEditedIssue] = useState(
    issue || { title: "", status: "", description: "", worker: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedIssue); // 저장 콜백 실행
    onClose(); // 모달 닫기
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? "이슈 수정" : "이슈 등록"}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>제목:</strong>
            <input
              name="title"
              value={editedIssue.title}
              onChange={handleChange}
              placeholder="이슈 제목 입력"
            />
          </p>
          <p>
            <strong>상태:</strong>
            <select
              name="status"
              value={editedIssue.status}
              onChange={handleChange}
            >
              <option value="" disabled>
                상태 선택
              </option>
              <option value="진행 중">진행 중</option>
              <option value="완료">완료</option>
            </select>
          </p>
          <p>
            <strong>설명:</strong>
            <textarea
              name="description"
              value={editedIssue.description}
              onChange={handleChange}
              placeholder="이슈 설명 입력"
            />
          </p>
          <p>
            <strong>작업자:</strong>
            <select
              name="worker"
              value={editedIssue.worker}
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
            <button onClick={handleSave}>{isEditMode ? "수정" : "등록"}</button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}