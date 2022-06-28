//variables related to div blocks
var indexDiv = document.querySelector(".index");
var mainDiv = document.querySelector(".main");
var quizDiv = document.querySelector(".quiz");
var resultDiv = document.querySelector(".result");

//variables related to input
var nameDisplay = document.querySelector(".user-display");
var nameMessage = document.querySelector(".user-message");
var userInput = document.querySelector(".username");
var enterBtn = document.querySelector(".enter");
var receiveName;

//variable for categories
var btnGroup = document.querySelectorAll(".option-button");
var btnValue;

//variables for storing , displaying and incrementing quiz figures
var totalQuestions = document.querySelector(".totalQuest");
var questionNum = document.querySelector(".questNum");
var scoreDisplay = document.querySelector(".score span");
var timeDisplay = document.querySelector(".time span");
var categoryTitle = document.querySelector(".category-title");
var totalQuesFigure;
var questNumFigure = 0;
var scoreStore = 0;
var wrongStore = 0;
var timeCount = 10;
var attemptCount = 0;
var interval;


//for navigation of questions
var nextBtn = document.querySelector(".next");
var submitBtn = document.querySelector(".submit");
submitBtn.style.display = "none"; //initially hiding the submit button

//for quiz control
var alternatives = document.querySelectorAll(".answer-button"); 
var questionDisplay = document.querySelector(".question-display");

//specific option buttons
var alternative1 = document.querySelector(".answer-button.op1");
var alternative2 = document.querySelector(".answer-button.op2");
var alternative3 = document.querySelector(".answer-button.op3");
var alternative4 = document.querySelector(".answer-button.op4");

//result related variables
var resultStatement = document.querySelector(".result-statement");
var playerName = document.querySelector(".player");
var resultScore = document.querySelector(".final-score");
var resultTotalQue = document.querySelector(".total-questions");
var resultAttemptedQue = document.querySelector(".attempted-questions");
var resultCorrectAns = document.querySelector(".correct-answers");
var resultIncorrectAns = document.querySelector(".incorrect-answers");

//result navigation
var homeBtn =  document.querySelector(".home");


//initially disabled div
quizDiv.style.display = "none";
resultDiv.style.display = "none";

//disabling category buttons on the launch of game
function disabling(){
    for(let btn = 0; btn<btnGroup.length; btn++){
        btnGroup[btn].disabled = true;
    } 
}

//function definition to enable category buttons
function enabling(){
    if(nameDisplay.innerHTML !== ""){
        for(let btn = 0; btn<btnGroup.length; btn++){
            btnGroup[btn].disabled = false;
        } 
    }
}

//entering name by clicking the enter button
enterBtn.addEventListener('click', ()=>{
    receiveName = userInput.value;
    nameDisplay.innerHTML = receiveName;
    nameMessage.style.display = "block";
    console.log(receiveName);
    userInput.value = "";
    enabling();
});

//entering name by using enter key
userInput.addEventListener('keypress', (event)=>{
    if(event.key == "Enter"){
    receiveName = userInput.value;
    nameDisplay.innerHTML = receiveName;
    nameMessage.style.display = "block";
    console.log(receiveName);
    userInput.value = "";
    }
    enabling();
});
//calling the inital launch function
disabling();

//making div hidden when category button is clicked
function hiding(){
    for(let btn = 0; btn<btnGroup.length; btn++){
        btnGroup[btn].addEventListener('click', ()=>{
            indexDiv.style.display = "none";
            quizDiv.style.display = "flex";
        });
    }
}
hiding(); //call for hiding div
displayQuiz(); //function call for loading data

//function for quiz question loading
function displayQuiz(){
    var xhrObj = new XMLHttpRequest();
    xhrObj.onload = function () {
        var xmlObj = xhrObj.responseText;
        var jsonObj = JSON.parse(xmlObj);
        console.log(jsonObj); //for debuggin reference
        var quizLog = jsonObj.quiz;
        var quizLength = quizLog.length;
        for(let btn = 0; btn < btnGroup.length; btn++){
            btnGroup[btn].addEventListener('click', ()=>{
                btnValue = btnGroup[btn].innerHTML;
                console.log("clicked category: "  + btnValue);
                catSelection(btnValue);
            });
        }
        function catSelection(btnValue){
            for(let qlist = 0; qlist < quizLength; qlist++){
                console.log(quizLog[qlist]);
                console.log("index value : " + qlist);
                if(quizLog[qlist].cat == btnValue){
                    categoryTitle.innerHTML = quizLog[qlist].cat;
                    let incrementer = 0;
                    var questionLog = quizLog[qlist].quizList;
                    var questionLength = questionLog.length;
                    totalQuesFigure = questionLength;
                    console.log("total questions: " + totalQuesFigure);
                    printingQuestions(incrementer, qlist, quizLog);
                    nextBtn.addEventListener('click', ()=>{
                        //to clear interval
                        clearInterval(interval);
                        timeCount = 10;
                        //for storing wrong answers
                        wrongStore = attemptCount - scoreStore;
                        //for checking if increment is within question length
                        if(incrementer < questionLength - 1){
                            incrementer++;
                            printingQuestions(incrementer, qlist, quizLog, questionLength);
                        }
                    });
                }
            }

        }
    }
    xhrObj.open("GET", "quizlist.json", true);
    xhrObj.send();
}

