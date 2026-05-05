import crypto from "crypto";

export const hashData = (data) =>
  crypto.createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

export const uuidToBytes32 = (uuid) =>
  "0x" + crypto.createHash("sha256").update(uuid).digest("hex");