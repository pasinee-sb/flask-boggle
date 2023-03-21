const BASE_URL = "http://localhost:5000/"
const $result = $("#result")
const $score = $("#score")
let score = 0
const $showTimer = $("#show_timer")
let sec= 30 
const $form = $("form")
let final_score
let $word 

const timer = ()=> {
    let handle_time = setInterval(()=>{
        if (sec>0) {
            sec --;
            $showTimer.text(`Time remaining: ${sec}`)
        }
        else {
            clearInterval(handle_time);
            $form.remove();
            final_score = $score;
            sendHighScore(final_score)

        }
    }, 1000)
}



async function submit_form(event){ 
    event.preventDefault();
     $word = $("#word").val();

    const resp = await axios.get(`${BASE_URL}guessed`, {params:{"word":$word}});
    const response = resp.data.result;

    checkAndUpdate(response)
    
    
    
    
}

$("button").on("click", submit_form)

const checkAndUpdate = (res)=> {
    
    if (res === "ok"){
        $result.text(`Result: "${$word.toUpperCase()}" exists`)
        score = score+1
        $score.text(`Score: ${score} `)
    }
    if (res === "not-word"){
        $result.text(`Result: "${$word.toUpperCase()}" does not exist`)
    }
    if (res === "not-on-board"){
        $result.text(`Result: "${$word.toUpperCase()}" is not on the board`)
    }

    $('input').val('')  
}

const sendHighScore= async (final_score)=>{
    let data = await axios.get('/check-score', {params:{'score': final_score}})
    console.log(data.data.high_score);
    $("#high_score").text(`high Score: {data.data.high_score}`)
}

timer()



