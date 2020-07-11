import React from 'react';
import './App.css';
import {WiCloud, WiDaySunny, WiDayCloudy, WiThunderstorm} from "weather-icons-react"
import useSound from 'use-sound'


const word = ["jazzy",]
const choice = word[Math.floor(Math.random() * word.length)]
const wordList = choice.split("")
var count = 0;


function App() {
  
  const restartGame = () => window.location.reload()

  const [boxState, setState] = React.useState("charBoxNeutral")
  const [answerBox, setAnswer] = React.useState(Array(wordList.length).join(".").split("."))
  const [gameOver, setGame] = React.useState(false);
  const [dis, setDis] = React.useState(0)

  const reducerScreen = (state, action) => {
    switch (action.type) {
      case "1":
        return {position: "-20vw", class: "cloudyBox"}
      case "2":
        return {position: "-42vw", class: "stormyBox"}
      default:
        console.log("screen defaulted")
        return state
    }
  }

  const reducerCoin = (state, action) => {
    switch (action.type) {
      case "0":
        setDis(1)
        return {li: [], box: "scale(0)"}
      case "1":
        return {li: [{class: "coin1"}], box: state.box}
      case "2":
        console.log("success")
        return {li: [{class: "coin2"}, {class: "coin1"}], box: state.box}
      default:
        console.log("error coin")
        return state
    }
  }

  const [screenState, dispatchScreen] = React.useReducer(reducerScreen, {position: "0vw", class: "graphicsBox"})

  const [gameOverState, setGameOver] = React.useState({screenOne: "-25vw", screenTwo: "25vw"})

  const didYouWin = () => {
    
    if (!answerBox.includes("")) {setTriumph(1); setGame(true);setGameOver({screenOne: "0vw", screenTwo: "0vw"})}
    else if (count >= 3) {setGameOver({screenOne: "0vw", screenTwo: "0vw"})}
    
  }
  
  const guessChar = () => {
    const theGuess = document.getElementById("inputBar").value
    if (wordList.includes(theGuess)) {
      if (answerBox.includes("")) {
        setBounce(1)}
      for (var i in wordList) {
        console.log(i)
        if (wordList[i] == theGuess) {
          const indexes = []
          const copyList = wordList
          while (wordList.includes(theGuess)) {
            
            indexes.push(copyList.indexOf(theGuess))
            wordList[copyList.indexOf(theGuess)] = ""
          }
          for (var c of indexes) {
            console.log("hello")
            setState(answerBox[c] = theGuess)
          }
        }
      } 
    } else {count++; console.log(`count: ${count.toString()}`)}
    document.getElementById("inputBar").value = ""
    dispatchScreen({type: (count.toString())})
    didYouWin()
  }

  const [bounce, setBounce] = React.useState(0)
  const [triumph, setTriumph] = React.useState(0)
  const [numHints, setHints] = React.useReducer(reducerCoin,{ li: [{class: "coin3"}, {class: "coin2"}, {class: "coin1"}], box: "scale(1)"})
  const [ding] = useSound("./soundFX/coinJingle.mp3")

  const spendHint = () => {
    ding()
    var count = numHints.li.length
    count = count - 1
    setHints({type: count.toString()})
    while (document.getElementById("inputBar").value == "") {
      document.getElementById("inputBar").value = wordList[Math.floor(Math.random() * wordList.length)]
    }
    guessChar()
  }

  return (

    <div className="App">
      <div className="gameOverGate1" style={{top: gameOverState.screenOne}}>
        <div className="gameOverBox1">
          <TextGAME isGameOver={gameOver}/>
        </div>
      </div>
      <div className="gameOverGate2" style={{top: gameOverState.screenTwo}}>
        <div className="gameOverBox2">
          <TextOVER isGameOver={gameOver}/>
        </div>
        <div className="restartButton" onClick={restartGame}>
          <p className="noselect">Restart</p>
        </div>
      </div>
      <div onClick={spendHint} dis={dis} className="Hints" style={{transform: numHints.box}}>
        <Coins num={numHints.li}/>
      </div>
      <div className="mainContainer">
        
        <div 
          className={screenState.class} 
          id="screen"
          bounce={bounce}
          onAnimationEnd={()=>setBounce(0)}
          triumph={triumph}
        >
          <div className="cloudyBox1"><WiCloud className="cloudy2"/></div>
          <Environment graphics={screenState.position} />
        </div>
        <div className="wordBox">
        <RandomWord  wordList={answerBox}  />
        </div>
        <div className="guess">
          <InputBar guess={guessChar} over={gameOver}/>
        </div>
      </div>
    </div>
  );
}

const RandomWord = ({wordList, clr}) => {

  return (
    <div className="wordContent">
      {wordList.map(i => (
        <div className="charBoxNeutral">
          <p>{i}</p>
        </div>
      ))}
    </div>
  )
}

const Environment = ({graphics}) => 
    <div className="Graphix" style={{top: graphics}}>
      <div className="indicator">
        <WiDaySunny className="sunny" />
      </div>
      <div className="indicator">
        <WiDayCloudy className="cloudy"/>
      </div>
      <div className="indicator">
        <WiThunderstorm className="stormy"/>
      </div>
    </div>

const InputBar = ({guess, over}) => 
  <div className="UI">
    <Input over={over}/>
    <InputButton guess={guess} over={over}/>
  </div>

const InputButton = ({guess, over}) => {
  if (over == true) {
    return (<button disabled >Guess</button>)
  }
  else {return(<button onClick={guess}>Guess</button>) }
}

const Input = ({over}) => {
  if (over == true) {
    return (<input maxLength="1" type="text" id="inputBar" disabled />)
  }
  else {return(<input maxLength="1" type="text" id="inputBar" />) }
}

let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 1000);
});

const TextGAME = ({isGameOver}) => {
  if (isGameOver == false) {
    return(<p>GAME</p>)
  } else if (isGameOver == true) {
    return(<p>YOU</p>)
  }
}

const TextOVER = ({isGameOver}) => {
  if (isGameOver == false) {
    return(<p>OVER</p>)
  } else if (isGameOver == true) {
    return(<p>WIN</p>)
  }
}

const Coins = ({num}) => {
  return(
    <div>
      {num.map(i=>(
        <div className={i.class}>
          <p>HINTS</p>
        </div>
    ))}
    </div>
  )
}

export default App;
