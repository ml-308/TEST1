export async function onRequestPost(context){
    const {request,env}=context;
    let body;
    try{
        body=await request.json();
    }
    catch(error){
        return new Response(JSON.stringify({error:'Invalid JSON'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'}
        });
    }

    try{
        const check=await env.mlttcd.perpare(`SELECT ANSWER FROM ANSWER`).all();
    }catch(error){
        return new Response(JSON.stringify({error:'Error D1SQL'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }


    let score=0;
    for(let i=0;i<check.length;i++){
        if(body[i]==null){
            continue;
        }
        if(i>=0&&i<13&&body[i]==check[i]){
            score+=5;
        }
        if(i>=13&&i<=14){
            // Multi-choice scoring:
            //   - Pick any wrong option → 0
            //   - Correct answer has 3 options: pick 1→1pt, 2→3pt, 3→5pt
            //   - Correct answer has 2 options: pick 1→2pt, 2→5pt
            const userStr = body[i];
            if(!userStr) continue;                     // unanswered → 0

            const userArr = userStr.split(',').map(Number);
            const correctArr = check[i].split(',').map(Number).sort((a,b)=>a-b);

            // Any wrong option selected → 0
            if(!userArr.every(v => correctArr.includes(v))) continue;

            const nCorrect = correctArr.length;
            const nPicked  = userArr.length;

            if(nCorrect === 3){
                if(nPicked === 1)      score += 1;
                else if(nPicked === 2) score += 3;
                else if(nPicked === 3) score += 5;
            } else if(nCorrect === 2){
                if(nPicked === 1)      score += 2;
                else if(nPicked === 2) score += 5;
            }
        }
        if(i>=15&&i<=19){
            // Fill-in scoring:
            //   Compare each blank independently; wrong blanks don't deduct.
            //   1 blank: correct → 5pt
            //   2 blanks: 1 correct → 2pt, 2 correct → 5pt
            //   3 blanks: 1 correct → 1pt, 2 correct → 3pt, 3 correct → 5pt
            const userStr = body[i];
            if(!userStr) continue;

            const userArr = userStr.split(',');
            const correctArr = check[i].split(',');

            let correctCount = 0;
            for(let b = 0; b < correctArr.length; b++){
                if(userArr[b] === correctArr[b]) correctCount++;
            }

            const nBlanks = correctArr.length;
            if(nBlanks === 1 && correctCount === 1){
                score += 5;
            } else if(nBlanks === 2){
                if(correctCount === 1)      score += 2;
                else if(correctCount === 2) score += 5;
            } else if(nBlanks === 3){
                if(correctCount === 1)      score += 1;
                else if(correctCount === 2) score += 3;
                else if(correctCount === 3) score += 5;
            }
        }
    }

    try{
        const result=await env.mlttcd.perpare(
            `INSERT INTO TESTER(USER,SCORE) VALUE(?,?)`
        ).bind(body[20],score).run();
    }catch(error){
        return new Response(JSON.stringify({error:'Error D2SQL'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }

    return new Response(JSON.stringify({score:"no"}), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });


}