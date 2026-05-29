import joi from "joi";

export default function userValidation(body){
    const userCreate = joi.object({
      email: joi.string().email().trim().required().messages({
    "string.empty" : "L'email est obligatoire",
    "string.email" : "L'email n'est pas valide",
    "any.required" : "L'email est obligatoire"
}),
      password: joi.string().min(15).max(64).required().messages({
        "string.empty" : "Le mot de passe est obligatoire",
        "string.min" : "Le mot de passe doit contenir au moins 15 caractères",
        "string.max" : "Le mot de passe ne doit pas dépasser 64 caractères",
        "any.required" : "Le mot de passe est obligatoire"
      }),
      username: joi.string().min(3).max(10).required().messages({
        "string.empty" : "Le login est obligatoire",
        "string.min" : "Le login doit contenir au moins 3 caractères",
        "string.max" : "Le login ne doit pas dépasser 10 caractères",
        "any.required" : "Le login est obligatoire"
      }),
      isBlocked: joi.boolean(),
      twoFactorEnabled: joi.boolean(),
      role: joi.string()
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
