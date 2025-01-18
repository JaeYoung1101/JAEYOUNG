// 식사 기록 저장 함수
function saveMealRecord() {
    const meal = document.getElementById("meal").value;

    // 기존 기록 가져오기 (없으면 빈 배열)
    let mealRecords = JSON.parse(localStorage.getItem("mealRecords") || "[]");
    mealRecords.push(meal);  // 새로운 기록 추가
    localStorage.setItem("mealRecords", JSON.stringify(mealRecords));

    // 저장 후 화면 갱신
    displayMealRecords();
}

// 식사 기록 표시 함수
function displayMealRecords() {
    const mealRecordsList = document.getElementById("mealRecordsList");
    const
