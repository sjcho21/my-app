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
    { text: "이슈", value: "issue" },
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
    { id: 1, name: "홍길동", periods: [{ startDate: "2025-02-02", endDate: "2025-02-05" }] },
    { id: 2, name: "박지현", periods: [{ startDate: "2025-02-15", endDate: "2025-02-25" }] },
    { id: 3, name: "김철수", periods: [] }, // 할당된 프로젝트가 없음
    { id: 4, name: "이영희", periods: [{ startDate: "2025-02-01", endDate: "2025-02-12" }] },
  ],
});


//프로젝트 데이터
export const project = atom({
  key: "project", 
  default: [
    {
      division: "리서치",
      name: "프로젝트 A",
      client: "고객사 A",
      term: "90",
      manager: "매니져A",
      issues: [ ],
    },
    {
      division: "리서치",
      name: "프로젝트 B",
      client: "고객사 B",
      term: "120",
      manager: "매니져B",
      issues: [ ],
    },
  ],
});

