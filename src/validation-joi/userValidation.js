const Joi = require('joi');


const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  otherName: Joi.string().required(),
  email: Joi.string().email().required(),
    //  email: Joi.string().email({
    //     minDomainSegments: 2,
    //     tlds: { allow: ['com', 'net'] },
    // }),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().optional(),
  state: Joi.string().optional()
});


module.exports = {
    userSchema
}
