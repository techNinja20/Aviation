export function validationMiddleWare(AnyTableToBeValidated) {

  return (req, res, next) => {
    const { value, error } = AnyTableToBeValidated.validate(req.body)
    if (error) {
      res.status(400).json({
        status: false,
        message: error.details.map((data) => data.message).join(""),
      })
      return
    }

    req.body = value

    next()
  }
}
