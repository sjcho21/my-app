import { selector } from "recoil";
import { workersState, editedIssueState } from "./atom";

export const availableWorkersState = selector({
  key: "availableWorkersState",
  get: ({ get }) => {
    console.log("🔄 작업자 필터링 재계산 중...");
    
    const startDate = get(editedIssueState).startDate;
    const endDate = get(editedIssueState).endDate;
    const issueId = get(editedIssueState).issueId;

    if (!startDate || !endDate) return [];

    const issueStart = new Date(startDate);
    const issueEnd = new Date(endDate);

    return get(workersState).filter(worker =>
      worker.periods.every(({ startDate, endDate, issueId: wIssueId }) => {
        if (wIssueId === issueId) return true;
        const workerStart = new Date(startDate);
        const workerEnd = new Date(endDate);
        return issueEnd < workerStart || issueStart > workerEnd;
      })
    );
  },
});