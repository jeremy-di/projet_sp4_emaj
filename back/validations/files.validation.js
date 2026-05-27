import joi from "joi";
export default function filesValidation(body){
    const filesCreate = joi.object({
      name: joi.string().required(),
      alt: joi.string(),
      user: joi.string()
    
    })

    return {
        filesCreate: filesCreate.validate(body),
    }
}