//to print the quiz
function printingQuestions(incrementer, qlist, quizLog, questionLength){
    startTimer(timeCount);
    questNumFigure++;
    questionNum.innerHTML = questNumFigure;
    totalQuestions.innerHTML = totalQuesFigure;
    attemptedQuest();
    
    var questDisplay = quizLog[qlist].quizList[incrementer].question;
    var optionDisplay = quizLog[qlist].quizList[incrementer].options;
    var answerDisplay = quizLog[qlist].quizList[incrementer].answer;

    for(let oplist = 0; oplist < optionDisplay.length; oplist++){
        alternatives[oplist].style.pointerEvents = "auto";
        alternatives[oplist].style.opacity = "1";
        alternatives[oplist].innerHTML = optionDisplay[oplist];
        alternatives[oplist].style.color = "black";
        alternatives[oplist].style.backgroundColor = "white";
        alternatives[oplist].classList.add(".answer-button:hover");
        alternatives[oplist].addEventListener('click', ()=>{
            clearInterval(interval);
            var userSelected = alternatives[oplist].textContent;
            if(userSelected == answerDisplay){
                console.log("Correct");
                alternatives[oplist].style.backgroundColor = "#76F76D";
                for(oplist = 0 ; oplist < optionDisplay.length; oplist++){
                    alternatives[oplist].style.pointerEvents = "none";
                    //alternatives[oplist].style.opacity = "0.85";
                    //alternatives[oplist].style.color = "#9E9E9D";
                }
                for(oplist = 0; oplist < optionDisplay.length; oplist++){
                    if(alternatives[oplist].textContent != answerDisplay){
                       alternatives[oplist].style.color = "#E0E0DE";
                    }else{
                       alternatives[oplist].style.color = "black";
                    }
                }
                scoreStore++;
                scoreDisplay.innerHTML = "0" + scoreStore;
                console.log(scoreStore);
            }
            else{
                alternatives[oplist].style.backgroundColor = "#F76D82";
                for(oplist = 0 ; oplist < optionDisplay.length; oplist++){
                    if(alternatives[oplist].textContent == answerDisplay){
                        alternatives[oplist].style.backgroundColor = "#76F76D";
                        alternatives[oplist].style.color = "black";
                    }else{
                        alternatives[oplist].style.opacity = "0.8";
                        alternatives[oplist].style.color = "#E0E0DE"; 
                    }
                    alternatives[oplist].style.pointerEvents = "none";
                }
            }
        });
    }
    
    console.log("wrong : "+wrongStore);
    questionDisplay.innerHTML = questDisplay;

    //to display result page
    if(questNumFigure == questionLength){
        nextBtn.style.display = "none";
        submitBtn.style.display = "block";
        submitBtn.addEventListener('click', ()=>{
            //for storing wrong answers
            wrongStore = attemptCount - scoreStore; 
            quizDiv.style.display = "none";
            resultDiv.style.display = "flex";
            resultScore.innerHTML = scoreStore;
            playerName.innerHTML = receiveName;
            resultAttemptedQue.innerHTML = attemptCount;
            resultTotalQue.innerHTML = totalQuesFigure;
            resultCorrectAns.innerHTML = scoreStore;
            resultIncorrectAns.innerHTML = wrongStore; 
            if(scoreStore <= 1){
                resultStatement.innerHTML = "<span>&#127942</span> <br>Oopsies! Maybe you should make more otaku friends to be an Otaku. But! Good Try &#128527";
            }else if(scoreStore > 1 && scoreStore < 4){
                resultStatement.innerHTML = "<span>&#127942</span><br>Woahhh! Well Played, You are a wannabie Otaku &#128513";
            }else if(scoreStore >= 4){
                resultStatement.innerHTML = "<span>&#127942</span><br>Bravooo ! You are an otakuuuu &#128526";
            }
        });
    }
}

//to check if question is attempted
function attemptedQuest(){
    alternative1.onclick = ()=>{
        console.log("clicked");
        attemptCount++;
        console.log("attempted : " + attemptCount);
    }
    alternative2.onclick = ()=>{
        console.log("clicked");
        attemptCount++;
        console.log("attempted : " + attemptCount);
    }
    alternative3.onclick = ()=>{
        console.log("clicked");
        attemptCount++;
        console.log("attempted : " + attemptCount);
    }
    alternative4.onclick = ()=>{
        console.log("clicked");
        attemptCount++;
        console.log("attempted : " + attemptCount);
    }

}

//timer function

function startTimer(timeCount){
    interval = setInterval(()=>{
        timeDisplay.textContent = timeCount + " Seconds ";
        timeCount--;
        console.log(timeCount);
        if(timeCount < 10 && timeCount > 1){
            timeDisplay.textContent = " 0" + timeCount + " Seconds ";
        }
        if(timeCount == 1){
            timeDisplay.textContent = " 0" + timeCount + " Second ";
        }
        if(timeCount == 0){
            clearInterval(interval);
            timeDisplay.textContent = "Time Up ! - Attempt Next Question"
            for(let alt = 0; alt< alternatives.length; alt++){
                alternatives[alt].style.pointerEvents = "none";
                alternatives[alt].style.color = "#EAF2DF";
            }
        }
    },1000);
}

// result buttons - home button
homeBtn.addEventListener('click', ()=>{
        //window.location.reload();
        document.location.reload(true);
        indexDiv.style.display = "flex";
        resultDiv.style.display = "none";
});


