const typeNum = process.argv[2]
const num = process.argv[3]

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  
  const numeroAleatorioEntreZeroeDez = getRndInteger(0, 10)
  const soma = Number(num) + Number(numeroAleatorioEntreZeroeDez)

if(!typeNum || !num){
    console.log("Faltou digitar Par/Impar e/ou número!")
} else{
    if(soma%2 === 0 && typeNum === "par"){
        console.log(`Você escolheu par e o computador escolheu impar. O resultado foi ${soma} . Você ganhou!`)
    } else if(soma%2 === 1 && typeNum === "par"){
        console.log(`Você escolheu par e o computador escolheu impar. O resultado foi ${soma} . Você perdeu!`)
    } else if(soma%2 === 0 && typeNum === "impar"){
        console.log(`Você escolheu impar e o computador escolheu par. O resultado foi ${soma} . Você perdeu!`)
    } else if (soma%2 === 1 && typeNum === "impar"){
        console.log(`Você escolheu impar e o computador escolheu par. O resultado foi ${soma} . Você ganhou!`)
    } else{
        console.log("Deu ruim!")
    }

}
