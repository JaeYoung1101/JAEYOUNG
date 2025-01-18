// main.js

const poolData = {
    UserPoolId: '*********************', // 사용자 풀 ID
    ClientId: '**************************', // 클라이언트 ID
};

function main() {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser(); 

    const currentUserData = {};

    if (cognitoUser != null) {
        cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
                console.log(err || 'Session invalid');
                localStorage.setItem('isLoggedIn', 'false'); // 세션 오류 시 로그인 상태 false로 설정
                location.href = "login.html"; // 세션 오류가 있으면 로그인 페이지로 리디렉션
            } else {
                cognitoUser.getUserAttributes((err, result) => {
                    if (err) {
                        location.href = "login.html"; // 사용자 정보 오류 시 로그인 페이지로 리디렉션
                    } 

                    for (let i = 0; i < result.length; i++) {
                        currentUserData[result[i].getName()] = result[i].getValue();
                    }

                    document.getElementById("email").value = currentUserData["email"];

                    const signoutButton = document.getElementById("signout");
                    signoutButton.addEventListener("click", event => {
                        cognitoUser.signOut();
                        localStorage.removeItem('isLoggedIn'); // 로그아웃 시 localStorage에서 제거
                        localStorage.removeItem('username');
                        location.reload();
                    });
                    signoutButton.hidden = false;
                });
            }
        });
    } else {
        location.href = "login.html"; // 로그인 상태가 없으면 로그인 페이지로 리디렉션
    }
}

// signup.html
function SignUp() {
    var username = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // 이메일 속성을 추가합니다.
    var attributeList = [];
    var dataEmail = {
        Name: 'email',
        Value: username
    };
    
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(username, password, attributeList, null, function(err) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        window.location.href = 'confirm.html';
    });
}

// confirm.html
function ConfirmRegistration() {
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var username = document.getElementById("email").value;
    var code = document.getElementById("ConfirmCode").value;
    var userData = {
        Username: username,
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('call result: ' + result);
        window.location.href = 'login.html';      
    });
}

// login.html
function Login() {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var username = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var authenticationData = {
        Username: username,
        Password: password,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userData = {
        Username: username,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var idToken = result.getIdToken().getJwtToken();          // ID 토큰
            var accessToken = result.getAccessToken().getJwtToken();  // 액세스 토큰
            var refreshToken = result.getRefreshToken().getToken();   // 갱신 토큰

            console.log("idToken : " + idToken);
            console.log("accessToken : " + accessToken);
            console.log("refreshToken : " + refreshToken);

            // 로그인 상태 저장
            localStorage.setItem('isLoggedIn', 'true'); // sessionStorage에서 localStorage로 변경
            localStorage.setItem('username', username);

            // 로그인 성공 시 user_info.html로 리디렉션
            window.location.href = 'user_info.html';  // 여기서 user_info.html로 이동
        },

        onFailure: function(err) {
            // 로그인에 실패 했을 경우 에러 메시지 표시
            console.log(err);
            alert("로그인 실패")
        }
    });
}
