import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

export const deviceType = ["Sensor"];
export const deviceFamily = ["Air", "Water", "Flood"];
export const deviceGrade = ["Industrial", "Consumer"];
export const deviceDeployment = ["Outdoor", "Indoor"];

export type DeviceDocument = mongoose.Document & {
    errorType: string;
    isDeleted: boolean;
};

let DeviceSchema = new Schema({
    paramDefinitions: { type: Array, default: [] },
    deviceId: { type: String, index: true },
    type: { type: String, enum: deviceType, required: true },
    devFamily: { type: String, enum: deviceFamily, required: true },
    subType: { type: mongoose.Types.ObjectId, required: true },
    registerFrom: { type: String },
    registerTo: { type: String },
    customerName: { type: String, required: true },
    lotNo: { type: String, required: true },
    serialNo: { type: String, required: true },
    grade: { type: String, enum: deviceGrade, required: true },
    deployment: { type: String, enum: deviceDeployment, required: true },
    location: {
        city: { type: String, required: true },
        zone: { type: String, required: true },
        landMark: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        locId: { type: String },
        building: { type: String },
        floor: { type: String },
        slot: { type: String },
    },
    timeZone: { type: String, required: true },
    description: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
    lastDataReceiveTime: { type: Date },
    data: { type: Object, default: {} },
    organizationId: { type: mongoose.Types.ObjectId, required: true },
    rawAqi: { type: Number, default: 0 }
}, { timestamps: true });

DeviceSchema.methods.toJSON = function () {
    const org = this;
    const orgObject = org.toObject();
    return returnFilter(orgObject);
}
DeviceSchema.statics.returnFilter = returnFilter;

// Export the model
export const Devices = mongoose.model<DeviceDocument>("Devices", DeviceSchema);