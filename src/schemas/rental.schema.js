import joi from "joi"

const rentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    rentDate: joi.date().iso().max('now').required(),
    daysRented: joi.number().greater(0).required(),
    returnDate: [joi.date().iso().max('now'), joi.any().valid(null)],
    originalPrice: joi.number().required(),
    delayFee: [joi.date().iso().max('now'), joi.any().valid(null)]
})

export default rentalSchema

/*
{
  id: 1,
  customerId: 1,
  gameId: 1,
  rentDate: '2021-06-20',    // data em que o aluguel foi feito
  daysRented: 3,             // por quantos dias o cliente agendou o aluguel
  returnDate: null,          // data que o cliente devolveu o jogo (null enquanto não devolvido)
  originalPrice: 4500,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
  delayFee: null             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
}
*/