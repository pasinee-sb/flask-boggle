const BASE_URL = "http://localhost:5000/"
const $result = $("#result")
const $score = $("#score")
const $showTimer = $("#show_timer")
const $form = $("form")

let score = 0
let sec= 30 
let final_score
let $word 
let setOfWords = []

//set the timer to countdown from 30 seconds to 0 (run countdown every 1000 millisecond)
//when time is up, show text time is up and remove the form, send the score to check if it is the highest score to backend

const timer = ()=> {
    let handle_time = setInterval(()=>{
        if (sec>0) {
            sec --;
            $showTimer.text(`Time remaining: ${sec}`)
        }
        else {
            clearInterval(handle_time);
            $form.remove();
            $("#tell_time").text("TIME IS UP!")
            final_score = score
         
            setHighScore(final_score)


        }
    }, 1000)
}



async function submit_form(event){ 
    event.preventDefault();
    $word = $("#word").val();

    if (! $word) {
        return 
    }
     //if word is duplicate, do nothing
     if (setOfWords.includes($word)){
        $result.text(`Result: "${$word.toUpperCase()}" exists but DUPLICATE!`)
    } 

    const resp = await axios.get(`${BASE_URL}guessed`, {params:{"word":$word}});
    const response = resp.data.result;

    checkAndUpdate(response)
    console.log(score, typeof score);
    
    
    
    
}

$("button").on("click", submit_form)

const checkAndUpdate = (res)=> {
    
    if (res === "ok"){
        setOfWords.push($word)
            $result.text(`Result: "${$word.toUpperCase()}" exists`)
            score = score+$word.length
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

const setHighScore= async (newScore)=>{
    
     let data = await axios.post(`${BASE_URL}check-score`,{"score": newScore})
  
}

timer()



