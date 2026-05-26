import joi from "joi";

export default function userValidation(body){
    const userCreate = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
      username: joi.string().required(),
      isBlocked: joi.boolean(),
      twoFactorEnabled: joi.boolean()
    })

    const userUpdate = joi.object({
      email: joi.string().email(),
      password: joi.string(),
      username: joi.string(),
      isBlocked: joi.boolean(),
      twoFactorEnabled: joi.boolean()
    })

    const userLogin = joi.object({
      email: joi.string().email(),
      password: joi.string(),
    })

    return {
        userCreate: userCreate.validate(body),
        userUpdate: userUpdate.validate(body),
        userLogin: userLogin.validate(body),
    }
}
