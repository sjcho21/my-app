import { atom } from 'recoil';


// 이슈 모달 상태
export const issueModalState = atom({
  key: "issueModalState", // 고유 키
  default: {
    isOpen: false, // 모달 열림 상태
    mode: "view", // view | edit | add
    selectedIssue: null, // 선택된 이슈 데이터
    projectId: null, // 이슈가 속한 프로젝트 ID
  },
});

//작업자 목록
export const workersState = atom({
  key: 'workersState',
  default: ['홍길동', '김철수', '이영희', '박진형'], // 작업자 목록
});