window.onload = function() {
    // 탭 클릭 시 해당 섹션 표시
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    // 기본적으로 첫 번째 탭과 콘텐츠 활성화
    tabs[0].classList.add("active");
    tabContents[0].classList.add("active");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function () {
            // 모든 탭과 섹션에서 'active' 클래스 제거
            tabs.forEach(tab => tab.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // 클릭한 탭과 해당 섹션에 'active' 클래스 추가
            tab.classList.add("active");
            tabContents[index].classList.add("active");
        });
    });

    // 알레르기 체크박스 클릭 시 알레르기 입력 필드 토글
    const allergyCheckbox = document.getElementById("noAllergy");
    const allergyInputField = document.getElementById("allergy-section");

    allergyCheckbox.addEventListener("change", function() {
        if (this.checked) {
            allergyInputField.style.display = "none";
        } else {
            allergyInputField.style.display = "block";
        }
    });

    // 입력 필드의 값이 변경될 때마다 validateFields 호출
    const fields = ["age", "weight", "height", "gender", "activity", "goal"];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener("input", validateFields);
        }
    });

    // 저장 버튼 클릭 시 실행되는 함수
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function() {
        // 필드 검증 후 저장 및 페이지 이동
        if (validateFields()) {  // validateFields가 true를 반환하면 저장
            console.log("Save button clicked!");  // 콘솔에 로그로 출력 (확인용)

            // 메시지를 화면에 표시
            const messageContainer = document.getElementById("messageContainer");
            if (messageContainer) {
                messageContainer.textContent = "저장되었습니다!";  // 메시지 설정
                messageContainer.style.color = "green";  // 메시지 색상 (optional)
                messageContainer.style.fontSize = "16px";  // 글자 크기 (optional)
            }

            // 저장 함수 호출
            saveAllInfo();

            // diet_request.html로 이동
            window.location.href = "diet_request.html";
        } else {
            alert("모든 필드를 올바르게 입력해주세요.");
        }
    });
};

// 입력값이 모두 채워졌는지 확인하는 함수
function validateFields() {
    const ageElement = document.getElementById("age");
    const weightElement = document.getElementById("weight");
    const heightElement = document.getElementById("height");
    const genderElement = document.getElementById("gender");
    const activityElement = document.getElementById("activity");
    const allergyElement = document.getElementById("allergy");
    const noAllergyElement = document.getElementById("noAllergy");
    const goalElement = document.getElementById("dietGoal");

    // 필드 값 가져오기
    const age = ageElement ? ageElement.value.trim() : '';
    const weight = weightElement ? weightElement.value.trim() : '';
    const height = heightElement ? heightElement.value.trim() : '';
    const gender = genderElement ? genderElement.value.trim() : '';
    const activity = activityElement ? activityElement.value.trim() : '';
    const allergy = allergyElement ? allergyElement.value.trim() : '';
    const noAllergy = noAllergyElement ? noAllergyElement.checked : false;
    const goal = goalElement ? goalElement.value.trim() : '';

let isValid = true;

    // 필드별로 유효성 검사
    if (!age) {
        console.log("Age is required.");
        isValid = false;
    }
    if (!weight) {
        console.log("Weight is required.");
        isValid = false;
    }
    if (!height) {
        console.log("Height is required.");
        isValid = false;
    }
    if (!gender) {
        console.log("Gender is required.");
        isValid = false;
    }
    if (!activity) {
        console.log("Activity level is required.");
        isValid = false;
    }
    if (!goal) {
        console.log("Diet goal is required.");
        isValid = false;
    }
    if (!noAllergy && !allergy) {
        console.log("Allergy is required if 'No Allergy' is not checked.");
        isValid = false;
    }

    return isValid;

    // 필수 입력값이 모두 채워졌는지 확인
    const isAllFieldsValid = (
        age && weight && height && gender && activity && goal &&
        (noAllergy || (allergy && allergy.trim() !== ''))  // 알레르기 없음 체크 또는 알레르기 값이 입력됨
    );

    return isAllFieldsValid;  // 모든 필드가 유효하면 true 반환
}

// 모든 정보를 로컬스토리지에 저장하는 함수
function saveAllInfo() {
    const ageElement = document.getElementById("age");
    const genderElement = document.getElementById("gender");
    const weightElement = document.getElementById("weight");
    const heightElement = document.getElementById("height");
    const activityElement = document.getElementById("activity");
    const allergyElement = document.getElementById("allergy");
    const noAllergyElement = document.getElementById("noAllergy");
    const dietGoalElement = document.getElementById("dietGoal");

    // null 체크 후 값 가져오기
    const age = ageElement ? ageElement.value.trim() : '';
    const gender = genderElement ? genderElement.value.trim() : '남자';
    const weight = weightElement ? weightElement.value.trim() : '';
    const height = heightElement ? heightElement.value.trim() : '';
    const activity = activityElement ? activityElement.value.trim() : '거의 운동하지 않음';
    const allergy = allergyElement ? allergyElement.value.trim() : '';
    const noAllergy = noAllergyElement ? noAllergyElement.checked : false;
    const dietGoal = dietGoalElement ? dietGoalElement.value.trim() : '체중 감량';

    const userInfo = {
        age: age,
        gender: gender,
        weight: weight,
        height: height,
        activity: activity,
        allergy: noAllergy ? null : allergy, // 알레르기 없음 체크시 null 처리
        noAllergy: noAllergy,
        dietGoal: dietGoal,
    };

    // 로컬 스토리지에 저장
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    // 저장 후 알림 메시지 표시
    document.getElementById("alertMessage").textContent = "사용자 정보가 저장되었습니다.";

    setTimeout(function () {
        document.getElementById("alertMessage").textContent = "";
    }, 3000);
}
