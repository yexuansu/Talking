// 验证是否有登录，如果没有，跳转到登录界面；如果有登录，显示登录的用户信息
(async function () {
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        alert('登录已过期，请重新登录');
        location.href = './login.html';
        return;
    }

    // 下面的代码一定是在登录状态下进行

    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        container: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        msgContainer: $('.msg-container'),
    };
    // 设置用户信息
    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }
    setUserInfo();

    // 注销事件
    doms.close.onclick = function () {
        API.loginOut();
        location.href = './login.html';
    };

    // 聊天记录
    // content: "你好"
    // createdAt: 1671506025342
    // from: "qwe"
    // to: null

    function addChat(chatInfo) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.from) {
            div.classList.add('me');
        }

        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;

        const data = $$$('div');
        data.className = ('chat-date');
        data.innerText = formData(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(data);
        doms.container.appendChild(div);
    }

    // 修改时间戳函数
    function formData(timestamp) {
        const data = new Date(timestamp);
        const year = data.getFullYear();
        const month = (data.getMonth() + 1).toString().padStart(2, '0');
        const day = data.getDate().toString().padStart(2, '0');
        const hour = data.getHours().toString().padStart(2, '0');
        const minute = data.getMinutes().toString().padStart(2, '0');
        const second = data.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
    }

    // addChat({
    //     content: "你好",
    //     createdAt: 1671506025342,
    //     from: "qwe",
    //     to: null
    // });

    // 记载历史纪录
    loadHistory();
    async function loadHistory() {
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item);
        }
        scrollButton();
    }

    // 让聊天区域的滚动条滚动到底
    function scrollButton() {
        doms.container.scrollTop = doms.container.scrollHeight;
    }

    // 发送消息
    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
            content,
        });
        doms.txtMsg.value = '';
        scrollButton();
        const resp = await API.sendChat(content);
        console.log(resp);
    }

    // 提交事件
    doms.msgContainer.onsubmit = function (e) {
        e.preventDefault();
        sendChat();
    };
})();