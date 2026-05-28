import crypto from "node:crypto"

const KEY = Buffer.from(process.env.MSG_ENC_KEY || "", "hex")

if (KEY.length !== 32) {
    throw new Error("key length is unvalid")
}

export const encrypt = (plain) => {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv)
    const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
    const tag = cipher.getAuthTag()
    return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`
}

export const decrypt = (stored) => {
    const [ivHex, tagHex, dataHex] = stored.split(":")
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, Buffer.from(ivHex, "hex"))
    decipher.setAuthTag(Buffer.from(tagHex, "hex"))
    return decipher.update(Buffer.from(dataHex, "hex")) + decipher.final("utf8")
}
