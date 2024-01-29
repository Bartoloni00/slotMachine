let icon_width = 150,
    icon_height = 150

// console.log(window.screen.width);
if (window.screen.width <= 500) {
  icon_width = 79,
  icon_height = 79
}
const num_icons = 9,
      time_per_icon = 100,
      indexes = [0,0,0],
      iconMap = ["sanMartin", "messi", "tango", "obelisco", "empanada", "bandoneon", "caballo", "gaucho", "mate"];

const winConditions = [
    [0, 0, 0], // 3 San Martin
    [1, 1, 1], // 3 Messi
    [2, 2, 2], // 3 Tango
    [3, 3, 3], // 3 obelisco
    [4, 4, 4], // 3 empanada
    [5, 5, 5], // 3 bandoneon
    [6, 6, 6], // 3 caballo
    [7, 7, 7], // 3 gaucho
    [8, 8, 8], // 3 mate
];
/*
3 san martin * 500
2 messi * 200
3 tango * 100
3 obelisco * 50
3 empanadas * 25
3 bandoneon * 15
3 caballos * 10
3 gaucho * 5
3 mate * 3
2 gauchos * 2
2 mate * 1
*/
const rollButton = document.getElementById('rollButton');
const scoreSpan = document.getElementById('score');
const betSpan = document.getElementById('bet')
const lessBetButton = document.getElementById('lessBet')
const plusBetButton = document.getElementById('plusBet')
rollButton.disabled = false

let score = 500
let bet = 5
scoreSpan.innerText = `Creditos: ${score}`
betSpan.innerText = `${bet}`

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons)
    const style = getComputedStyle(reel)
    const backgroundPositionY = parseFloat(style['background-position-y'])
    const targetBackgroundPositionY = backgroundPositionY + delta * icon_height
    const normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height)

    return new Promise((resolve, reject) => {
        reel.style.transition = `background-position-y ${8 + delta * time_per_icon}ms cubic-bezier(.45, .05, .58, 1.09)`
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`
    
        setTimeout(()=>{
            reel.style.transition = 'none'
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`
            resolve(delta % num_icons)
        }, 8 + delta * time_per_icon)
    })
}

function rollAll() {
    if (score < bet) {
        console.log('no tenes mas plata loco');
        return
    }
    rollButton.disabled = true
    score -= bet
    scoreSpan.innerText = `Creditos: ${score}`
    betSpan.innerText = `${bet}`

    const reelsList = document.querySelectorAll('.slots > .reel');
    Promise.all([...reelsList].map( (reel,i) => roll(reel,i) ) )
    .then((deltas)=>{
        deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta)%num_icons)

        // indexes.map((index)=>{ console.log(iconMap[index])})
        // check win conditions
        if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {
            winConditions.forEach(condition=>{
                if (indexes.every((value, i) => value === condition[i])) {
                    handleWin(condition);
                }
            })
        } else if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
            if (indexes[1] == 7) {
                score += bet * 2;
                scoreSpan.innerText = `Creditos: ${score}`
                console.log('2 gauchos');
            } else if(indexes[1] == 8){
                        score += bet * 1;
                scoreSpan.innerText = `Creditos: ${score}`
                console.log('2 mates');
            }
        } else {
            console.log('perdiste');
        }
    })
    .finally(()=> rollButton.disabled = false)
}

rollButton.addEventListener('click',rollAll)

const lessBet =  () => {
    if (bet >= 10) {
        bet -= 5
        betSpan.innerText = `${bet}`
    }
}
const plusBet =  () => {
    if (bet <= 45) {
        bet += 5
        betSpan.innerText = `${bet}`
    }
}

lessBetButton.addEventListener('click',lessBet)
plusBetButton.addEventListener('click',plusBet)

function handleWin(condition) {
    console.log('¡Ganaste!');
    switch (condition.join(',')) {
      case '0,0,0':
        // 3 San Martin
        score += bet * 500;
        console.log('3 San Martin');
        break;
      case '1,1,1':
        // 3 Messi
        score += bet * 200;
        console.log('3 messi');
        break;
      case '2,2,2':
        // 3 Tango
        score += bet * 100;
        console.log('3 tango');
        break;
      case '3,3,3':
        // 3 Obelisco
        score += bet * 50;
        console.log('3 obelisco');
        break;
      case '4,4,4':
        // 3 Empanada
        score += bet * 25;
        console.log('3 empanadas');
        break;
      case '5,5,5':
        // 3 Bandoneon
        score += bet * 15;
        console.log('3 bandoneones');
        break;
      case '6,6,6':
        // 3 Caballo
        score += bet * 10;
        console.log('3 caballo');
        break;
      case '7,7,7':
        // 3 Gaucho
        score += bet * 5;
        console.log('3 gauchos');
        break;
      case '8,8,8':
        // 3 Mate
        score += bet * 3;
        console.log('3 mate');
        break;
      default:
        console.log('Condición no reconocida');
    }
  
    // Actualizar la visualización del puntaje
    scoreSpan.innerText = `Creditos: ${score}`;
  }
  