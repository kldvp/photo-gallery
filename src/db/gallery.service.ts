import { Injectable } from '@nestjs/common';
import * as Loki from 'lokijs';
import { v4 as uuidv4 } from 'uuid';

const db = new Loki('data.db', { persistenceMethod: 'memory' });
const gallery = db.addCollection('gallery', { disableMeta: true });

@Injectable()
export class GalleryService {
  constructor() {}

  findAll() {
    const listUsers = gallery.find({});
    return listUsers;
  }

  find(condition: object) {
    return gallery.find(condition);
  }

  add(record: any) {
    record.id = uuidv4();
    const rec = gallery.insert(record);
    return rec;
  }

  remove(id: string) {
    gallery.remove({ id });
    return true;
  }
}
