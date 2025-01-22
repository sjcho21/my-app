import React from "react";

function ProjectAddModal({
  isOpen,
  workers,
  newProject,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>프로젝트 등록</h2>
        <div>
          <label>프로젝트 이름</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => onChange({ ...newProject, name: e.target.value })}
          />
        </div>
        <div>
          <label>담당자</label>
          <select
            value={newProject.manager}
            onChange={(e) =>
              onChange({ ...newProject, manager: e.target.value })
            }
          >
            <option value="" disabled>
              담당자 선택
            </option>
            {workers.map((worker) => (
              <option key={worker} value={worker}>
                {worker}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>시작일</label>
          <input
            type="date"
            value={newProject.startDate}
            onChange={(e) =>
              onChange({ ...newProject, startDate: e.target.value })
            }
          />
        </div>
        <div className="modal-footer">
          <button onClick={onSubmit}>등록</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectAddModal;