import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let AqiSchema = new Schema({
    deviceId: {
        type: mongoose.Types.ObjectId, required: true
    },
    data: {
        type: Object, required: true
    },
    dateTime: { type: Date },
    aqi: { type: Number },
    prominentPollutant: { type: String },
}, { timestamps: true });

AqiSchema.methods.toJSON = function () {
    const aqi = this
    const aqiObject = aqi.toObject()
    return returnFilter(aqiObject)
}

AqiSchema.statics.returnFilter = returnFilter

export const Aqi = mongoose.model("Aqi", AqiSchema);