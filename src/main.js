import "./css/index.css"
import IMask from 'imask'

const ccBgcolor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgcolor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccSVG1= document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
const colors = {
  visa: ["#436d99", "#2d57f2"],
  mastercard:["#df6f29", "#c69347"],
  default:["black", "gray"],
}

ccBgcolor1.setAttribute("fill", colors[type][0])
ccBgcolor2.setAttribute("fill", "blue")
ccSVG1.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType


// security-code
const securityCode = document.querySelector('#security-code')
const securityCodePattern ={
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    }, 
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
   
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const cardNumber = document.querySelector("#card-number")

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
   
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const AddButton = document.querySelector("#add-card")
AddButton.addEventListener("click", ()=>{
  alert("Cartão adicionado!")
} )

document.querySelector("form").addEventListener("submit", (event)=> {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", ()=>{
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerHTML = cardHolder.value.length === 0 ? "AMANDA DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", ()=>{
updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ?"123" : code
}

expirationDateMasked.on("accept", ()=>{
updateexpirationDate(expirationDateMasked.value)
})

function updateexpirationDate(date){
  const ccExpriration = document.querySelector(".cc-expiration .value")
  ccExpriration.innerText = date.length === 0 ? "02/32" : date
}


cardNumberMasked.on("accept", ()=>{
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
const ccNumber = document.querySelector(".cc-number")
ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}