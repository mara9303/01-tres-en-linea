export const saveGameToStorage = ({board, turn}) => {
    //Guardar partida
    window.localStorage.setItem('board', JSON.stringify(board))
    window.localStorage.setItem('turn', turn)
}

export const resetGameStorage = () => {
    //Guardar partida
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
}