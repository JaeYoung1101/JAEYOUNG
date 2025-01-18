document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM이 완전히 로드되었습니다.");

  // 로컬 스토리지에서 사용자 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo) {
    // 사용자 정보를 화면에 표시
    const userInfoDisplay = document.getElementById("userInfoDisplay");
    userInfoDisplay.innerHTML = `
      <p><strong>나이:</strong> ${userInfo.age}</p>
      <p><strong>성별:</strong> ${userInfo.gender}</p>
      <p><strong>체중:</strong> ${userInfo.weight} kg</p>
      <p><strong>키:</strong> ${userInfo.height} cm</p>
      <p><strong>활동 수준:</strong> ${userInfo.activity}</p>
      <p><strong>알레르기:</strong> ${userInfo.noAllergy ? '없음' : userInfo.allergy}</p>
      <p><strong>식단 목표:</strong> ${userInfo.dietGoal}</p>
    `;

    // 서버에 요청하여 추천 식단 받기
    getDietRecommendation(userInfo);
  } else {
    // 사용자 정보가 없으면 경고 메시지
    alert("사용자 정보가 없습니다.");
  }

  // '새로운 식단 추천 받기' 버튼 클릭 시
  document.getElementById("getNewDietBtn").addEventListener("click", function() {
    if (userInfo) {
      getDietRecommendation(userInfo);
    }
  });
});

// 클라이언트에서 ChatGPT API를 호출하는 함수
async function getDietRecommendation(userInfo) {
  console.log("Sending request to the server with userInfo:", userInfo);

  // 사용자 정보를 바탕으로 ChatGPT API 요청을 위한 프롬프트 생성
  const prompt = generateDietPrompt(userInfo);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {  // 엔드포인트 수정
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "***************************************************"  // 실제 API 키로 교체
      },
      body: JSON.stringify({
        model: "gpt-3.5",  // 사용하고자 하는 GPT 모델
        messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
        max_tokens: 1000,  // 결과의 최대 길이 설정
        temperature: 0.7  // 창의성 설정
      })
    });

    // 응답 상태 코드 확인
    if (!response.ok) {
      console.error("Error: Received non-200 status code:", response.status);
      document.getElementById("dietRecommendation").innerHTML = "<p>식단 추천을 불러오는 데 실패했습니다. (서버 응답 오류)</p>";
      return;
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      displayDietRecommendation(data.choices[0].message.content);  // 결과 표시
    } else {
      document.getElementById("dietRecommendation").innerHTML = "<p>식단 추천을 불러오는 데 실패했습니다.</p>";
    }

  } catch (error) {
    console.error("Error fetching diet recommendation:", error);
    document.getElementById("dietRecommendation").innerHTML = "<p>식단 추천을 불러오는 데 실패했습니다. (네트워크 오류)</p>";
  }
}

// 사용자 정보 기반으로 다이어트 추천을 위한 프롬프트 생성 함수
function generateDietPrompt(userInfo) {
  return `
    사용자 정보를 바탕으로 ${userInfo.dietGoal} 목표에 맞는 식단을 추천해 주세요.
    나이: ${userInfo.age}살, 성별: ${userInfo.gender}, 체중: ${userInfo.weight}kg, 키: ${userInfo.height}cm, 
    활동 수준: ${userInfo.activity}, 알레르기: ${userInfo.noAllergy ? "없음" : userInfo.allergy},
    선호하는 식단: ${userInfo.dietGoal}.
  `;
}

// 추천 식단을 화면에 표시하는 함수
function displayDietRecommendation(dietRecommendation) {
  const dietRecommendationDisplay = document.getElementById("dietRecommendation");
  dietRecommendationDisplay.innerHTML = `
    <h3>추천 식단</h3>
    <p>${dietRecommendation}</p>
  `;
}
