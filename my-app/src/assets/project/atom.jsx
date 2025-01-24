import { atom } from 'recoil';

//Data Table 헤더
export const header = atom({
  key: 'header',
  default: [
    { text: "구분", value: "division" },
    { text: "프로젝트명", value: "name" },
    { text: "거래처", value: "client" },
    { text: "시작일", value: "startDate" },
    { text: "투입기간", value: "term" },
    { text: "진행률", value: "progress" },
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
    { name: "홍길동", startDate: "2025-01-10", endDate: "2025-01-20" },
    { name: "박지현", startDate: "2025-01-15", endDate: "2025-01-25" },
    { name: "김철수", startDate: "", endDate: "" }, 
    { name: "이영희", startDate: "2025-01-05", endDate: "2025-01-12" },
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
      startDate: "2020.01.03",
      term: "90",
      progress: "45%",
      manager: "박진형",
      issues: [
        { id: 1, title: "이슈1", status: "진행 중", description: "서비스 속도 개선", startDate:"2022.01.05" },
        { id: 2, title: "이슈2", status: "완료", description: "UI 크기 조절", startDate:"2022.01.09" },
        { id: 3, title: "이슈3", status: "완료", description: "UI 넓이 조절", startDate:"2022.01.04" },
      ],
    },
    {
      division: "리서치",
      name: "프로젝트 B",
      client: "고객사 B",
      startDate: "2020.04.03",
      term: "120",
      progress: "45%",
      manager: "박진형",
      issues: [
        { id: 1, title: "이슈1", status: "진행 중", description: "서비스 속도 개선",startDate:"2022.01.04"  },
        { id: 2, title: "이슈2", status: "완료", description: "UI 크기 조절",startDate:"2022.01.04"  },
        { id: 3, title: "이슈3", status: "완료", description: "UI 넓이 조절",startDate:"2022.01.04"  },
      ],
    },
  ],
});

