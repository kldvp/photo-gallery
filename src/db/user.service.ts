import { Injectable } from '@nestjs/common';
// import * as Loki from 'lokijs';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

const db = { users: [] };
const users = db.users;
// const db = new Loki('data.db', { persistenceMethod: 'memory' });
// const users = db.addCollection('users', { disableMeta: true });

@Injectable()
export class UserService {
  constructor() {}

  findAll() {
    // const listUsers = users.find({});
    return users;
  }

  find(condition: object) {
    const values = _.filter(users, condition);
    return values;
  }

  findOne(condition: object) {
    return _.find(users, condition);
  }

  add(record: any) {
    record.id = uuidv4();
    users.push(record);
    return record;
  }
}
