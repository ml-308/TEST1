// ================================================================
// 题库数据 — 共 20 题
//   前 13 题：单选题
//   14～15 ：多选题
//   16～20 ：填空题
// ================================================================
const questions = [
    // ---- 单选题（1～13） ----
    { id: 1,  type: '单选题', question: '以下哪条线路使用过混动鼻祖', options: ['11', '56', '67', '138'] },//D
    { id: 2,  type: '单选题', question: '以下哪个车型从未参与过 乐游2线 的运营', options: ['XML6105J18CN', 'XML6125JHEVA5C1', 'TEG6126BEV01', 'TEG6106BEV12'] },//B
    { id: 3,  type: '单选题', question: '以下哪款中车型号在无锡未出现过', options: ['TEG6650BEV02', 'TEG6853BEV05', 'TEG6105BEV39', 'TEG6126BEV01'] },//C
    { id: 4,  type: '单选题', question: '以下哪种车型未服役满 10 年', options: ['XML6105J18CN', 'HFF6101G39C', 'SWB6107Q', 'YS6105G'] },//D
    { id: 5,  type: '单选题', question: '以下哪种车型内电显使用的不是LED', options: ['ZK6856BEVG22L1', 'LCK6850EVG3A11', 'LCK6106EVGRA3', 'ZK6856BEVG4E'] },//A
    { id: 6,  type: '单选题', question: '无锡公交服务电话', options: ['82588088', '85210091', '88220123', '68918088'] },//A
    { id: 7,  type: '单选题', question: '至今为止，以下哪款车型服役时间最长？', options: ['XMQ6119AGN4', 'XML6115J13CN', 'ZK6105CHEVNPG35C', 'XMQ6119G2'] },//D
    { id: 8,  type: '单选题', question: '无锡哪款车型因年检不合格而提前报废', options: ['XML6700J18C', 'XML6125JHEV93C', 'XMQ6119AGN4', 'SLK6119USNHEV03'] },//C
    { id: 9,  type: '单选题', question: '91276报废日期+32年是', options: ['2055', '2056', '2054', '2053'] },//B
    { id: 10, type: '单选题', question: '以下哪条线路在地铁开通后遭到重创', options: ['70', '36', '138', '以上都是'] },//A
    { id: 11, type: '单选题', question: '无锡曾经的12M国六CNG试验车是什么脸型', options: ['金旅切糕（MAN）', '金龙城市之光', '金旅川流', '海格罗卡'] },//C
    { id: 12, type: '单选题', question: '无锡大市中采用潍柴电机的是', options: ['LCK6107PHEVCG21', 'LCK6126FCEVGW1', 'LCK6850EVG3A11', 'LCK6106EVGA3'] },//B
    { id: 13, type: '单选题', question: '无锡以下哪款车型使用了肯维车桥', options: ['TEG6126BEV01', 'TEG6106EHEV17', 'ZK6856BEVG22L1', 'XML6125JHEVA5C1'] },//A
    // ---- 多选题（14～15） ----
    { id: 14, type: '多选题', question: '以下使用过 TEG6105URBEV80 的线路有', options: ['702', '88', '77', '802'] },//ACD
    { id: 15, type: '多选题', question: '以下哪些线路日发班次突破过100班', options: ['16', '20', '53', '106'] },//ABC
    // ---- 填空题（16～20） ----
    { id: 16, type: '填空题', question: '无锡公交哪条线路自从 2015 年就使用XML6115J28C车型至今'},//89
    { id: 17, type: '填空题', question: '无锡公交集团在2024年开通了第一个(   )，揭开了大规模开行微巴的序幕'},//巴士邻居
    { id: 18, type: '填空题', question: '请完整写出下列车辆编号对应的车型名称。93609   _________J____   俗名：_____'},//XML6700 18C 考斯特
    { id: 19, type: '填空题', question: '无锡公交集团在樱花节的支援中，近三年（  ）分公司没有参加过公交一路的支援'},//凤翔
    { id: 20, type: '填空题', question: '请写出苏B93311的车型'}//XML6125JHEV93C
];

// ================================================================
// DOM 引用 — 缓存所有需要操作的页面元素，避免重复查询
// ================================================================
const loginScreen          = document.getElementById('loginScreen');          // 登录页容器
const examScreen           = document.getElementById('examScreen');           // 考试页容器
const loginName            = document.getElementById('loginName');             // 用户名输入框

