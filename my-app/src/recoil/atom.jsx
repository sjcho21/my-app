import { atom } from 'recoil';

//Data Table 헤더
export const header = atom({
  key: 'header',
  default: [
    { text: "구분", value: "division" },
    { text: "프로젝트명", value: "name" },
    { text: "거래처", value: "client" },
    { text: "시작일", value: "startDate" },
    { text: "투입기간 (MD)", value: "term" },
    { text: "진행률 (%)", value: "progress" },
    { text: "담당자", value: "manager" },
    { text: "이슈", value: "issue" }
  ]
});

//담당자 목록
export const managersState = atom({
  key: 'managersState',
  default: ['메니져1', '메니져2', '메니져3', '메니져4']
});

//작업자 목록
export const workersState = atom({
  key: "workersState",
  default: [
    { id: 1, name: "홍길동", periods: [] },
    { id: 2, name: "박지현", periods: [] },
    { id: 3, name: "김철수", periods: [] }, 
    { id: 4, name: "이영희", periods: [] }
  ],
});


//프로젝트 데이터
export const project = atom({
  key: "project", 
  default: [
    {
      projectId: 1,
      division: "리서치",
      name: "프로젝트 A",
      client: "고객사 A",
      manager: "매니져2"
    },
    {
      projectId: 2,
      division: "리서치",
      name: "프로젝트 B",
      client: "고객사 B",
      manager: "매니져4"
    },
  ],
});


// IssuesState: 작업자 정보 포함
export const issuesState = atom({
  key: "issuesState",
  default: [ ],
});

//현재 수정중인 이슈
export const editedIssueState = atom({
  key: "editedIssueState",
  default: {
    title: "",
    status: "",
    description: "",
    workerId: null,
    startDate: "",
    days: 0,
    endDate: "",
    actRate: "",
    expRate: "",
    projectId: "",
  },
});

//현재 선택된 프로젝트
export const selectedProjectState = atom({
  key: "selectedProjectState",
  default: {}
})

//현재 선택된 이슈
export const selectedIssueState = atom({
  key: "selectedIssueId",
  default: {}
})