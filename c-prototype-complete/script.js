document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 要素の取得
    // ----------------------------------------------------
    const formFirst = document.getElementById('form-first');
    const formLast = document.getElementById('form-last');
    const formBirth = document.getElementById('form-birth');
    const formMail = document.getElementById('form-mail');
    const formTel = document.getElementById('form-tel');
    const formPost = document.getElementById('form-post');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const agreeCheckbox = document.getElementById('checkbox');
    const submitBoolean = document.getElementById('submit-boolean');

    // ----------------------------------------------------
    // エラー表示用CSSの自動挿入
    // ----------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: var(--color-q, #ff4d4d);
            font-size: 0.8em;
            margin-top: 4px;
            margin-right: 1em;
            display: block;
        }

        /* 1. テキスト入力欄用（border スタイル） */
        .input-line.input-error {
            border: 2px solid var(--color-q, #ff4d4d) !important;
            border-radius: 10px;
        }

        /* 2. 支払い方法（ラジオボタン）用（outline スタイル） */
        .radio-cont.input-error {
            outline: 2px solid var(--color-q, #ff4d4d) !important;
            outline-offset: 5px;
            border-radius: 10px;
        }

        /* 3. 規約同意（チェックボックス）用（outline スタイル） */
        .agreement-line.input-error {
            outline: 2px solid var(--color-q, #ff4d4d) !important;
            outline-offset: -2px;
            border-radius: 10px;
        }
    `;
    document.head.appendChild(style);

    // ----------------------------------------------------
    // 1. 各フォーマットに応じた入力制御
    // ----------------------------------------------------
    
    // 生年月日: 数字以外の文字（/ 以外）を削除
    formBirth.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9/]/g, '');
    });

    // 生年月日: / 自動挿入
    formBirth.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') return;
        if (/^[0-9]$/.test(e.key)) {
            const len = formBirth.value.length;
            if (len === 4 || len === 7) formBirth.value += '/';
        }
    });

    // 郵便番号: - 自動挿入
    formPost.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') return;
        if (/^[0-9]$/.test(e.key)) {
            if (formPost.value.length === 3) formPost.value += '-';
        }
    });

    // 電話番号: - 自動挿入
    formTel.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') return;
        if (/^[0-9]$/.test(e.key)) {
            const len = formTel.value.length;
            if (len === 3 || len === 8) formTel.value += '-';
        }
    });

    // ----------------------------------------------------
    // 2. エラーメッセージ・赤枠表示ユーティリティ
    // ----------------------------------------------------
    function showError(element, message, customTargetClass) {
        const parentBox = element.closest('.input-box-cont') || 
                          element.closest('.radio-box-cont') || 
                          element.closest('.agreement-line');
        if (!parentBox) return;

        let errorSpan = parentBox.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            parentBox.appendChild(errorSpan);
        }
        errorSpan.textContent = message;

        let targetLine;
        if (customTargetClass) {
            targetLine = element.closest(customTargetClass) || parentBox.querySelector(customTargetClass);
        } else {
            targetLine = parentBox.querySelector('.input-line') || parentBox.querySelector('.radio-cont') || parentBox;
        }

        if (targetLine) targetLine.classList.add('input-error');
    }

    function clearError(element, customTargetClass) {
        const parentBox = element.closest('.input-box-cont') || 
                          element.closest('.radio-box-cont') || 
                          element.closest('.agreement-line');
        if (!parentBox) return;

        const errorSpan = parentBox.querySelector('.error-message');
        if (errorSpan) errorSpan.remove();

        let targetLine;
        if (customTargetClass) {
            targetLine = element.closest(customTargetClass) || parentBox.querySelector(customTargetClass);
        } else {
            targetLine = parentBox.querySelector('.input-line') || parentBox.querySelector('.radio-cont') || parentBox;
        }

        if (targetLine) targetLine.classList.remove('input-error');
    }

    // ----------------------------------------------------
    // 3. 各項目の検証関数
    // ----------------------------------------------------
    function validateFirst() {
        if (!formFirst.value.trim()) {
            showError(formFirst, 'First name is required.');
            return false;
        }
        clearError(formFirst);
        return true;
    }

    function validateLast() {
        if (!formLast.value.trim()) {
            showError(formLast, 'Family name is required.');
            return false;
        }
        clearError(formLast);
        return true;
    }

    function validateBirth() {
        const val = formBirth.value.trim();
        const birthRegex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;
        if (!val) {
            showError(formBirth, 'Birth date is required.');
            return false;
        }
        if (!birthRegex.test(val)) {
            showError(formBirth, 'Please enter date in yyyy/mm/dd format.');
            return false;
        }
        const [year, month, day] = val.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
            showError(formBirth, 'Please enter a valid date.');
            return false;
        }
        clearError(formBirth);
        return true;
    }

    function validateMail() {
        const val = formMail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) {
            showError(formMail, 'Email address is required.');
            return false;
        }
        if (!emailRegex.test(val)) {
            showError(formMail, 'Please enter a valid email address.');
            return false;
        }
        clearError(formMail);
        return true;
    }

    function validateTel() {
        const val = formTel.value.trim();
        const telRegex = /^\d{2,4}-\d{2,4}-\d{4}$/;
        if (!val) {
            showError(formTel, 'Phone number is required.');
            return false;
        }
        if (!telRegex.test(val)) {
            showError(formTel, 'Please enter a valid phone number.');
            return false;
        }
        clearError(formTel);
        return true;
    }

    function validatePost() {
        const val = formPost.value.trim();
        const postRegex = /^\d{3}-\d{4}$/;
        if (!val) {
            showError(formPost, 'Postal code is required.');
            return false;
        }
        if (!postRegex.test(val)) {
            showError(formPost, 'Please enter postal code in 000-0000 format.');
            return false;
        }
        clearError(formPost);
        return true;
    }

    function validatePayment() {
        const isSelected = Array.from(paymentRadios).some(radio => radio.checked);
        if (!isSelected) {
            // ラジオボタンコンテナ (.radio-cont) に outline 枠線を適用
            showError(paymentRadios[0], 'Please select a payment method.', '.radio-cont');
            return false;
        }
        clearError(paymentRadios[0], '.radio-cont');
        return true;
    }

    function validateAgreement() {
        if (!agreeCheckbox.checked) {
            // 規約同意ライン (.agreement-line) に outline 枠線を適用
            showError(agreeCheckbox, 'You must agree to the Privacy Policy.', '.agreement-line');
            return false;
        }
        clearError(agreeCheckbox, '.agreement-line');
        return true;
    }

    // ----------------------------------------------------
    // 4. イベントハンドラー（blurで検証、focusでエラー削除）
    // ----------------------------------------------------
    const inputsWithValidation = [
        { element: formFirst, validate: validateFirst },
        { element: formLast, validate: validateLast },
        { element: formBirth, validate: validateBirth },
        { element: formMail, validate: validateMail },
        { element: formTel, validate: validateTel },
        { element: formPost, validate: validatePost }
    ];

    inputsWithValidation.forEach(({ element, validate }) => {
        element.addEventListener('blur', validate);
        element.addEventListener('focus', () => clearError(element));
    });

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', validatePayment);
        radio.addEventListener('focus', () => clearError(paymentRadios[0], '.radio-cont'));
    });

    agreeCheckbox.addEventListener('change', validateAgreement);
    agreeCheckbox.addEventListener('focus', () => clearError(agreeCheckbox, '.agreement-line'));

    // ----------------------------------------------------
    // 5. #submit-boolean のチェック監視（送信時バリデーション＆スクロール）
    // ----------------------------------------------------
    submitBoolean.addEventListener('change', () => {
        if (submitBoolean.checked) {
            const validations = [
                { isValid: validateFirst(), element: formFirst },
                { isValid: validateLast(), element: formLast },
                { isValid: validateBirth(), element: formBirth },
                { isValid: validateMail(), element: formMail },
                { isValid: validateTel(), element: formTel },
                { isValid: validatePost(), element: formPost },
                { isValid: validatePayment(), element: paymentRadios[0] },
                { isValid: validateAgreement(), element: agreeCheckbox }
            ];

            const firstError = validations.find(v => !v.isValid);

            if (firstError) {
                submitBoolean.checked = false;

                const targetBox = firstError.element.closest('.input-box-cont') || 
                                  firstError.element.closest('.radio-box-cont') || 
                                  firstError.element.closest('.agreement-line');

                if (targetBox) {
                    targetBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
});