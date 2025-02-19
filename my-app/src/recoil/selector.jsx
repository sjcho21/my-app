import { selector } from "recoil";
import { workersState, editedIssueState } from "./atom";

// 작업 가능한 작업자 목록 (자동 계산)
export const availableWorkersState = selector({
  key: "availableWorkersState",
  get: ({ get }) => {
    
    const workers = get(workersState);
    const { startDate, endDate, issueId } = get(editedIssueState);
    
    if (!startDate || !endDate) return [];

    const issueStart = new Date(startDate);
    const issueEnd = new Date(endDate);

    return workers.filter(worker =>
      worker.periods.every(({ startDate, endDate, issueId: wIssueId }) => {
        if (wIssueId === issueId) return true;
        const workerStart = new Date(startDate);
        const workerEnd = new Date(endDate);
        return issueEnd < workerStart || issueStart > workerEnd;
      })
    );
  },
});