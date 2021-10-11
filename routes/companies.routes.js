const express = require('express');
const multer = require('multer');
const config = require('../config');
const { catchError } = require('../middleware/errors');

const fileHandler = multer({ dest: config.uploads_dir });
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const companiesController = require('../controllers/companies.controller');

const filesParamsValidator = require('../middleware/validators/files.params.validator');
const filesController = require('../controllers/files.controller');

router.get(
  '/:id',
  auth,
  catchError(companiesController.get),
  /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Запрос компаний по ID.'
   #swagger.parameters['id'] = { description: 'ID Компании.' }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/CompanyResponse" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[400] = {
                schema: { $ref: "#/definitions/Error" }
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

router.get(
  '/',
  auth,
  catchError(companiesController.get),
  /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Запрос всех компаний или компаний по фильтру.'
   #swagger.parameters['name'] = { description: 'Компании с определенным полным названием.',
               type: 'string' }
               
   #swagger.parameters['status'] = { description: 'Компании с определенным статусом.',
               type: 'string' }
   #swagger.parameters['shortName'] = { description: 'Компании с определенным коротким названием.',
               type: 'string' }
    #swagger.parameters['contactId'] = { description: 'Компании с определенным контактом.',
               type: 'number' }
    #swagger.parameters['businessEntity'] = { description: 'Компании с определенной бизнесс-структурой.',
               type: 'string' }
   #swagger.parameters['page'] = { description: 'Номер страницы.',
               type: 'number'}
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/CompanyResponse" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[400] = {
                schema: { $ref: "#/definitions/Error" }
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

router.patch(
  '/:id',
  auth,
  catchError(companiesController.update),
   /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Изменение компании по ID.'
   #swagger.parameters['id'] = { description: 'ID Компании.' }
   #swagger.parameters['Company'] = {
               in: 'body',
               description: 'Данные компании',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/Company" }
        }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/CompanyResponse" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[400] = {
                schema: { $ref: "#/definitions/Error" }
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

router.post(
  '/',
  auth,
  catchError(companiesController.add),
  /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Добавление компании.'
   #swagger.parameters['Company'] = {
               in: 'body',
               description: 'Данные компании',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/Company" }
        }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/CompanyResponse" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[400] = {
                schema: { $ref: "#/definitions/Error" }
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

router.post(
  '/:id/image',
  auth,
  fileHandler.fields([{ name: 'file', maxCount: 1 }]),
  filesParamsValidator.addCompanyImage,
  filesController.saveImage,
  /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Загрузка картинки Компании по ID.'
   #swagger.parameters['id'] = { description: 'ID Компании.' }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/CompanyResponse" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

router.delete(
  '/:id/image/:image_name',
  auth,
  filesParamsValidator.removeCompanyImage,
  filesController.removeImage,
  /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Удаление картинки Компании по имени.'
   #swagger.parameters['id'] = { description: 'ID Компании.' }
   #swagger.parameters['image_name'] = { description: 'Имя картинки.' }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/CompanyResponse" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

router.delete(
  '/:id',
  auth,
  catchError(companiesController.del),
  /* #swagger.tags = ['Company']
  #swagger.security = [{
               "BearerAuth": []
        }]
   #swagger.description = 'Удаление Компании по ID.'
   #swagger.parameters['id'] = { description: 'ID Компании.' }
   #swagger.responses[200] = {
               schema: { $ref: "#/definitions/DeleteCompany" },
               description: 'Положительный ответ.'
        }
   #swagger.responses[401] = {
             schema: { $ref: "#/definitions/Error" }
      }
   #swagger.responses[500] = {
             schema: { $ref: "#/definitions/Error" }
      }
   */
);

module.exports = router;