const loginBtn             = document.getElementById('loginBtn');              // 登录按钮
const loginError           = document.getElementById('loginError');            // 登录错误提示
const studentNameDisplay   = document.getElementById('studentNameDisplay');    // 顶部考生姓名
const themeToggleBtn       = document.getElementById('themeToggleBtn');        // 考试页主题切换
const loginThemeToggle     = document.getElementById('loginThemeToggle');      // 登录页主题切换
const questionIndex        = document.getElementById('questionIndex');         // 题号文字（如"第 1 题 / 共 20 题"）
const questionType         = document.getElementById('questionType');          // 题型文字（如"（单选题）"）
const questionText         = document.getElementById('questionText');          // 题目内容区域
const optionsContainer     = document.getElementById('optionsContainer');      // 选项/答案区域（动态渲染）
const prevBtn              = document.getElementById('prevBtn');               // 上一题按钮
const nextBtn              = document.getElementById('nextBtn');               // 下一题按钮
const markBtn              = document.getElementById('markBtn');               // 标记按钮
const submitBtn            = document.getElementById('submitBtn');             // 交卷按钮
const timerDisplay         = document.getElementById('timerDisplay');          // 计时器显示
const answeredCount        = document.getElementById('answeredCount');         // 已答题数
const totalCount           = document.getElementById('totalCount');            // 总题数
const progressBar          = document.getElementById('progressBar');           // 进度条
const resultModal          = document.getElementById('resultModal');           // 结果弹窗
const closeResultBtn       = document.getElementById('closeResultBtn');        // 关闭结果弹窗
const finalScore           = document.getElementById('finalScore');            // 最终得分
const correctCount         = document.getElementById('correctCount');          // 正确题数
const wrongCount           = document.getElementById('wrongCount');            // 错误题数
const unansweredResultCount= document.getElementById('unansweredResultCount'); // 未答题数
const reviewBtn            = document.getElementById('reviewBtn');             // 查看错题
const restartBtn           = document.getElementById('restartBtn');            // 重新考试

// ================================================================
// 全局状态
// ================================================================
const totalQuestions = questions.length;          // 题目总数
let currentIndex = 0;                             // 当前正在查看的题目索引（0-based）
/**
 * 用户答案列表 — 每道题对应一个对象
 * @type {{ questionId: number, type: string, value: null|number|string|number[] }[]}
 *   单选题 value = 选项索引（0～3）或 null
 *   多选题 value = 选中索引数组（如 [0, 2]）或 []
 *   填空题 value = 输入文本或 ''
 */
const answers = questions.map(q => ({
    questionId: q.id,
    type: q.type,
    value: q.type === '填空题' ? '' : (q.type === '多选题' ? [] : null)
}));
const marked = new Array(totalQuestions).fill(false); // 标记状态（true=已标记）
let examStarted = false;                          // 考试是否已开始
let timerInterval = null;                         // 计时器句柄
let timeRemaining = 30 * 60;                      // 剩余秒数（60 分钟）
let examSubmitted = false;                        // 是否已交卷
let name;                                         // 考生姓名

totalCount.textContent = totalQuestions;          // 在界面中显示总题数

// ================================================================
// 主题切换 — 亮色/暗色模式
// ================================================================

//post
async function Postexam(){

}

/**
 * 获取用户偏好的主题
 * 优先读取 localStorage，其次跟随系统设置
 */
