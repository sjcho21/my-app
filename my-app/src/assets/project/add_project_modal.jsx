import React from "react";
import { useRecoilValue } from "recoil";
import { managersState } from "./atom";

function ProjectAddModal({
  isOpen,
  newProject,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null; 

  const managers = useRecoilValue(managersState) // 작업자 명단

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>프로젝트 등록</h2>
        <div className="pjt-field">
          <label>구분</label>
          <input
            type="text"
            value={newProject.division}
            onChange={(e) => onChange({ ...newProject, division: e.target.value })}
          />
        </div>
        <div className="pjt-field">
          <label>프로젝트 이름</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => onChange({ ...newProject, name: e.target.value })}
          />
        </div>
        <div className="pjt-field">
          <label>거래처</label>
          <input
            type="text"
            value={newProject.client}
            onChange={(e) => onChange({ ...newProject, client: e.target.value })}
          />
        </div>
        <div className="pjt-field">
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
            {managers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
            </option>
            ))}
          </select>
        </div>
        <div className="pjt-field">
          <label>시작일</label>
          <input
            type="date"
            min="2025-01-01"
            max="2025-12-31"
            value={newProject.startDate}
            onChange={(e) =>
              onChange({ ...newProject, startDate: e.target.value })
            }
          />
        </div>
        <div className="pjt-field">
          <label>투입기간(MD)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={newProject.term}
            onChange={(e) => onChange({ ...newProject, term: e.target.value })}
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