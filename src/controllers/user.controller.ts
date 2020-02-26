import { Request, Response } from 'express'
import User from '../models/user'



export class UserController {


    public async load(request: Request, responce: Response, next, id) {
        try {
            const result = await this._load(id);
            responce.send(result);
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    public async list(request: Request, responce: Response, next) {
        try {
            const result = await this._list(request.params.userId);
            responce.send(result);
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    public async me(request: Request, responce: Response) {
        try {
            responce.status(200).json({ user: request.body.authUser })
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    public async get(request: Request, responce: Response) {
        try {
            return responce.json(request.body.user)
        } catch (error) {
            responce.status(500).send(error);
        }
    }


    private async _load(userId): Promise<any> {
        return await User.findById(userId);
    }

    private async _list(userId: string): Promise<any> {
        return await User.find({ _id: { $ne: userId } }).exec();
    }

}