function getPreferredTheme() {
    const saved = localStorage.getItem('exam-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 设置主题并保存到 localStorage
 * @param {'light'|'dark'} theme - 目标主题
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('exam-theme', theme);
}

/** 切换亮/暗主题 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// 应用初始主题
setTheme(getPreferredTheme());

// 绑定主题切换事件
themeToggleBtn.addEventListener('click', toggleTheme);
loginThemeToggle.addEventListener('click', toggleTheme);

// ================================================================
// 登录逻辑 — 输入用户名后进入考试
// ================================================================

loginBtn.addEventListener('click', startExam);
loginName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startExam();
});

/** 开始考试：校验用户名 → 隐藏登录页 → 渲染第一题 → 启动计时器 */
function startExam() {
    name = loginName.value.trim();
    if (!name) {
        loginError.style.display = 'block';
        return;
    }
    loginError.style.display = 'none';
    studentNameDisplay.textContent = name;
    loginScreen.style.display = 'none';
    examScreen.classList.remove('hidden');
    if (!examStarted) {
        examStarted = true;
        renderQuestion(currentIndex);
        startTimer();
    }
}

// ================================================================
// 题目渲染 — 根据题型（单选题/多选题/填空题）动态生成交互控件
// ================================================================

/**
 * 解析题目文本中的空白标记，返回分段数组
 * 空白标记： (   )  （  ）  __+（连续下划线）
 * @param {string} text - 原始题目文本
 * @returns {{ parts: string[], blankCount: number }}
 *   parts        — 按空白分割后的文本段（交替：文本, 空, 文本, 空, ...）
 *   blankCount   — 空白个数
 */
function parseBlanks(text) {
    // 匹配三种空白标记：英文括号+空格、中文括号+空格、连续下划线(2+)
    const regex = /\([\s]*\)|（[\s]*）|_{2,}/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        // 空白前的文本段
        parts.push(text.slice(lastIndex, match.index));
        lastIndex = match.index + match[0].length;
    }
    // 最后一段文本
    parts.push(text.slice(lastIndex));
    return { parts, blankCount: parts.length - 1 };
}

/**
 * 渲染指定索引的题目
 * @param {number} index - 题目索引（0-based）
 */
