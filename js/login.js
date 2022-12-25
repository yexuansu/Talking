// 针对用户的规则
const loginId = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
});

// 针对密码的规则
const loginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
});

// form表单的提交事件
const forms = $('.user-form');
forms.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validatorX(loginId, loginPwd);
    if (!result) {
        return;// 验证未通过
    }
    // 浏览器提供的一个构造函数，专门用来组装表单数据，表达的意思是：传入表单dom，得到一个表单数据对象
    // const formData = new FormData(form);
    // window.formData = formData;
    // console.log(formData);

    const data = {
        loginId: loginId.input.value,
        loginPwd: loginPwd.input.value,
    };
    const resp = await API.login(data);
    if (resp.code === 0) {
        alert('登录成功，跳转到首页');
        location.href = './index.html';
    } else {
        loginId.p.innerText = '账号或密码错误';
        loginPwd.input.value = '';
    }
};