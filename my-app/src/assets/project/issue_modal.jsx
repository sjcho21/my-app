import React, { useState } from "react";

function IssueModal({ issue, workers, onClose, onSave }) {
  const [editedIssue, setEditedIssue] = useState(issue); // 수정 데이터
  const [isEditMode, setIsEditMode] = useState(false);   // 수정 모드 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedIssue); // 상위 컴포넌트에 저장 요청
    setIsEditMode(false); // 수정 모드 종료
  };

  const handleCancel = () => {
    setEditedIssue(issue); // 수정 내용 초기화
    setIsEditMode(false);  // 수정 모드 종료
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>이슈 상세 정보</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {!isEditMode ? ( // 보기 모드
            <>
              <p>
                <strong>제목:</strong> {editedIssue.title}
              </p>
              <p>
                <strong>상태:</strong> {editedIssue.status}
              </p>
              <p>
                <strong>설명:</strong> {editedIssue.description}
              </p>
              <p>
                <strong>작업자:</strong> {editedIssue.worker || "미지정"}
              </p>
              <button onClick={() => setIsEditMode(true)}>수정</button>
            </>
          ) : ( // 수정 모드
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
                <button onClick={handleSave}>저장</button>
                <button onClick={handleCancel}>취소</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default IssueModal;