function renderQuestion(index) {
    const q = questions[index];

    // --- 更新题号与题型 ---
    questionIndex.textContent = `第 ${index + 1} 题 / 共 ${totalQuestions} 题`;
    questionType.textContent = `（${q.type}）`;

    // --- 显示题目内容 ---
    questionText.innerHTML = q.question;

    // --- 清空并重新生成选项/答案区域 ---
    optionsContainer.innerHTML = '';

    if (q.type === '填空题') {
        // ── 填空题：题目与填空输入框放在同一行 ──
        const { parts, blankCount } = parseBlanks(q.question);
        optionsContainer.innerHTML = '';  // 不使用 optionsContainer

        // 从已保存答案中按 /t 拆分出各空的值
        const savedValues = answers[index].value
            ? answers[index].value.split('/t')
            : [];

        // 构建行内布局容器
        const line = document.createElement('div');
        line.style.cssText = 'display:flex; flex-wrap:wrap; align-items:center; gap:.4rem; font-size:1.1rem; line-height:2;';

        if (blankCount === 0) {
            // ── 无显式空白：题目文本 + 行内输入框 ──
            const span = document.createElement('span');
            span.textContent = q.question;
            line.appendChild(span);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '…';
            input.value = answers[index].value || '';
            input.style.cssText = `
                display:inline-block; width:160px; padding:.3rem .6rem; font-size:1rem;
                border:none; border-bottom:.15rem solid var(--border);
                background:transparent; color:var(--text);
                outline:none; transition:border-color var(--transition-fast);
            `;
            input.addEventListener('input', () => {
                if (examSubmitted) return;
                answers[index].value = input.value;
                updateProgress();
            });
            line.appendChild(input);

        } else {
            // ── 有显式空白：交替渲染文本段和行内输入框 ──
            const inputs = [];
            for (let i = 0; i < blankCount; i++) {
                // 文本段
                if (parts[i]) {
                    const span = document.createElement('span');
                    span.textContent = parts[i];
                    line.appendChild(span);
                }
                // 行内输入框
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '…';
                input.value = savedValues[i] || '';
                input.style.cssText = `
                    display:inline-block; width:100px; padding:.3rem .6rem; font-size:1rem;
                    border:none; border-bottom:.15rem solid var(--border);
                    background:transparent; color:var(--text);
                    text-align:center;
                    outline:none; transition:border-color var(--transition-fast);
                `;
                inputs.push(input);
                line.appendChild(input);
            }
            // 最后一段文本
            if (parts[blankCount]) {
                const span = document.createElement('span');
                span.textContent = parts[blankCount];
                line.appendChild(span);
            }
            // 保存事件：用 /t 拼接所有输入框的值
            const save = () => {
                if (examSubmitted) return;
                answers[index].value = inputs.map(inp => inp.value).join('/t');
                updateProgress();
            };
            inputs.forEach(inp => inp.addEventListener('input', save));
        }

        questionText.innerHTML = '';
        questionText.appendChild(line);

    } else if (q.type === '多选题') {
        // ── 多选题：渲染 A/B/C/D 复选框 ──
        const labels = ['A', 'B', 'C', 'D'];
        const selected = answers[index].value;  // 已选索引数组
        q.options.forEach((opt, optIndex) => {
            const label = document.createElement('label');
            label.style.cssText = `
                display:flex; align-items:flex-start; gap:.75rem;
                padding:.85rem 1rem; border-radius:var(--radius-md);
                background:var(--input-bg); cursor:pointer;
                transition:background var(--transition-fast), border-color var(--transition-fast);
                border:.15rem solid transparent;
            `;
            // 已选中的选项加高亮边框
            if (selected.includes(optIndex)) {
                label.style.borderColor = 'var(--primary)';
                label.style.background = `color-mix(in srgb, var(--primary) 8%, var(--input-bg))`;
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = `q${index}`;
            checkbox.value = optIndex;
            checkbox.style.cssText = 'margin-top:.2rem; accent-color:var(--primary);';
            if (selected.includes(optIndex)) {
                checkbox.checked = true;
            }

            const div = document.createElement('div');
            div.innerHTML = `<strong>${labels[optIndex]}.</strong> ${opt}`;

            label.appendChild(checkbox);
            label.appendChild(div);

            // 点击选项时切换选中状态
            label.addEventListener('click', () => {
                toggleMultiOption(index, optIndex);
            });

            optionsContainer.appendChild(label);
        });

    } else {
        // ── 单选题：渲染 A/B/C/D 单选按钮 ──
        const labels = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, optIndex) => {
            const label = document.createElement('label');
            label.style.cssText = `
                display:flex; align-items:flex-start; gap:.75rem;
                padding:.85rem 1rem; border-radius:var(--radius-md);
                background:var(--input-bg); cursor:pointer;
                transition:background var(--transition-fast), border-color var(--transition-fast);
                border:.15rem solid transparent;
            `;
            // 已选中的选项加高亮边框
            if (answers[index].value === optIndex) {
                label.style.borderColor = 'var(--primary)';
                label.style.background = `color-mix(in srgb, var(--primary) 8%, var(--input-bg))`;
            }

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${index}`;
            radio.value = optIndex;
            radio.style.cssText = 'margin-top:.2rem; accent-color:var(--primary);';
            if (answers[index].value === optIndex) {
                radio.checked = true;
            }

            const div = document.createElement('div');
            div.innerHTML = `<strong>${labels[optIndex]}.</strong> ${opt}`;

            label.appendChild(radio);
            label.appendChild(div);

            // 点击选项时保存选中值
            label.addEventListener('click', () => {
                selectOption(index, optIndex);
            });

            optionsContainer.appendChild(label);
        });
    }

    // --- 控制上一题/下一题按钮状态 ---
    prevBtn.removeAttribute('disabled');
    nextBtn.removeAttribute('disabled');
    if (index === 0) prevBtn.setAttribute('disabled', '');
    if (index === totalQuestions - 1) nextBtn.setAttribute('disabled', '');

    // --- 更新标记按钮文字 ---
    markBtn.textContent = marked[index] ? '⭐ 已标记' : '☆ 标记';

    // --- 更新进度 ---
    updateProgress();
}

/**
 * 单选题选择答案
 * @param {number} qIndex - 题目索引
 * @param {number} optIndex - 选项索引（0～3）
 */
function selectOption(qIndex, optIndex) {
    if (examSubmitted) return;
    answers[qIndex].value = optIndex;
    renderQuestion(currentIndex);
}

/**
 * 多选题切换选项（选中/取消选中）
 * @param {number} qIndex - 题目索引
 * @param {number} optIndex - 选项索引（0～3）
 */
function toggleMultiOption(qIndex, optIndex) {
    if (examSubmitted) return;
    const arr = answers[qIndex].value;
    const idx = arr.indexOf(optIndex);
    if (idx > -1) {
        arr.splice(idx, 1);  // 已选中 → 取消
    } else {
        arr.push(optIndex);  // 未选中 → 添加
    }
    renderQuestion(currentIndex);
}

// ================================================================
// 题目导航 — 上一题 / 下一题
// ================================================================

/**
 * 跳转到指定索引的题目
 * @param {number} index - 目标题目索引
 */
function goToQuestion(index) {
    if (index < 0 || index >= totalQuestions || examSubmitted) return;
    currentIndex = index;
    renderQuestion(currentIndex);
}

prevBtn.addEventListener('click', () => goToQuestion(currentIndex - 1));
nextBtn.addEventListener('click', () => goToQuestion(currentIndex + 1));

// ================================================================
// 标记题目 — 用于回头复查
// ================================================================

markBtn.addEventListener('click', () => {
    if (examSubmitted) return;
    marked[currentIndex] = !marked[currentIndex];
    renderQuestion(currentIndex);
});

// ================================================================
// 键盘快捷键
//   ← →   切换题目
//   M     标记/取消标记
//   1～4  单选题快速选择（填空题时忽略）
// ================================================================

document.addEventListener('keydown', (e) => {
    // 考试未开始或已交卷时不响应
    if (examScreen.classList.contains('hidden') || examSubmitted) return;
    // 输入框中不响应快捷键，避免干扰打字
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'HCW-INPUT') return;

    if (e.key === 'ArrowLeft')  { e.preventDefault(); goToQuestion(currentIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goToQuestion(currentIndex + 1); }
    if (e.key === 'm' || e.key === 'M') {
        marked[currentIndex] = !marked[currentIndex];
        renderQuestion(currentIndex);
    }
    // 数字键 1-4：单选题直接选中，多选题切换选中状态
    if (e.key >= '1' && e.key <= '4') {
        const q = questions[currentIndex];
        const idx = parseInt(e.key) - 1;
        if (idx >= q.options.length) return;
        if (q.type === '单选题') {
            selectOption(currentIndex, idx);
        } else if (q.type === '多选题') {
            toggleMultiOption(currentIndex, idx);
        }
    }
});

// ================================================================
// 进度更新
// ================================================================

/**
 * 计算已答题数并更新界面上的进度条和已答数字
 * 单选题：answers[i].value !== null 视为已答
 * 多选题：answers[i].value 为非空数组视为已答
 * 填空题：answers[i].value 为非空字符串视为已答
 */
function updateProgress() {
    const answered = answers.filter(a =>
        a.type === '填空题' ? a.value !== '' :
        a.type === '多选题' ? a.value.length > 0 :
        a.value !== null
    ).length;
    answeredCount.textContent = answered;
    progressBar.style.width = `${Math.round((answered / totalQuestions) * 100)}%`;
}

// ================================================================
// 计时器 — 倒计时 60 分钟，归零自动交卷
// ================================================================

/** 启动倒计时（每秒更新一次） */
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam(true);   // 超时自动交卷
        }
    }, 1000);
}

/** 更新界面上的计时器文字，最后 5 分钟变红 */
function updateTimerDisplay() {
    const min = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
    const sec = String(timeRemaining % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
    timerDisplay.style.color = timeRemaining <= 300 ? 'var(--danger)' : '';
}

// ================================================================
// 交卷 — 提交答案并显示结果弹窗（不含自动判分）
// ================================================================

/**
 * 提交考试答案
 * 统计已答/未答题数，显示在结果弹窗中（不含正确/错误判断）
 * @param {boolean} isTimeout - 是否由计时器超时触发
 */
function submitExam(isTimeout) {
    if (examSubmitted) return;
    examSubmitted = true;
    clearInterval(timerInterval);                     // 停止计时器

    // 统计已答和未答题数
    const answered = answers.filter(a =>
        a.type === '填空题' ? a.value !== '' :
        a.type === '多选题' ? a.value.length > 0 :
        a.value !== null
    ).length;
    const unanswered = totalQuestions - answered;

    // 更新结果弹窗内容 — 仅显示提交情况，不判分
    finalScore.textContent = '—';
    correctCount.textContent = '—';
    wrongCount.textContent = '—';
    unansweredResultCount.textContent = unanswered;

    // 显示弹窗
    resultModal.style.display = 'flex';
    Postexam();
}

// 交卷按钮点击事件
submitBtn.addEventListener('click', () => {
    if (examSubmitted) return;
    const unanswered = answers.filter(a =>
        a.type === '填空题' ? a.value === '' :
        a.type === '多选题' ? a.value.length === 0 :
        a.value === null
    ).length;
    const msg = unanswered > 0
        ? `还有 ${unanswered} 题未作答，确定要交卷吗？`
        : '所有题目已作答，确定要交卷吗？';
    if (confirm(msg)) {
        submitExam(false);
    }
});

// 关闭结果弹窗
closeResultBtn.addEventListener('click', () => {
    resultModal.style.display = 'none';
});



