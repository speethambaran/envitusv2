import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let CalibrationSchema = new Schema({
    certificateId: { type: String, required: true },
    expireDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
    deviceId: { type: mongoose.Types.ObjectId, required: true },
    device: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true },
    fileName: { type: String, required: true },
    fileLocation: { type: String, required: true }
}, { timestamps: true });

CalibrationSchema.methods.toJSON = function () {
    const calibration = this
    const calibrationObject = calibration.toObject()
    return returnFilter(calibrationObject)
}

CalibrationSchema.statics.returnFilter = returnFilter

export const Calibration = mongoose.model("Calibration", CalibrationSchema);