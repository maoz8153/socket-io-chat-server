import { Router } from 'express'
import { UserController } from '../controllers/user.controller';

export class UserRoute {

    private userController: UserController;

    constructor(router: Router) {
        this.userController = new UserController();
        this.createRoutes(router);
    }

    private createRoutes(router) {
        router.get('/users/me', this.userController.me.bind(this.userController));
        router.get('/users/:userId', this.userController.get.bind(this.userController));
        router.get('/users', this.userController.list.bind(this.userController));
        router.param('userId', this.userController.load.bind(this.userController));
    }

}