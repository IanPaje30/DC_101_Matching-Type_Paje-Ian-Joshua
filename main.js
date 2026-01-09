// Rainbow colors for title letters
const titleColors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c", "#9bf6ff", "#cdb4db"];

function rainbowTitle() {
  const titleEl = document.getElementById("gameTitle");
  const text = titleEl.textContent;
  titleEl.innerHTML = ""; // clear

  [...text].forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    if(char !== " ") {
      span.style.color = titleColors[Math.floor(Math.random() * titleColors.length)];
    }
    titleEl.appendChild(span);
  });
}
window.onload = rainbowTitle;

// Game logic
const COLORS = ["#ff595e","#1982c4","#6a4c93","#8ac926","#ffca3a","#ff924c","#9bf6ff","#cdb4db"];
let level = 1, timer=0, timerInterval, selectedTop=null, matched=0, difficulty="easy";

const topBoard = document.getElementById("topBoard");
const bottomBoard = document.getElementById("bottomBoard");
const menuHigh = document.getElementById("menuHigh");
menuHigh.textContent = localStorage.getItem("highscore") || 0;

// Sounds
const sounds = {
  match: new Audio("sounds/match.wav"),
  wrong: new Audio("sounds/wrong.wav"),
  gameover: new Audio("sounds/gameover.wav")
};

function showDifficulty() { document.getElementById("difficulty").style.display="block"; }
function startGame(diff) { difficulty=diff; level=1; switchScreen("menu","game"); startLevel(); }

function startLevel(){
  clearInterval(timerInterval);
  matched=0; selectedTop=null;
  if(level>100){ level=100; gameOver(); return; }
  document.getElementById("level").textContent=level;
  let baseTime = difficulty==="easy"?5:difficulty==="medium"?4:3;
  timer = baseTime + Math.floor(level*0.8);
  document.getElementById("timer").textContent=timer;

  let pairs = Math.min(level, COLORS.length);
  const colors = shuffle(COLORS).slice(0,pairs);
  const bottomColors = shuffle([...colors]);
  topBoard.innerHTML=""; bottomBoard.innerHTML="";
  colors.forEach(c=>topBoard.appendChild(makeColor(c,"top")));
  bottomColors.forEach(c=>bottomBoard.appendChild(makeColor(c,"bottom")));
  timerInterval = setInterval(countdown,1000);
}

function makeColor(color,side){
  const div=document.createElement("div");
  div.className="color"; div.style.background=color; div.dataset.color=color;
  div.onclick=()=>select(div,side);
  return div;
}

function select(el,side){
  if(el.classList.contains("matched")) return;
  if(side==="top"){ if(selectedTop) selectedTop.classList.remove("selected"); selectedTop=el; el.classList.add("selected"); return; }
  if(!selectedTop) return;
  if(el.dataset.color===selectedTop.dataset.color){
    sounds.match.play();
    el.classList.add("matched"); selectedTop.classList.add("matched"); selectedTop.classList.remove("selected");
    matched++; selectedTop=null;
    if(matched===Math.min(level,COLORS.length)) setTimeout(()=>{ level++; startLevel(); },600);
  }else{ sounds.wrong.play(); selectedTop.classList.remove("selected"); selectedTop=null; }
}

function countdown(){ timer--; document.getElementById("timer").textContent=timer; if(timer<=0) gameOver(); }

function gameOver(){
  clearInterval(timerInterval); sounds.gameover.play();
  let high = localStorage.getItem("highscore") || 0;
  if(level>high) localStorage.setItem("highscore",level);
  document.getElementById("finalLevel").textContent=level;
  switchScreen("game","gameOver");
}

function playAgain(){ level=1; switchScreen("gameOver","game"); startLevel(); }
function quitGame(){ switchScreen("gameOver","menu"); }
function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
function switchScreen(hide,show){ document.getElementById(hide).classList.remove("active"); document.getElementById(show).classList.add("active"); }