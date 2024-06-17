import { Injectable } from '@nestjs/common';
import * as Loki from 'lokijs';
import { v4 as uuidv4 } from 'uuid';

const db = new Loki('data.db', { persistenceMethod: 'memory' });
const users = db.addCollection('users', { disableMeta: true });

@Injectable()
export class UserService {
  constructor() {}

  findAll() {
    const listUsers = users.find({});
    return listUsers;
  }

  find(condition: object) {
    const values = users.find(condition);
    return values;
  }

  findOne(condition: object) {
    return users.findOne(condition);
  }

  add(record: any) {
    record.id = uuidv4();
    const rec = users.insert(record);
    return rec;
  }

  remove(id: string) {
    users.remove({ id });
    return true;
  }
}
