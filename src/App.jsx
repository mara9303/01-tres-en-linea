import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinnerFrom, checkEndGame } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { saveGameToStorage, resetGameStorage } from "./logic/storage";

function App() {
  console.log('Render');
  const [board, setBoard] = useState(()=>{
    console.log('Inicializar estado del board')
    const boardFromStorage = window.localStorage.getItem('board') //Es LENTO leer el localStorage
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(()=>{
    const turnFromStorage = window.localStorage.getItem('turn') //Es LENTO leer el localStorage
    return turnFromStorage ?? TURNS.X
  })
  //null no hay ganador, false es que hay empate
  const [winner, setWinner] = useState(null);



  const resetGame = ()=>{
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    //Si ya tiene algún valor en el board no se actualiza
    if(board[index] || winner)  return 
    //Actualizar el tablero
    const newBoard = [... board]
    newBoard[index] = turn
    setBoard(newBoard)
    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    });
    const newWinner = checkWinnerFrom(newBoard);
    if(newWinner){
      confetti()
      setWinner(newWinner) //La actualización del estado es asíncrono
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  /*useEffect(()=>{
    //como mínimo se ejecuta 1 vez
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    });
  }, 
  [turn, board] //Cada vez que se actualice el turno o el tablero guadar la partida
  )*/

  useEffect(()=>{
    //como mínimo se ejecuta 1 vez
    console.log('Use effect');
  }, 
  [winner] //Acá se definen las dependencias que ejecutarían el codigo de useEffect
  )

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset de juego</button>
      <section className="game">
        {
          board.map((square, index) =>{
            return(
              <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
