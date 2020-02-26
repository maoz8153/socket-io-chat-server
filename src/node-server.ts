import { createServer, Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import { MongodbService } from './core/mongodb.service.core';
import { UserRoute } from './routes/user.route';
import { ConversationRoute } from './routes/conversation.route';
import { AuthRoute } from './routes/auth.route';
import { Router } from 'express'
import { ConfigService, IConfig } from './core/config.service.core';
import { JwtRoute } from './routes/jwt.route';
import { SocketIOService } from './core/socketio.service.core';


export class NodeServer {
    private app: express.Application;
    private router: Router;
    private server: Server;
    private config: IConfig;
    private socketService: SocketIOService;

    constructor() {
        this.initEnvSettings();
        this.createApp();
        this.createServer();
        this.initExpressMiddleWare();
        this.createSocket();
        this.createDbConnection();
        this.initRoutes();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private initEnvSettings(): void {
        this.config = new ConfigService().environment;
    }

    private initExpressMiddleWare(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private createDbConnection() {
        const dbConn = new MongodbService(this.config.DB_URI, this.config.DB_NAME);
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private createSocket(): void {
        this.socketService = new SocketIOService(this.server);
    }

    private initRoutes(): void {
        this.router = Router();
        new JwtRoute(this.router);
        new AuthRoute(this.router);
        new UserRoute(this.router);
        new ConversationRoute(this.router);
        this.app.use(this.router);
    }


    private listen(): void {
        this.server.listen(this.config.NODE_PORT, () => {
            console.log('Running server on port %s', this.config.NODE_PORT);
            this.socketService.createSocketEvents();

        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
