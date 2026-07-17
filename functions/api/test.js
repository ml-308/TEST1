export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. 解析 JSON
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 基础校验：必须是数组且有足够长度
  if (!Array.isArray(body) || body.length < 21) {
    return new Response(JSON.stringify({ error: 'Invalid answer data' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. 查询正确答案
  let rows;
  try {
    const result = await env.mlttcd.prepare(`SELECT ANSWER FROM ANSWER`).all();
    rows = result.results; // 数组，每项 { ANSWER: '...' }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'D1 query failed', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!rows || rows.length < 20) {
    return new Response(JSON.stringify({ error: 'Answer data incomplete' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 提取答案字符串数组
  const answers = rows.map(r => r.ANSWER);

  // 3. 计算分数
  let score = 0;
  for (let i = 0; i < 20; i++) {
    const userAns = body[i];
    const correctAns = answers[i];

    if (userAns == null || userAns === '') continue;

    // Q1-Q13（索引0-12）为单选题，精确匹配
    if (i >= 0 && i < 13) {
      if (String(userAns) === String(correctAns)) {
        score += 5;
      }
    }
    // Q14-Q15（索引13-14）为多选题
    else if (i >= 13 && i <= 14) {
      const userStr = String(userAns);
      if (!userStr) continue;
      const userArr = userStr.split(',').map(Number).sort((a,b)=>a-b);
      const correctArr = String(correctAns).split(',').map(Number).sort((a,b)=>a-b);

      // 选了错误选项得0
      if (!userArr.every(v => correctArr.includes(v))) continue;

      const nCorrect = correctArr.length;
      const nPicked = userArr.length;

      if (nCorrect === 3) {
        if (nPicked === 1) score += 1;
        else if (nPicked === 2) score += 3;
        else if (nPicked === 3) score += 5;
      } else if (nCorrect === 2) {
        if (nPicked === 1) score += 2;
        else if (nPicked === 2) score += 5;
      }
    }
    // 索引15-19为填空题
    else if (i >= 15 && i <= 19) {
      const userStr = String(userAns);
      if (!userStr) continue;
      const userArr = userStr.split(',');
      const correctArr = String(correctAns).split(',');

      let correctCount = 0;
      for (let b = 0; b < correctArr.length; b++) {
        if (userArr[b] && userArr[b].trim() === correctArr[b].trim()) {
          correctCount++;
        }
      }

      const nBlanks = correctArr.length;
      if (nBlanks === 1 && correctCount === 1) score += 5;
      else if (nBlanks === 2) {
        if (correctCount === 1) score += 2;
        else if (correctCount === 2) score += 5;
      } else if (nBlanks === 3) {
        if (correctCount === 1) score += 1;
        else if (correctCount === 2) score += 3;
        else if (correctCount === 3) score += 5;
      }
    }
  }

  // 4. 写入用户分数
  const username = String(body[20] || 'anonymous');
  try {
    await env.mlttcd.prepare(
      `INSERT INTO TESTER (USER, SCORE) VALUES (?, ?)`
    ).bind(username, score).run();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save score', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 5. 返回实际分数
  return new Response(JSON.stringify({score: "???" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}