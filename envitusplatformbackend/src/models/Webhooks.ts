import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let WebhookSchema = new Schema({
    url : { type: String, required: true, unique: true },
    sensorData:{ type: Boolean, required: true},
    alerts:{ type: Boolean, required: true},
    secretKey:{ type: String, required: true},
    createdBy:{ type: mongoose.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
}, { timestamps: true });

WebhookSchema.methods.toJSON = function () {
    const webhook = this
    const webhookObject = webhook.toObject()
    return returnFilter(webhookObject)
}

WebhookSchema.statics.returnFilter = returnFilter

export const Webhook = mongoose.model("Webhook", WebhookSchema);