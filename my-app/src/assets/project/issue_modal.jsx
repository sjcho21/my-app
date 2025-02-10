import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { workersState as workersAtom} from "./atom";

function IssueModal({ issue, workers, onClose, onSave, mode }) {
  const [workersState , setWorkerState] = useRecoilState(workersAtom);
  const isEditMode = !!issue; // issue가 있으면 수정 모드
  const [editedIssue, setEditedIssue] = useState(
    issue || { title: "", status: "", description: "", workerId: null, startDate: "", days: 0, endDate: "", actRate: "", expRate: "" }
  );
  const [isEditable, setIsEditable] = useState(mode === "add"); //add 일때 true 아니면 false
  const [availableWorkers, setAvailableWorkers] = useState(workers || []);

  // 작업 종료일 계산 USEFFECT 사용하여 렌더링 될때다마 계산
  useEffect(() => {
    if (editedIssue.startDate && editedIssue.days > 0) {
      const startDate = new Date(editedIssue.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(editedIssue.days) - 1);
      setEditedIssue((prev) => ({ ...prev, endDate: endDate.toISOString().split("T")[0] }));
    }
  }, [editedIssue.startDate, editedIssue.days]);

   useEffect(() => {
    if (editedIssue.startDate && editedIssue.endDate) {
      const issueStart = new Date(editedIssue.startDate);
      const issueEnd = new Date(editedIssue.endDate);

      const filteredWorkers = workersState.filter((worker) => {
        // 모든 작업자 기간 중 겹치지 않는 경우만 허용
        return worker.periods.every(({ startDate, endDate }) => {
          const workerStart = new Date(startDate);
          const workerEnd = new Date(endDate);
          // 겹치는 조건: 새 작업 시작일이 기존 작업 종료일 이후 || 새 작업 종료일이 기존 작업 시작일 이전
          return issueEnd < workerStart || issueStart > workerEnd;
        });
      });

      setAvailableWorkers(filteredWorkers);
    } else {
      setAvailableWorkers([]);
    }
  }, [editedIssue.startDate, editedIssue.endDate, workersState]);

   // workerId에 해당하는 workerName을 찾기
   useEffect(() => {
    if (editedIssue.workerId) {
      const worker = availableWorkers.find((worker) => worker.id === editedIssue.workerId);
      if (worker) {
        setEditedIssue((prev) => ({ ...prev, workerName: worker.name }));
      }
    }
  }, [editedIssue.workerId, availableWorkers]);  

  // 실제 진척률 계산
  useEffect(() => {
    if (editedIssue.startDate && editedIssue.endDate) {
      const startDate = new Date(editedIssue.startDate);
      const endDate = new Date(editedIssue.endDate);
      const today = new Date();

      if (today >= startDate && today <= endDate) {
        const totalDuration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1일 추가 (끝나는 날 포함)
        const elapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1일 추가 (시작일 포함)
        const progress = Math.floor((elapsed / totalDuration) * 100);
        setEditedIssue((prev) => ({
          ...prev,
          expRate: progress > 100 ? 100 : progress < 0 ? 0 : progress,
        }));
      } else if (today < startDate) {
        // 현재 날짜가 시작일 이전인 경우
        setEditedIssue((prev) => ({ ...prev, expRate: 0 }));
      } else if (today > endDate) {
        // 현재 날짜가 종료일 이후인 경우
        setEditedIssue((prev) => ({ ...prev, expRate: 100 }));
      }
    }
  }, [editedIssue.startDate, editedIssue.endDate]); //startDate 와 endDate가 변하지 않으면 useEffect 실행x

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editedIssue.title.trim()) { 
      alert("제목을 입력해주세요."); 
      return; 
    }
    if (!editedIssue.status) { 
      alert("상태를 선택해주세요."); 
      return; 
    }
    if (!editedIssue.description.trim()) { 
      alert("설명을 입력해주세요."); 
      return; 
    }
    if (!editedIssue.workerId) { 
      alert("작업자를 선택해주세요."); 
      return; 
    }
    if (!editedIssue.startDate) { 
      alert("작업 시작일을 선택해주세요."); 
      return; 
    }
    if (!editedIssue.days || editedIssue.days <= 0) { 
      alert("작업 기간을 입력해주세요 (1 이상)."); 
      return; 
    }
  
    // 이슈 추가 시, 작업자의 periods에 projectId와 기간 추가
    setWorkerState((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.id === editedIssue.workerId) {
          const newPeriod = {
            projectId: editedIssue.projectId, // projectId 추가
            startDate: editedIssue.startDate,
            endDate: editedIssue.endDate,
          };
          return {
            ...worker,
            periods: [...worker.periods, newPeriod], // 새 기간 추가
          };
        }
        return worker;
      })
    );
  
    onSave(editedIssue); // 이슈 저장
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
          <div className="issue-field">
            <strong>제목:</strong>
            <input
              name="title"
              value={editedIssue.title}
              onChange={handleChange}
              placeholder="이슈 제목 입력"
              disabled={!isEditable}
            />
          </div>
          <div className="issue-field">
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
          </div>
          <div className="issue-field">
            <strong>설명:</strong>
            <textarea
              name="description"
              value={editedIssue.description}
              onChange={handleChange}
              placeholder="이슈 설명 입력"
              disabled={!isEditable}
            />
          </div>
          <div className="issue-field">
            <strong>작업자:</strong>
            <select
              name="workerId"
              value={editedIssue.workerId || ""}
              onChange={(e) => setEditedIssue((prev) => ({ ...prev, workerId: Number(e.target.value) }))}
              disabled={!isEditable || availableWorkers.length === 0}
            >
              <option value="" disabled>
                작업자 선택
              </option>
              {availableWorkers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          <div className="issue-field">
            <strong>작업 시작일:</strong>
            <input
              type="date"
              name="startDate"
              value={editedIssue.startDate}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="issue-field">
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
          </div>
          <div className="issue-field">
            <strong>작업 종료일:</strong>
            <input
              type="text"
              name="endDate"
              value={editedIssue.endDate || ""}
              readOnly
              placeholder="자동 계산됨"
              disabled
            />
          </div>
          <div className="issue-field">
            <strong>예상 진척룰 (%):</strong>
            <input
              type="text"
              name="expRate"
              value={editedIssue.expRate}
              readOnly
              placeholder="자동 계산됨"
              disabled
            />
          </div>
          <div className="issue-field">
            <strong>실제 진척률 (%):</strong>
            <input
              type="number"
              name="actRate"
              value={editedIssue.actRate}
              onChange={handleChange}
              min="1"
              max="100"
              disabled={!isEditable}
            />
          </div>
          <div className="modal-footer">
            {isEditMode && !isEditable && (
              <button onClick={handleEditClick}>수정</button>
            )}
            {isEditable && (
              <button onClick={handleSave}>{isEditMode ? "저장" : "등록"}</button> //이슈 수정 => 저장, 이슈 등록 => 등록
            )}
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueModal;