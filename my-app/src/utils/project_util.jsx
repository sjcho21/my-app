export const calculateProjectMetrics = (projectId, issues) => {
    const projectIssues = issues.filter(issue => issue.projectId === projectId);
  
    // 프로젝트 시작일 계산
    const updatedStartDate = projectIssues.length > 0
      ? projectIssues
          .map(issue => new Date(issue.startDate))
          .reduce((earliest, current) => (current < earliest ? current : earliest))
          .toISOString()
          .split("T")[0]
      : null;
  
    // 프로젝트 종료일 계산
    const updatedEndDate = projectIssues.length > 0
      ? projectIssues
          .map(issue => new Date(issue.endDate))
          .reduce((latest, current) => (current > latest ? current : latest))
          .toISOString()
          .split("T")[0]
      : null;
  
    // 총 작업 일수 계산
    const totalDays = projectIssues.reduce((sum, issue) => sum + (parseInt(issue.days, 10) || 0), 0);
  
    // 전체 진행률 계산
    const overallProgress = calculateOverallProgress(projectIssues);
  
    return {
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      term: totalDays,
      progress: overallProgress,
    };
  };
  
  // 이슈들의 평균 진행률 계산
  export const calculateOverallProgress = (issues) => {
    if (issues.length === 0) return 0;
  
    let totalProgress = 0;
    let totalDays = 0;
  
    issues.forEach((issue) => {
      const days = Number(issue.days);
      if (!days || days <= 0) return;
  
      totalProgress += issue.expRate * days;
      totalDays += days;
    });
  
    return totalDays === 0 ? 0 : Math.floor(totalProgress / totalDays);
  };
  