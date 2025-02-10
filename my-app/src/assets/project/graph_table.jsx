import React from "react";

function GraphTable({ items, calculateMonths }) {
  return (
    <table className="graph-table">
      <thead>
        <tr>
          <th>프로젝트명</th>
          {Array.from({ length: 12 }).map((_, index) => (
            <th key={index}>{index + 1}월</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const { startMonth, endMonth } = calculateMonths(item.startDate, item.endDate);
          const progress = item.progress; // 프로젝트 진행률 (0~100%)

          return (
            <tr key={index}>
              <td>{item.name}</td>
              {Array.from({ length: 12 }).map((_, monthIndex) => {
                let greenWidth = 0;

                if (monthIndex >= startMonth && monthIndex < endMonth) {
                  const totalMonths = endMonth - startMonth; // 총 기간  
                  const progressFraction = progress / 100; // 진행률의 비율 66%
                  const progressPerMonth = progressFraction * totalMonths; // 전체 진행률 기준 월별 할당률 1.98

                  // 현재 칸의 진행률 계산
                  const passedMonths = monthIndex - startMonth; // 현재 칸까지 지난 월 수
                  const remainingProgress = progressPerMonth - passedMonths;

                  if (remainingProgress > 1) {
                    greenWidth = 100; // 해당 월이 100% 다 칠해져야 함
                  } else if (remainingProgress > 0) {
                    greenWidth = remainingProgress * 100; // 남은 진행률만큼 칠함
                  }
                }

                const getCellStyle = () => {
                  if (monthIndex >= startMonth && monthIndex < endMonth) {
                    return {
                      background: `linear-gradient(to right, green ${greenWidth}%, yellow 0%)`,
                    };
                  }
                  return { background: "white" }; 
                };

                return (
                  <td
                    key={monthIndex}
                    className={monthIndex >= startMonth && monthIndex < endMonth ? "active" : ""}
                    style={getCellStyle()}
                  ></td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default GraphTable;