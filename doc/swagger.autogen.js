const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '2.1.0', // by default: '1.0.0'
        title: 'REST API', // by default: 'REST API'
        description: '', // by default: ''
    },
    host: 'localhost:3228', // by default: 'localhost:3000'
    basePath: '/', // by default: '/'
    schemes: ['http'], // by default: ['http']
    consumes: ['application/json'], // by default: ['application/json']
    produces: ['application/json'], // by default: ['application/json']
    tags: [ // by default: empty Array
        {

            name: 'Auth',
            description: 'Авторизация и регистрация',
        },
        {
            name: 'Company',
            description: 'Companies endpoints',
        },
        {
            name: 'Contact',
            description: 'Contacts endpoints',

        },
        // { ... }
    ],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Авторизация',
          },
    }, // by default: empty object
    definitions: {
        Contact: {
            lastName: 'Григорьев',
            firstName: 'Сергей',
            patronymic: 'Петрович',
            phone: '79162165588',
            email: 'grigoriev@funeral.com',
          },
          ContactResponse: {
            id: 1,
            lastName: 'Григорьев',
            firstName: 'Сергей',
            patronymic: 'Петрович',
            phone: '79162165588',
            email: 'grigoriev@funeral.com',
            createdAt: (new Date()).toString(),
            updatedAt: (new Date()).toString(),
          },
          Company: {
            name: 'ООО Фирма «Перспективные захоронения»',
            shortName: 'Перспективные захоронения',
            businessEntity: 'ООО',
            contract: {
              no: '12345',
              issue_date: '2015-03-12T00:00:00Z',
            },
            type: ['agent', 'contractor'],
            status: 'active',
            photos: [
              {
                name: 'skdjfhskdjh.png',
                filepath: 'http://localhost:5000/skdjfhskdjh.png',
                thumbpath: 'http://localhost:5000/skdjfhskdjh_160x160.png',
              },
            ],
            address: 'address',
            contactId: 1,
          },
          CompanyResponse: {
            id: 1,
            name: 'ООО Фирма «Перспективные захоронения»',
            shortName: 'Перспективные захоронения',
            businessEntity: 'ООО',
            contract: {
              no: '12345',
              issue_date: '2015-03-12T00:00:00Z',
            },
            type: ['agent', 'contractor'],
            status: 'active',
            photos: [
              {
                name: 'skdjfhskdjh.png',
                filepath: 'http://localhost:5000/skdjfhskdjh.png',
                thumbpath: 'http://localhost:5000/skdjfhskdjh_160x160.png',
              },
            ],
            address: 'address',
            contactId: 1,
            createdAt: (new Date()).toString(),
            updatedAt: (new Date()).toString(),
          },
          ContactIncludCompanies: {
            id: 1,
            lastName: 'Григорьев',
            firstName: 'Сергей',
            patronymic: 'Петрович',
            phone: '79162165588',
            email: 'grigoriev@funeral.com',
            companies: [
              {
                $ref: '#/definitions/Companies',
              },
            ],
            createdAt: (new Date()).toString(),
            updatedAt: (new Date()).toString(),
          },
          CompanyIncludContact: {
            id: 1,
            name: 'ООО Фирма «Перспективные захоронения»',
            shortName: 'Перспективные захоронения',
            businessEntity: 'ООО',
            contract: {
              no: '12345',
              issue_date: '2015-03-12T00:00:00Z',
            },
            type: ['agent', 'contractor'],
            status: 'active',
            photos: [
              {
                name: 'skdjfhskdjh.png',
                filepath: 'http://localhost:5000/skdjfhskdjh.png',
                thumbpath: 'http://localhost:5000/skdjfhskdjh_160x160.png',
              },
            ],
            address: 'address',
            contact: {
              $ref: '#/definitions/Contacts',
            },
            createdAt: (new Date()).toString(),
            updatedAt: (new Date()).toString(),
          },
          AddUser: {
            $user: 'User',
            $password: 'pass',
          },
          AuthLogin: {
            token: 'token',
            expiresIn: 'expiresIn',
          },
          AuthSignup: {
            id: 1,
            login: 'User1',
          },
          Error: {
            error: 'Ошибка',
          },
          DeleteContact: {
            count: 1,
          },
          DeleteCompany: {
            count: 1,
          },
    }, // by default: empty object
};

const outputFile = './doc/swagger.json';
const endpointsFiles = [
    './routes/index.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../app'); // Your project's root file
});