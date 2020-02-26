import { Request, Response } from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'



export class AuthController {

     SECRET_KEY =  'ewtijwebgiuweg9w98u928398t!!u1dh28h1t1h9u9h@$$'

    public async register(request: Request, responce: Response) {
        try {
            const { username, name, password } = request.body;
            const result = await this._register(username, name, password);
            responce.send(result);
        } catch (error) {
            responce.status(500).send(error);

        }
    }

    public async login(request: Request, responce: Response) {
        try {
            const { username, name, password } = request.body;
            const result = await this._login(username, name, password);
            responce.send(result);
        } catch (error) {
            responce.status(500).send(error);

        }
    }

    public async logout(request: Request, responce: Response) {
        responce.json({ ok: true })
    }

    private async _checkIfUserExsit(username: string): Promise<any> {
        return await User.findOne({ username: username })
    }

    private async _register(username: string, password, name): Promise<any> {
        const user = new User({
            username,
            password,
            name
          })
        return await user.save();
    }

    private async _login(username, password, next): Promise<any> {
      const user = await User.findOne({ username: username });
        
            // If user found unique set session and return user data
            if (user) {
                user.schema.methods.comparePassword(password, (err, isMatch) => {
                if (err) { return next(err) }
        
                if (isMatch) {
                  return { token: jwt.sign(user.toJSON(), this.SECRET_KEY) }
                } else {
                    throw err('Bad credentials');
                }
              })
            } else {
                throw ('Bad credentials');
            }
    }


}