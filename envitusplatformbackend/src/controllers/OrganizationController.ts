import { getPagination } from '@utils';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { Devices } from '../models/Devices';
import { User } from '../models/Users';
import { Organization } from '../models/Organization';


const updateOrg = (type: string, filter: object, update: object) => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'many':
                Organization.updateMany(filter, update, {}, function (err: any, data: any) {
                    resolve(data)
                })
                break;
            default:
                break;
        }
    });
}

/**
 * Add new device
 *
 * @param
 */
export const addOrganization = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { name, description, is_default, devices, users } = req.body;
    const orgDetails: any = {
        name: name,
        description: description,
        createdBy: Types.ObjectId(req.body.user_id)
    }

    if (is_default != undefined && is_default) {
        orgDetails.isDefault = true;
        await updateOrg('many', { isDeleted: false, isDefault: true }, { isDefault: false });
    }
    const organization = new Organization(orgDetails)
    organization.save(async function (err: any, org: any) {
        if (err) { return }
        if (org) {
            if (devices) {
                const deviceIds = devices.map((x: string | number | undefined) => Types.ObjectId(x));
                await Devices.updateMany({ _id: { $in: deviceIds } }, { organizationId: Types.ObjectId(org._id) }, {}, function (err: any, data: any) { })
            }
            if (users) {
                const userIds = users.map((x: string | number | undefined) => Types.ObjectId(x));
                await User.updateMany({ _id: { $in: userIds } }, { $addToSet: { organization: Types.ObjectId(org._id) } }, {}, function (err: any, data: any) { })
            }
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Document created successfully",
                org_details: org
            });
        }

    })
}


/**
 * List device
 *
 * @param
 */
export const listOrganization = (req: Request, res: Response) => {
    const { skip, limit } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false };
    Organization.aggregate([
        { $match: match },
        { '$sort': { 'createdAt': -1 } },
        {
            '$facet': {
                metadata: [{ $count: "total" }],
                data: [{ $skip: parseInt(pageSkip) }, { $limit: parseInt(pageLimit) }]
            }
        }
    ], async function (err: any, data: any) {
        const response: any = {
            pagination: {},
            list: []
        }
        if (data[0]) {
            if (data[0].metadata[0]) {
                response.pagination = await getPagination(data[0].metadata[0].total, parseInt(pageSkip), parseInt(pageLimit))
            }
            response.list = data[0].data
        }
        return res.status(StatusCodes.OK).json({
            ssuccess: true,
            message: "Successfully retrived data",
            organizations: response.list,
            pagination: response.pagination
        });
    })
}

/**
 * Update device
 *
 * @param
 */
export const updateOrganization = async (req: Request, res: Response) => {
    const { name, description, is_default, users, devices } = req.body;
    let updateData: any = {};
    name ? updateData.name = name : '';
    description ? updateData.description = description : '';
    if (is_default != undefined && (is_default || !is_default)) {
        updateData.isDefault = is_default
        if (is_default) {
            await Organization.updateMany({ isDeleted: false, isDefault: true }, { isDefault: false }, {}, function (err: any, data: any) { })
        }
    }
    if (devices) {
        await Devices.updateMany({ organizationId: Types.ObjectId(req.params.id) }, { organizationId: null }, {}, function (err: any, data: any) { })
        devices.forEach(async (id: any) => {
            await Devices.findByIdAndUpdate(id, { organizationId: Types.ObjectId(req.params.id) }, {}, function (err: any, data: any) { })
        });
    }

    if (users) {
        await User.updateMany({ organization: { $in: [Types.ObjectId(req.params.id)] } }, { $pull: { organization: Types.ObjectId(req.params.id) } }, {}, function (err: any, data: any) { })
        users.forEach(async (id: any) => {
            await User.findByIdAndUpdate(id, { $addToSet: { organization: Types.ObjectId(req.params.id) } }, {}, function (err: any, data: any) { })
        });
    }

    Organization.findByIdAndUpdate(req.params.id, updateData, { new: true }, function (err: any, org: any) {
        if (err) { }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated organization details",
            org_details: org
        });
    })
}


/**
 * Update device
 *
 * @param
 */
export const getOrganizationDetails = (req: Request, res: Response) => {
    const pipeline: any = [
        {
            $match: { _id: Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                "from": "users",
                "let": { "orgId": "$_id" },
                "pipeline": [
                    { $match: { $expr: { $in: ["$$orgId", "$organization"] } } },
                    { $project: { _id: 1, name: 1 } }
                ],
                as: "users"
            }
        },
        {
            $lookup: {
                "from": "devices",
                "let": { "orgId": "$_id" },
                "pipeline": [
                    { $match: { $expr: { $eq: ["$$orgId", "$organizationId"] } } },
                    { $project: { _id: 1, deviceId: 1 } }
                ],
                as: "devices"
            }
        }
    ]
    Organization.aggregate(pipeline, function (err: any, org: any) {
        console.log(err)
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Organization details",
            org_details: org[0]
        });
    })
}


/**
 * Update device
 *
 * @param
 */
export const deleteOrganization = (req: Request, res: Response) => {
    Organization.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }, async function (err: any, org: any) {
        if (err) { }
        await Devices.updateMany({ organizationId: Types.ObjectId(req.params.id) }, { organizationId: null }, {}, function (err: any, data: any) { })
        await User.updateMany({ organization: { $in: [Types.ObjectId(req.params.id)] } }, { $pull: { organization: Types.ObjectId(req.params.id) } }, {}, function (err: any, data: any) { })
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully deleted the organization"
        });
    })
}

/**
* Get user organization ids
*
* @method  getOrganizationIds
* 
* @param   req
* @param   res
*/
export const getOrganizationIds = (req: Request, res: Response) => {
    const pipeline: any = [
        {
            $match: { _id: Types.ObjectId(req.body.user_id) }
        },
        {
            $lookup: {
                "from": "organizations",
                "let": { "organization": "$organization" },
                "pipeline": [
                    { $match: { $expr: { $in: ["$_id", "$$organization"] } } },
                    { $project: { _id: 1, name: 1 } }
                ],
                as: "organization"
            }
        },
        {
            $project: {
                organization: 1
            }
        }
    ]
    User.aggregate(pipeline, function (err: any, ids: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            organization_ids: ids[0].organization || []
        });
    })
}