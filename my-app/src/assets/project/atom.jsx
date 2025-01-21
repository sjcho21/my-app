import { atom } from 'recoil';

//Data Table 헤더
export const headers = atom({
  key: 'headers',
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

//작업자 목록
export const workersState = atom({
  key: 'workersState',
  default: ['홍길동', '김철수', '이영희', '박진형'], // 작업자 목록
});