// 针对用户的规则
const loginId = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
    const resp = await API.exist(val);
    if (resp.data) {
        // 账号已存在
        return '该账号已被占用，请重新填写';
    }
});

// 针对昵称的规则
const nickname = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称';
    }
});

// 针对密码的规则
const loginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
});

// 针对确认密码的规则
const choosePwd = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请确认密码';
    }
    if (val !== loginPwd.input.value) {
        return '两次密码填写不一致';
    }
});

// form表单的提交事件
const forms = $('.user-form');
forms.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validatorX(loginId, nickname, loginPwd, choosePwd);
    if (!result) {
        return;// 验证未通过
    }
    // 浏览器提供的一个构造函数，专门用来组装表单数据，表达的意思是：传入表单dom，得到一个表单数据对象
    // const formData = new FormData(form);
    // window.formData = formData;
    // console.log(formData);

    const datas = {
        loginId: loginId.input.value,
        nickname: nickname.input.value,
        loginPwd: loginPwd.input.value,
    };
    console.log(datas);
    // const resp = await API.reg(data);

    // const formData = new FormData(forms); // 传入表单dom，得到一个表单数据对象
    // const data = Object.fromEntries(formData.entries());

    // console.log(data);

    const resp = await API.reg(datas);
    if (resp.code === 0) {
        alert('注册成功，点击确定，跳转到登录页');
        location.href = './login.html';
    }
};