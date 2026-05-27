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

    const userUpdateMe = joi.object({
      username: joi.string(),
      email: joi.string(),
    })

    const userLogin = joi.object({
      email: joi.string().email(),
      password: joi.string(),
    })

    return {
        userCreate: userCreate.validate(body),
        userUpdate: userUpdate.validate(body),
        userUpdateMe: userUpdateMe.validate(body),
        userLogin: userLogin.validate(body),
    }
}
