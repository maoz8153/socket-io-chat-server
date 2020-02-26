import { Router } from 'express'
import { ConversationController } from '../controllers/conversation.controller';



export class ConversationRoute {

    private conversationController: ConversationController;

    constructor(router: Router) {
        this.conversationController = new ConversationController();
        this.createRoutes(router);
    }

    private createRoutes(router: Router) {
        router.get('/api/conversations', this.conversationController.list.bind(this.conversationController));
        router.post('/conversation', this.conversationController.create.bind(this.conversationController));
        router.get('/conversation/:id', this.conversationController.get.bind(this.conversationController));
        router.post('/send-message/:conversationId', this.conversationController.createMessage.bind(this.conversationController));
    }

}