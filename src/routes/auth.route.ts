import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller';

export class AuthRoute {

    private authController: AuthController;

    constructor(router: Router) {
        this.authController = new AuthController();
        this.createRoutes(router);
    }

    private createRoutes(router: Router) {
        router.post('/auth/register', this.authController.register.bind(this.authController));
        router.post('/auth/login', this.authController.login.bind(this.authController));
        router.post('/auth/logout', this.authController.logout.bind(this.authController));
    }

}