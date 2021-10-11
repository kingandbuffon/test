const {
  BadRequest,
} = require('http-errors');

const {
  Company
} = require('../dbase');

module.exports = {
  get,
  update,
  del,
  add,
};



const Enum = [
  "name",
  "shortName",
  "businessEntity",
  "status",
  "contactId",
  "address"
]

async function get(req, res) {
  const id = req.params.id;
  if (id) {
    if (!isNaN(id)) {
      const rusultGetCompany = await Company.findByPk(+id);
      if (!rusultGetCompany) throw new BadRequest('Company not found');
      return res.status(200).json(rusultGetCompany.GetCompany(req));
    }
    throw new BadRequest("Invalid parameters");
  }
  const queryParams = req.query;
  let searchParam = {};
  Object.keys(queryParams).forEach((key) => {
    if (Enum.indexOf(key) !== -1) {
      searchParam[key] = queryParams[key];
    }
  });
  const configParam = {
    limit: 10,
    offset: queryParams.page ? (queryParams.page <= 0 ? 0 : queryParams.page - 1 * 10) : 0,
    where: searchParam
  };
  const companies = await Company.findAll(configParam);
  if (!companies.length) res.status(400).json()//throw new BadRequest('Company not found');???
  return res.status(200).json(companies.map((company) => company.GetCompany(req)));
}

async function add(req, res) {
  Enum.push("contract", "type", "photos");
  Object.keys(req.body).forEach((key) => {
    if (Enum.indexOf(key) === -1) {
      throw new BadRequest("Invalid parameters");
    }
    });
  const rusultAddCompany = await Company.create(req.body)
    .catch((err) => {
      if (err.original.code === '23505') throw new BadRequest("Company name already exists");
      throw new BadRequest("DB error");
    });
  return res.status(201).json(rusultAddCompany.GetCompany(req));
}

async function update(req, res) {
  const id = req.params.id;
  if (!id) throw new BadRequest("Invalid parameters");
  if (!isNaN(id)) {
    const rusultUpdateCompany = await Company.findByPk(id);
    if (!rusultUpdateCompany) throw new BadRequest('No Company for this id');
    Enum.push("contract", "type", "photos");
    const requestBody = req.body;
    const updatedCompany = {};
    Object.keys(requestBody).forEach((key) => {
      if (Enum.indexOf(key) !== -1) updatedCompany[key] = requestBody[key];
    });
    if (Object.keys(updatedCompany).length === 0) throw new BadRequest("Invalid parameters");
    await rusultUpdateCompany.update({
      ...updatedCompany
    }, {
      where: {
        id
      }
    });
    return res.status(200).json(rusultUpdateCompany.GetCompany(req));
  }
  throw new BadRequest("Invalid parameters");
}

async function del(req, res) {
  const id = req.params.id;
  if (!id) throw new BadRequest("Invalid parameters");
  if (!isNaN(id)) {
    const rusultDeleteCompany = await Company.destroy({
      where: {
        id
      }
    });
    return res.status(200).json({count:rusultDeleteCompany});
  }
  throw new BadRequest("Invalid parameters");
}