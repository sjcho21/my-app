import React from "react";
import { useRecoilValue } from "recoil";
import { managersState } from "../recoil/atom";

function ProjectAddModal({
  isOpen,
  newProject,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null; 

  const managers = useRecoilValue(managersState) // 작업자 명단 (값이 변하지 않으므로 일단 유지)

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>프로젝트 등록</h2>
        <div className="pjt-field">
          <label>구분</label>
          <input
            type="text"
            autoComplete="off" 
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
        <div className="modal-footer">
          <button onClick={onSubmit}>등록</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectAddModal;