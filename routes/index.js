const { Router } = require('express');
const authRouter = require('./auth.routes');
const companiesRouter = require('./companies.routes');
const contactsRouter = require('./contacts.routes');

const router = Router();

router.use('/auth', authRouter);
router.use('/companies', companiesRouter);
router.use('/contacts', contactsRouter);

// eslint-disable-next-line consistent-return
module.exports = router;
