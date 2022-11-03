import randomString from 'randomstring';
import jsonwebtoken from 'jsonwebtoken';
import { Request } from 'express';

interface ClientData {
    user_id: string;
    user_role: string;
}

export class JwtService {

    private readonly secret: string;
    private readonly options: object;
    private readonly VALIDATION_ERROR = 'JSON-web-token validation failed.';


    constructor() {
        this.secret = (process.env.JWT_SECRET || randomString.generate(100));
        this.options = {
            issuer: 'alcodex.com'
        };
    }


    /**
     * Encrypt data and return jwt.
     *
     * @param data
     */
    public getJwt(data: ClientData): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, this.secret, this.options, (err: any, token: any) => {
                err ? reject(err) : resolve(token);
            });
        });
    }


    /**
     * Decrypt JWT and extract client data.
     *
     * @param jwt
     */
    public decodeJwt(jwt: string): Promise<ClientData> {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err, decoded) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded as ClientData);
            });
        });
    }

    /**
     * Get JWT Token from Authorization Header.
     *
     * @param req
     */
    public getToken(req: Request): Promise<string> {
        return new Promise((resolve, reject) => {
            let token: any;
            if (!req.headers.authorization) {
                return reject(false);
            } else {
                token = req.headers.authorization.split(" ");
                return resolve(token[1]);
            }
        });
    }
}