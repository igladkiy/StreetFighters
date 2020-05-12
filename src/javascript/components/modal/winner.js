import { showModal } from "./modal";

export function showWinnerModal(fighter) {
  const winnerImg = document.createElement('div')
  const image = document.createElement('img')
  image.src = fighter.source;
  winnerImg.append(image)
  showModal({title: `${fighter.name} wins!`, bodyElement: winnerImg});
  // call showModal function 
}
