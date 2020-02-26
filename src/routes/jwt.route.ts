import { Router } from 'express'
import jwt from 'jsonwebtoken'

export class JwtRoute {

    SECRET_KEY =  'ewtijwebgiuweg9w98u928398t!!u1dh28h1t1h9u9h@$$'

    constructor(router: Router) {
        this.createRoutes(router);
    }

    private createRoutes(router) {
        router.use(function (req, res, next) {
            // check header or url parameters or post parameters for token
            let token = req.get('Authorization') || req.body.token || req.query.token || req.headers['x-access-token']
          
            // decode token
            if (token) {
              // verifies secret and checks exp
              jwt.verify(token, this.SECRET_KEY, function (err, authUser) {
                if (err) {
                  return res.status(401).json({ success: false, message: 'Failed to authenticate token.' })
                } else {
                  // if everything is good, save to request for use in other routes
                  req.authUser = authUser
                  next()
                }
              })
            } else {
              // if there is no token
              // return an error
              return res.status(403).send({
                success: false,
                message: 'No token provided.'
              })
            }
          })
    }

}