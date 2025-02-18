import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { workersState as workersAtom, issuesState as issuesAtom, editedIssueState } from "./atom";

function IssueModal({ issue, onClose, onSave, mode, projectId }) {

  const [workersState , setWorkerState] = useRecoilState(workersAtom);
  const [issuesState , setIssuesState] = useRecoilState(issuesAtom);
  const isEditMode = !!issue; // issue가 있으면 수정 모드
  const [editedIssue, setEditedIssue] = useRecoilState(editedIssueState);
  const [isEditable, setIsEditable] = useState(mode === "add"); //add 일때 true 아니면 false
  const [availableWorkers, setAvailableWorkers] = useState([]);

  //현재 이슈
  const currentIssue = issuesState.find((p) => p.issueId === issue);

  useEffect(() => {
    if (currentIssue) {
      setEditedIssue(currentIssue);
    }
  }, [currentIssue]); 

  useEffect(() => {
    setEditedIssue(prev => ({
      ...prev,
      projectId: prev.projectId || projectId || ""
    }));
  }, [projectId]);

  // 작업 종료일 계산 USEFFECT 사용하여 렌더링 될때다마 계산
  useEffect(() => {
    if (editedIssue.startDate && editedIssue.days > 0) {
        const startDate = new Date(editedIssue.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Number(editedIssue.days) - 1);

        const calculatedEndDate = endDate.toISOString().split("T")[0]; // 새 종료일 계산

        setEditedIssue((prev) => {
          if (prev.endDate === calculatedEndDate) {
            return prev; // 동일하면 업데이트하지 않음 (불필요한 리렌더링 방지)
          }
          return { ...prev, endDate: calculatedEndDate };
        });
      }
  }, [editedIssue.startDate, editedIssue.days]);

  useEffect(() => {
    if (!editedIssue.startDate || !editedIssue.endDate) {
      setAvailableWorkers([]);
      return;
    }
  
    const issueStart = new Date(editedIssue.startDate);
    const issueEnd = new Date(editedIssue.endDate);
  
    // 현재 수정 중인 이슈는 작업 가능 여부 체크에서 제외
    const filteredWorkers = workersState.filter((worker) =>
      worker.periods.every(({ startDate, endDate, issueId }) => {
        if (issueId === editedIssue.issueId) return true; // 현재 수정 중인 이슈는 체크 제외
        const workerStart = new Date(startDate);
        const workerEnd = new Date(endDate);
        return issueEnd < workerStart || issueStart > workerEnd;
      })
    );
  
    setAvailableWorkers((prev) =>
      JSON.stringify(prev) !== JSON.stringify(filteredWorkers) ? filteredWorkers : prev
    );
  }, [editedIssue.startDate, editedIssue.endDate, workersState]);
  
  useEffect(() => {
    if (!editedIssue.workerId) return;
  
    const isWorkerStillAvailable = availableWorkers.some(worker => worker.id === editedIssue.workerId);
  
    setEditedIssue(prev => ({
      ...prev,
      workerDisabled: !isWorkerStillAvailable, // 기존 workerId 유지하면서 비활성화 상태 추가
    }));
  }, [editedIssue.workerId, availableWorkers]);

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
      // 날짜 객체 생성 후 시간 제거 (00:00:00)
      const startDate = new Date(editedIssue.startDate);
      startDate.setHours(0, 0, 0, 0);
  
      const endDate = new Date(editedIssue.endDate);
      endDate.setHours(0, 0, 0, 0);
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // 전체 기간 계산 (마지막 날 포함)
      const totalDuration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
      if (totalDuration > 0) {
        if (today >= startDate && today <= endDate) {
          // 현재까지의 경과 기간 계산 (시작일 포함)
          const elapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
          const progress = Math.floor((elapsed / totalDuration) * 100);
  
          setEditedIssue((prev) => ({
            ...prev,
            expRate: Math.min(Math.max(progress, 0), 100), // 0~100 사이 값으로 조정
          }));
        } else if (today < startDate) {
          // 현재 날짜가 시작일 이전인 경우
          setEditedIssue((prev) => ({ ...prev, expRate: 0 }));
        } else if (today > endDate) {
          // 현재 날짜가 종료일 이후인 경우
          setEditedIssue((prev) => ({ ...prev, expRate: 100 }));
        }
      }
    }
  }, [editedIssue.startDate, editedIssue.endDate]);

  useEffect(() => {
    if (!isEditMode) {
      setEditedIssue({
        title: "",
        status: "",
        description: "",
        workerId: null,
        startDate: "",
        days: 0,
        endDate: "",
        actRate: "",
        expRate: "",
        projectId: projectId || ""
      });
    }
  }, [onClose]); //모달이 닫길때마다 등록이슈 초기화

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

    // 최종적으로 작업자가 작업 가능 여부를 확인
    const isWorkerStillAvailable = availableWorkers.some(worker => worker.id === editedIssue.workerId); //현재 작업중인 작업자

    
    // 현재 기간과 겹치는 이슈 찾기
    const overlappingIssues = issuesState.filter(issue => {
      if (issue.workerId !== editedIssue.workerId || issue.issueId === editedIssue.issueId) return false;

      const issueStart = new Date(issue.startDate);
      const issueEnd = new Date(issue.endDate);
      const editedStart = new Date(editedIssue.startDate);
      const editedEnd = new Date(editedIssue.endDate);

      return !(editedEnd < issueStart || editedStart > issueEnd);
    });

    if (!isWorkerStillAvailable) {
      // 사용자에게 알림
      if (overlappingIssues.length > 0) {
        const message = `⚠️ 선택한 작업자는 다음 작업과 겹칩니다:\n` +
          overlappingIssues.map(issue => `- ${issue.title} (${issue.startDate} ~ ${issue.endDate})`).join("\n") +
          `\n\n가능한 다른 작업자를 선택해주세요.`;
        alert(message);
        return;
      }
    }
  
    // 새로운 이슈 생성
    const newIssueId =
    issuesState.length > 0
      ? Math.max(...issuesState.map((issue) => issue.issueId)) + 1
      : 1;

    const newIssue = isEditMode
      ? { ...editedIssue }
      : { ...editedIssue, issueId: newIssueId, projectId: projectId || "" };

  
    setWorkerState((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.periods.some((period) => period.issueId === newIssue.issueId)) {
          return {
            ...worker,
            periods: worker.periods.filter((period) => period.issueId !== newIssue.issueId),
          };
        }
        return worker;
      })
    );
  
    setWorkerState((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.id === newIssue.workerId) {
          const newPeriod = {
            startDate: newIssue.startDate,
            endDate: newIssue.endDate,
            issueId: newIssue.issueId,
          };
          return {
            ...worker,
            periods: [...worker.periods, newPeriod], // 새로운 작업자의 periods 추가
          };
        }
        return worker;
      })
    );
  
    // 새로운 이슈 생성 (추가 모드)
  if (!isEditMode) {
    const newIssueId =
      issuesState.length > 0
        ? Math.max(...issuesState.map((issue) => issue.issueId)) + 1
        : 1;

    const newIssue = {
      ...editedIssue,
      issueId: newIssueId,
      projectId: projectId || ""
    };

    // 이슈 상태 업데이트 (새로운 이슈 추가)
    setIssuesState(prevIssues => [...prevIssues, newIssue]);
  } 
  // 수정 모드 처리 (기존 이슈 수정)
  else {
    setIssuesState(prevIssues =>
      prevIssues.map(issue =>
        issue.issueId === editedIssue.issueId ? editedIssue : issue
      )
    );
  }

  // 이슈 저장 후 초기화 (추가 모드일 때만 초기화)
  if (!isEditMode) {
    setEditedIssue({
      title: "",
      status: "",
      description: "",
      workerId: null,
      startDate: "",
      days: 0,
      endDate: "",
      actRate: "",
      expRate: "",
      projectId: projectId || ""
    });
  }

  onSave(editedIssue);
  onClose();
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
              <option value="" disabled>작업자 선택</option>
              
              {/* ✅ 기존 작업자가 해당 이슈를 처리 못하는 경우, select의 최상단에 표시 (비활성화) */}
              {!availableWorkers.some(worker => worker.id === editedIssue.workerId) && editedIssue.workerId && (
                <option value={editedIssue.workerId} disabled>
                  {workersState.find(worker => worker.id === editedIssue.workerId)?.name || "작업자 없음 (비활성화)"}
                </option>
              )}

              {/* ✅ 사용 가능한 작업자 목록 */}
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