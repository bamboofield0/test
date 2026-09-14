const submit = document.querySelector("button");

const name = document.querySelector("#name");
const birth = document.querySelector("#birth");
const mail = document.querySelector("#mail");
const number = document.querySelector("#number");
const code = document.querySelector("#code");
const payment = document.querySelector("#payment");
const agree = document.querySelector("#agree");

const error = document.querySelector("#error");

// ボタンが逃げた回数
let moveCount = 0;
const maxMoves = 100;


// 入力内容がすべて正しいか判定する
function isFormValid() {

    if (name.value === "") {
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(birth.value)) {
        return false;
    }

    if (!mail.value.includes("@")) {
        return false;
    }

    if (!/^\d{3}-\d{4}-\d{4}$/.test(number.value)) {
        return false;
    }

    if (!/^\d{3}-\d{4}$/.test(code.value)) {
        return false;
    }

    if (
        payment.value !== "credit card" &&
        payment.value !== "paypal" &&
        payment.value !== "banking"
    ) {
        return false;
    }

    if (agree.value !== "agree") {
        return false;
    }

    return true;
}


// すべての入力をリセットする
function resetAll() {
    name.value = "";
    birth.value = "";
    mail.value = "";
    number.value = "";
    code.value = "";
    payment.value = "";
    agree.value = "";
}


// 入力が変更されたら、ボタンが逃げられる状態か確認
const inputs = [
    name,
    birth,
    mail,
    number,
    code,
    payment,
    agree
];

inputs.forEach(function (input) {

    input.addEventListener("input", function () {

        if (isFormValid()) {
            submit.classList.add("ready");
        } else {
            submit.classList.remove("ready");
        }

    });

});


// submitボタンを押したとき
submit.addEventListener("click", function () {

    error.textContent = "";

    // name
    if (name.value === "") {
        error.textContent = "Name is required.";
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // birth
    if (!/^\d{2}\/\d{2}$/.test(birth.value)) {
        error.textContent = "Birth must be in the format mm/dd.";
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // mail
    if (!mail.value.includes("@")) {
        error.textContent = "Mail must contain @.";
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // number
    if (!/^\d{3}-\d{4}-\d{4}$/.test(number.value)) {
        error.textContent = "Number must be in the format 000-0000-0000.";
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // postal code
    if (!/^\d{3}-\d{4}$/.test(code.value)) {
        error.textContent = "Postal code must be in the format 000-0000.";
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // payment
    if (
        payment.value !== "credit card" &&
        payment.value !== "paypal" &&
        payment.value !== "banking"
    ) {
        error.textContent = "Payment must be credit card, paypal, or banking.";
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // policy
    if (agree.value !== "agree") {
        error.textContent = 'You must type "agree".';
        resetAll();
        submit.classList.remove("ready");
        return;
    }

    // すべて正しい場合
    error.textContent = "Success!";
});


// マウスがボタンの20px以内に近づいたら逃げる
document.addEventListener("mousemove", function (event) {

    // 入力にエラーがある場合、逃げない
    if (!isFormValid()) {
        return;
    }

    // 100回逃げたら、それ以上逃げない
    if (moveCount >= maxMoves) {
        return;
    }

    const rect = submit.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // マウスとボタン中心の距離
    const distance = Math.sqrt(
        (event.clientX - centerX) ** 2 +
        (event.clientY - centerY) ** 2
    );

    // ボタンの半径 + 20px以内なら逃げる
    const buttonRadius = Math.max(rect.width, rect.height) / 2;

    if (distance <= buttonRadius + 20) {

        const maxDistance = 200;

        // 画面端からの距離
        const edgeDistance = Math.min(
            centerX,
            window.innerWidth - centerX,
            centerY,
            window.innerHeight - centerY
        );

        let directionX;
        let directionY;

        if (edgeDistance <= 30) {

            // 画面端30px以内なら中央へ逃げる
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            directionX = screenCenterX - centerX;
            directionY = screenCenterY - centerY;

        } else {

            // カーソルから遠ざかる
            directionX = centerX - event.clientX;
            directionY = centerY - event.clientY;
        }

        // ベクトルの長さ
        const length = Math.sqrt(
            directionX ** 2 +
            directionY ** 2
        );

        // 方向を正規化
        directionX /= length;
        directionY /= length;

        // 200px逃げる
        const newCenterX =
            centerX + directionX * maxDistance;

        const newCenterY =
            centerY + directionY * maxDistance;

        // 画面外に出ないようにする
        const newX = Math.max(
            0,
            Math.min(
                newCenterX - rect.width / 2,
                window.innerWidth - rect.width
            )
        );

        const newY = Math.max(
            0,
            Math.min(
                newCenterY - rect.height / 2,
                window.innerHeight - rect.height
            )
        );

        submit.style.position = "fixed";
        submit.style.left = newX + "px";
        submit.style.top = newY + "px";

        // 逃走回数を1増やす
        moveCount++;
    }
});