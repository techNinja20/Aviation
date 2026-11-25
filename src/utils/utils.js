function calculateOrder (price, quantity ){
  let totalAmountToBePaid = price * quantity
  return totalAmountToBePaid
}


 function generateOtp() {
  return Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
}

module.exports = {
    calculateOrder,
    generateOtp
}