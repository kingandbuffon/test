const request = require('supertest');
const assert = require('assert');
const _ = require('lodash');
const qs = require('qs');

process.env.NODE_ENV = 'test';
const app = require('../app');
const { User } = require('../dbase');

let auth,refreshToken;

describe('App auth', () => {
  it('has signup', (done) => {
    request(app)
      .post('/auth/signup')
      .send({ login: 'UserTest', password: '123451' })
      .expect(201)
      .then((res) => {
        const { login } = res.body;
        assert.deepStrictEqual(login, 'UserTest');
        done();
      })
      .catch((err) => done(err));
  });
  it('has login', (done) => {
    request(app)
      .post('/auth/signin')
      .send({ login: 'UserTest', password: '123451' })
      .expect(201)
      .then(async (res,req) => {
        auth = `Bearer ${res.body.accessToken}`;
        refreshToken = res.header['set-cookie'];
        done();
      })
      .catch((err) => done(err));
  });
  it('has refresh', (done) => {
    request(app)
      .post('/auth/refresh')
      .set('Cookie',`${refreshToken}`)
      .expect(201)
      .then(async (res) => {
        auth = `Bearer ${res.body.accessToken}`;
        await User.destroy({ where: { login: 'UserTest' } });
        done();
      })
      .catch(async (err) => {
        await User.destroy({ where: { login: 'UserTest' } });
        done(err)
      });
  });
});

describe('App Contacts', () => {
  let cid;
  let cUpdatedAt;
  const testData = {
    lastname: 'Григорьев',
    firstname: 'Сергей',
    patronymic: 'Петрович',
    phone: '79162165511',
    email: 'grigori23ev@funeral.com',
  };

  it('post contact', (done) => {
    request(app)
      .post('/contacts')
      .set('Authorization', auth)
      .send(testData)
      .expect(200)
      .then((res) => {
        const { id, updatedAt } = res.body;
        assert.deepStrictEqual(_.omit(res.body, ['id', 'createdAt', 'updatedAt']), testData);
        cid = id;
        cUpdatedAt = updatedAt;
        done();
      })
      .catch((err) => done(err));
  });

  it('get all contacts', (done) => {
    request(app)
      .get('/contacts')
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('get contacts with firstName: Сергей', (done) => {
    request(app)
      .get(`/contacts?${qs.stringify({ firstname: 'Сергей' })}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.deepStrictEqual(res.body.map((item) => _.omit(item, ['id', 'createdAt', 'updatedAt'])), [testData]);
        done();
      })
      .catch((err) => done(err));
  });

  it('get contacts with firstName: test', (done) => {
    request(app)
      .get(`/contacts?${qs.stringify({ firstname: 'test' })}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('get contacts with firstName: Сергей', (done) => {
    request(app)
      .get(`/contacts?${qs.stringify({ firstname: 'Сергей' })}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.deepStrictEqual(res.body.map((item) => _.omit(item, ['id', 'createdAt', 'updatedAt'])), [testData]);
        done();
      })
      .catch((err) => done(err));
  });

  it('get contact for id', (done) => {
    request(app)
      .get(`/contacts/${cid}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        const { body } = res;
        delete body.createdAt;
        assert.deepStrictEqual(body, {
          ...testData,
          id: cid,
          updatedAt: cUpdatedAt,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('patch contact for id', (done) => {
    request(app)
      .patch(`/contacts/${cid}`)
      .set('Authorization', auth)
      .send({
        email: 'test@test.test',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        const { body } = res;
        delete body.createdAt;
        assert.notDeepStrictEqual(body.updatedAt, cUpdatedAt);
        delete body.updatedAt;
        assert.deepStrictEqual(body, {
          id: cid,
          ...Object.assign(testData, { email: 'test@test.test' }),
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('delete contact for id', (done) => {
    request(app)
      .delete(`/contacts/${cid}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.deepStrictEqual(res.body, { count: 1 });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('App Companies', () => {
  let cid;
  let contactId;
  let cUpdatedAt;
  const testData = {
    name: 'ООО Фирма «Перспективные захоронения»',
    shortName: 'Перспективные захоронения',
    businessEntity: 'ООО',
    contract: {
      no: '12345',
      issue_date: '2015-03-12T00:00:00Z'
    },
    type: ['agent', 'contractor'],
    status: 'active',
    address: 'address'
  };

  it('post company', (done) => {
    request(app)
      .post('/contacts')
      .set('Authorization', auth)
      .send({
        lastname: 'Григорьев',
        firstname: 'Сергей',
        patronymic: 'Петрович',
        phone: '79162165588',
        email: 'grigoriev@funeral.com',
      })
      .expect(200)
      .then((res) => {
        const { id } = res.body;
        contactId = id;

        return request(app)
          .post('/companies')
          .set('Authorization', auth)
          .send(Object.assign(testData, { contactId, photos: [] }))
          // .expect('Content-Type', /json/)
          .expect(201)
          .then((r) => {
            const { id, createdAt, updatedAt } = r.body;
            assert.deepStrictEqual(r.body, {
              id,
              ...testData,
              createdAt,
              updatedAt,
            });
            cid = id;
            cUpdatedAt = updatedAt;
            done();
          });
      })
      .catch((err) => done(err));
  });

  it('get all companies', (done) => {
    request(app)
      .get('/companies')
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('get companies with status: active', (done) => {
    request(app)
      .get(`/companies?${qs.stringify({ status: 'active' })}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.deepStrictEqual(res.body.map((item) => _.omit(item, ['id', 'createdAt', 'updatedAt'])), [testData]);
        done();
      })
      .catch((err) => done(err));
  });

  it('get companies with status: inactive', (done) => {
    request(app)
      .get(`/companies?${qs.stringify({ status: 'inactive' })}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('get companies with status: active', (done) => {
    request(app)
      .get(`/companies?${qs.stringify({ status: 'active' })}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.deepStrictEqual(res.body.map((item) => _.omit(item, ['id', 'createdAt', 'updatedAt'])), [testData]);
        done();
      })
      .catch((err) => done(err));
  });

  it('get company for id', (done) => {
    request(app)
      .get(`/companies/${cid}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        const { body } = res;
        delete body.createdAt;
        assert.deepStrictEqual(body, {
          id: cid,
          ...testData,
          updatedAt: cUpdatedAt,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('patch company for id', (done) => {
    request(app)
      .patch(`/companies/${cid}`)
      .set('Authorization', auth)
      .send({
        address: 'teteteteteteteet',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        const { body } = res;
        delete body.createdAt;
        assert.notDeepStrictEqual(body.updatedAt, cUpdatedAt);
        delete body.updatedAt;
        assert.deepStrictEqual(body, {
          id: cid,
          ...Object.assign(testData, { address: 'teteteteteteteet' }),
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('delete company for id', (done) => {
    request(app)
      .delete(`/companies/${cid}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.deepStrictEqual(res.body, { count: 1 });
        return request(app)
          .delete(`/contacts/${contactId}`)
          .set('Authorization', auth)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((r) => {
            assert.deepStrictEqual(r.body, { count: 1 });
            done();
          });
      })
      .catch((err) => done(err));
  });
});