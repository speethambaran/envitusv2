import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

export type DeviceErrorDocument = mongoose.Document & {
    errorType: string;
    isDeleted: boolean;
};

let DeviceErrorSchema = new Schema({
    deviceId: { type: mongoose.Types.ObjectId, required: true },
    sensorDataId: { type: mongoose.Types.ObjectId, required: true },
    errorType: { type: String, enum: ['er_init_sensor', 'er_read_sensor', 'er_system', 'er_data_range'], required: true },
    errorDetails: { type: String, required: true },
    receivedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

DeviceErrorSchema.methods.toJSON = function () {
    const org = this;
    const orgObject = org.toObject();
    return returnFilter(orgObject);
}
DeviceErrorSchema.statics.returnFilter = returnFilter;

// Export the model
export const DeviceErrors = mongoose.model<DeviceErrorDocument>("Device_Errors", DeviceErrorSchema);