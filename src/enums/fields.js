const FIELDS = Object.freeze({
    CATEGORIES: {
        NAME: 'name'
    },

    GAMES: {
        NAME: 'name',
        IMAGE: 'image',
        STOCK_TOTAL: '"stockTotal"',
        CATEGORY_ID: '"categoryId"',
        PRICE_PER_DAY: '"pricePerDay"'
    },

    CUSTOMERS: {
        NAME: 'name',
        PHONE: 'phone',
        CPF: 'cpf',
        BIRTHDAY: 'birthday',
    },

    RENTALS: {
        CUSTOMER_ID: '"customerId"',
        GAME_ID: '"gameId"',
        RENT_DATE: '"rentDate"',
        DAYS_RENTED: '"daysRented"',
        RETURN_DATE: '"returnDate"',
        ORIGINAL_PRICE: '"originalPrice"',
        DELAY_FEE: '"delayFee"'
    }
})

export { FIELDS }