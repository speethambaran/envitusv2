import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let AlarmRuleSchema = new Schema({
    ruleName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    clearingMode: { type: String, required: true },
    timeInterval: { type: String },
    date: { type: String},
    deviceIDs: { type: Array},
    deviceIds: { type: Array},
    info: { type: Object },
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true },
    logs: { type: Array, default: [] }
}, { timestamps: true })

AlarmRuleSchema.methods.toJSON = function () {
    const rule = this;
    const ruleObj = rule.toObject();
    return returnFilter(ruleObj);
}

AlarmRuleSchema.statics.returnFilter = returnFilter;

export const AlarmRule = mongoose.model("Alarm_Rule", AlarmRuleSchema);