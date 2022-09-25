import React, { useState, useEffect } from "react";
import Die from './components/Die';
import Confetti from "react-confetti";
import './App.css';
import {nanoid} from "nanoid";

export default function App() {
  // set state of dice
  const [dice, setDice] = useState(allNewDice())

  // set state of tenzies
  const [tenzies, setTenzies] = useState(false)

  // a function to handle the side effects of
  // having two instances of state living within
  // a single component/function
  useEffect(() => {
      // check if every die is held
      const allHeld = dice.every(die => die.isHeld)

      // get the value of the first die
      const firstValue = dice[0].value

      // compare all dice to see if
      // each one has the same value
      const allSame = dice.every(die => die.value === firstValue)

      // if all are held && same values
      // set tenzies to true
      if (allHeld && allSame) {
        setTenzies(true)
      }
  }, [dice])

  // a function that generates new dice object
  function generateNewDice() {
      return {
        value: Math.ceil(Math.random() * 6),
        id: nanoid(),
        isHeld: false
      }
  }

  // a function that creates an array of our dice
  function allNewDice() {
      const newDice = []
      for (let i = 0; i < 10; i++) {
        newDice.push(generateNewDice())
      }
      return newDice
  }

  // a function to roll the dice depending on our tenzies state
  function rollDice() {
      if (!tenzies) {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ?
                   die :
                   generateNewDice()
        }))
      } else {
        setTenzies(false)
        setDice(allNewDice())
      }
  }

  // a function to hold dice
  function holdDice(id) {
      setDice(oldDice => oldDice.map(die => {
          return die.id === id ?
              {...die, isHeld: !die.isHeld} :
              die
      }))
  }

  // render our dice elements
  const diceElements = dice.map(die => (
      <Die
          key={die.id}
          value={die.value}
          isHeld={die.isHeld}
          holdDice={() => holdDice(die.id)}
      />
  ))

  return (
      <main>
          {tenzies && <Confetti />}
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same.
          Click each die to freeze it at its current value between rolls.</p>
          <div className="dice-container">
            {diceElements}
          </div>
          <button 
              className="roll-dice"
              onClick={rollDice}
          >
            {tenzies ? "New Game" : "Roll"}
          </button>
      </main>
  )
}
