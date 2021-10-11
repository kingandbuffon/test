const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const router = Router();
const { catchError } = require('../middleware/errors');

router.post('/signup',catchError(authController.signup),
/* #swagger.tags = ['Auth']
   #swagger.description = 'Авторизация по логину/паролю.'
   #swagger.parameters['User'] = {
               in: 'body',
               description: 'Параметры для входа',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/AddUser" }
        }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/AuthLogin" },
               description: 'Верная авторизация.'
        }
   #swagger.responses[400] = {
                schema: { $ref: "#/definitions/Error" }
        }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
  );

router.post('/signin',catchError(authController.signin),
/* #swagger.tags = ['Auth']
 #swagger.description = 'Регистрация по логину/паролю.'
 #swagger.parameters['newUser'] = {
             in: 'body',
             description: 'Параметры для входа',
             required: true,
             type: 'object',
             schema: { $ref: "#/definitions/AddUser" }
      }
 #swagger.responses[200] = {
             schema: { $ref: "#/definitions/AuthSignup" },
             description: 'Пользователь создан.'
      }
 #swagger.responses[400] = {
             schema: { $ref: "#/definitions/Error" }
      }
 #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */);

router.post('/refresh', catchError(authController.refresh),
/* #swagger.tags = ['Auth']
 #swagger.description = 'Обновление succsess токена по refresh токену.'

 #swagger.responses[200] = {
             schema: { $ref: "#/definitions/AuthSignup" },
             description: 'Пользователь создан.'
      }
 #swagger.responses[400] = {
             schema: { $ref: "#/definitions/Error" }
      }
 #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */);

module.exports = router;
