 const createAirportSchema = Joi.object({
  airport_name: Joi.string().required(),
  city: Joi.string().required().messages({
    'string.empty': 'City cannot be empty',
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country cannot be empty',
  }),
  country_code: Joi.string().length(3).optional().messages({
    'string.length': 'Country code must be 3 characters long',
  }),
});




module.exports = {
    createAirportSchema
}