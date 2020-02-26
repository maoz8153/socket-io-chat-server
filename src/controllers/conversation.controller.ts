import { Request, Response } from 'express'
import Conversation from '../models/conversation'
import Message from '../models/message'

export class ConversationController {


    public async list(request: Request, responce: Response) {
        try {
            const result = await this._list(request.params.userId);
            return responce.status(200).json(result)
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    public async get(request: Request, responce: Response) {
        try {
            const result = await this._get(request.params.id, request['authUser'].id);
            responce.send(result);
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    public async create(request: Request, responce: Response) {
        try {
            const result = await this._create( request['authUser'].id, request.params.id);
            responce.send(result);
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    public async createMessage(request: Request, responce: Response) {
        try {
          const replay =  await this._createMessage(request.body, request.params.conversationId, request['authUser'].id);
            responce.status(200).send(replay);
        } catch (error) {
            responce.status(500).send(error);
        }
    }

    

    private async _list(userId: string): Promise<any> {
       return await Conversation.find({ participants: { $in: [userId] } })
        .select('_id, participants')
        .exec((err, conversations) => {
          if (err) {
            throw err;
          }
          return conversations;
        })
    }

    private async _create(userId, recipient): Promise<any> {
        const existingConversation = await Conversation.findOne({ participants: { $all: [userId, recipient] } })
        if (existingConversation) {
            return await Message.find({ conversationId: existingConversation._id })
                .select('createdAt body author')
        } else {
            const conversation = await this._createConversation(userId, recipient);
            const message = new Message({
                conversationId: conversation._id,
                body: 'I am inviting you to start conversation with me', // later on we can set permission to accpet/declient chat invitation
                author: userId
              })
             await message.save();
             return conversation;
        }
    }

    private async _createConversation(userId, recipient){
        const newConversation = new Conversation({
            participants: [userId, recipient]
          })
          return await newConversation.save();
    }

    private async _get(id, userId): Promise<any> {
        const conversation =  await Conversation.findOne({
            _id: id,
            participants: {
              $in: [userId]
            }
          })
          if (conversation) {
              return await  Message.find({ conversationId: conversation._id })
              .select('createdAt body author');
          }
    }

    private async _createMessage(message, conversationId, userId): Promise<any> {
        const reply = new Message({
            conversationId: conversationId,
            body: message,
            author:userId
          })
          return await reply.save();
    }
}