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
        <div>
          <label>구분</label>
          <input
            type="text"
            value={newProject.division}
            onChange={(e) => onChange({ ...newProject, division: e.target.value })}
          />
        </div>
        <div>
          <label>프로젝트 이름</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => onChange({ ...newProject, name: e.target.value })}
          />
        </div>
        <div>
          <label>거래처</label>
          <input
            type="text"
            value={newProject.client}
            onChange={(e) => onChange({ ...newProject, client: e.target.value })}
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
            {managers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
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
        <div>
          <input
            type="text"
            value={newProject.term}
            onChange={(e) => onChange({ ...newProject, term: e.target.value })}
          />
          <label>일</label>
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