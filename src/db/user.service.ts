import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

// in memory db
const db = { users: [] };
let users = db.users;

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

  deleteAll() {
    users = [];
  }
}
