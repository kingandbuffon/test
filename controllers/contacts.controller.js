const config = require('../config');
const { Contact } = require('../dbase');
const { BadRequest, } = require('http-errors');

module.exports = {
  get,
  update,
  add,
  del
};

// const contact = {
//   id: config.contact_id,
//   lastname: 'Григорьев',
//   firstname: 'Сергей',
//   patronymic: 'Петрович',
//   phone: '79162165588',
//   email: 'grigoriev@funeral.com',
//   createdAt: '2020-11-21T08:03:26.589Z',
//   updatedAt: '2020-11-23T09:30:00Z',
// };

const Enum = [
    "lastname",
    "firstname",
    "patronymic",
    "phone",
    "email"
]

async function get(req, res) {
  const id = req.params.id;
  if(id){
    if (!isNaN(id)){
      const rusultGetContact = await Contact.findByPk(+id);
      if (!rusultGetContact) throw new BadRequest('Contact not found');
      return res.status(200).json(rusultGetContact.GetContact());
    }
    throw new BadRequest("Invalid parameters");
  }
  const queryParams = req.query;
  let searchParam = {};
  Object.keys(queryParams).forEach((key) => {
    if(Enum.indexOf(key)!==-1) {
      searchParam[key]=queryParams[key];
    }
  });
  const configParam = {
    limit:10,
    offset:queryParams.page?(queryParams.page<=0?0:queryParams.page-1*10):0,
    where: searchParam
  };
  const users = await Contact.findAll(configParam);
  if (!users.length)  res.status(400).json()//throw new BadRequest('Contacts not found');???
  return res.status(200).json(users.map((contact) => contact.GetContact()));
}

async function add(req, res) {
  Object.keys(req.body).forEach((key) => {
    if(Enum.indexOf(key)===-1) throw new BadRequest("Invalid parameters");
  });
  const rusultAddContact = await Contact.create(req.body)
  .catch((err) => {
    if (err.original.code === '23505') throw new BadRequest("Phone or Mail already exists");
    else throw new BadRequest("DB error");
  });
  return res.status(200).json(rusultAddContact.GetContact());
}

async function del(req, res) {
  const id = req.params.id;
  if(!id) throw new BadRequest("Invalid parameters");
  if (!isNaN(id)){
    const rusultDeleteContact = await Contact.destroy({
      where: {
        id
      }
    });
    return res.status(200).json({count:rusultDeleteContact});
  }
  throw new BadRequest("Invalid parameters");
}

async function update(req, res) {
  const id = req.params.id;
  if(!id) throw new BadRequest("Invalid parameters");
  if (!isNaN(id)){
    const rusultUpdateContact = await Contact.findByPk(id);
    if (!rusultUpdateContact) throw new BadRequest('No Contact for this id');
    const requestBody = req.body;
    const updatedContact = {};
    Object.keys(requestBody).forEach((key) => {
      if(Enum.indexOf(key)!==-1) updatedContact[key] = requestBody[key];
    });
    if (Object.keys(updatedContact).length===0) throw new BadRequest("Invalid parameters");
    await rusultUpdateContact.update(
      {...updatedContact},
      {
        where: {
          id
        }
      }
    );
    return res.status(200).json(rusultUpdateContact.GetContact());
  }
  throw new BadRequest("Invalid parameters");
}
