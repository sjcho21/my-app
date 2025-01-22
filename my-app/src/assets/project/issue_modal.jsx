import React, { useState, useEffect } from "react";

function IssueModal({ issue, workers, unavailableWorkers, onClose, onSave, mode }) {
  const isEditMode = !!issue; // issue가 있으면 수정 모드
  const [editedIssue, setEditedIssue] = useState(
    issue || { title: "", status: "", description: "", worker: "", startDate: "", days: 0, endDate: "" }
  );
  const [isEditable, setIsEditable] = useState(mode === "add");

  // 작업 종료일 계산
  useEffect(() => {
    if (editedIssue.startDate && editedIssue.days > 0) {
      const startDate = new Date(editedIssue.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(editedIssue.days) - 1);
      setEditedIssue((prev) => ({ ...prev, endDate: endDate.toISOString().split("T")[0] }));
    }
  }, [editedIssue.startDate, editedIssue.days]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedIssue); // 저장 콜백 실행
    onClose(); // 모달 닫기
  };

  const handleEditClick = () => {
    setIsEditable(true); // 수정 버튼 클릭 시 입력 활성화
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
              disabled={!isEditable}
            />
          </p>
          <p>
            <strong>상태:</strong>
            <select
              name="status"
              value={editedIssue.status}
              onChange={handleChange}
              disabled={!isEditable}
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
              disabled={!isEditable}
            />
          </p>
          <p>
            <strong>작업자:</strong>
            <select
            name="worker"
            value={editedIssue.worker}
            onChange={handleChange}
            disabled={!isEditable}
          >
            <option value="" disabled>
              작업자 선택
            </option>
            {(Array.isArray(workers) ? workers : []).map((worker, index) => (
              <option key={index} value={worker}>
                {worker}
              </option>
            ))}
          </select>
          </p>
          <p>
            <strong>작업 시작일:</strong>
            <input
              type="date"
              name="startDate"
              value={editedIssue.startDate}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </p>
          <p>
            <strong>작업 기간 (MD):</strong>
            <input
              type="number"
              name="days"
              value={editedIssue.days}
              onChange={handleChange}
              placeholder="작업 기간 입력"
              min="1"
              disabled={!isEditable}
            />
          </p>
          <p>
            <strong>작업 종료일:</strong>
            <input
              type="text"
              name="endDate"
              value={editedIssue.endDate}
              readOnly
              placeholder="자동 계산됨"
              disabled
            />
          </p>
          <div className="modal-footer">
            {isEditMode && !isEditable && (
              <button onClick={handleEditClick}>수정</button>
            )}
            {isEditable && (
              <button onClick={handleSave}>{isEditMode ? "저장" : "등록"}</button>
            )}
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueModal;