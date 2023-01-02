const typeHand = process.argv[2]

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  
  const numeroAleatorioEntreZeroeTres = getRndInteger(1, 3)

  const tesoura = 1
  const papel = 2
  const pedra = 3

  console.log(numeroAleatorioEntreZeroeTres)

if(typeHand === "tesoura" && numeroAleatorioEntreZeroeTres === 1){
  console.log("Empatou")
} else if(typeHand === "tesoura" && numeroAleatorioEntreZeroeTres === 2){
  console.log("Você ganhou!")
} else if(typeHand === "tesoura" && numeroAleatorioEntreZeroeTres === 3){
  console.log("Você perdeu!")
}

if(typeHand === "papel" && numeroAleatorioEntreZeroeTres === 2){
  console.log("Empatou")
} else if(typeHand === "papel" && numeroAleatorioEntreZeroeTres === 3){
  console.log("Você ganhou!")
} else if(typeHand === "papel" && numeroAleatorioEntreZeroeTres === 1){
  console.log("Você perdeu!")
}

if(typeHand === "pedra" && numeroAleatorioEntreZeroeTres === 3){
  console.log("Empatou")
} else if(typeHand === "pedra" && numeroAleatorioEntreZeroeTres === 2){
  console.log("Você ganhou!")
} else if(typeHand === "pedra" && numeroAleatorioEntreZeroeTres === 1){
  console.log("Você perdeu!")
}
