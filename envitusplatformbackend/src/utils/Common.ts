import multer from 'multer';
import path from 'path';

/**
 *  Pagination
 *  @method getPagination
 *  @param
 */
export const getPagination = (total: number, skip: number, limit: number) => {
    return new Promise((resolve, reject) => {
        resolve({
            totalItems: total,
            skip: skip,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            currentPage: total === 0 ? 0 : Math.ceil(skip / limit) + 1,
        });
    });
}

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

/**
 *  Multer memory storage
 *
 * @param req
 */
export const uploadMemoryStorage = multer({ storage: multer.memoryStorage() });

export const uploadDiskStorage = multer({ storage: storage });

export const seedData = {
    devices: ['70B3D5098068', '70B3D509806A', '70B3D5098059', '70B3D5098058'],
    params : ['temperature', 'pressure', 'humidity', 'CO2', 'PM1', 'PM2p5', 'PM10', 'SO2', 'NO2', 'CO', 'CO2', 'NO2', 'SO2', 'O3', 'noise', 'UV', 'rain', 'receivedTime']
}