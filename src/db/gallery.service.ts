import { Injectable } from '@nestjs/common';
// import * as Loki from 'lokijs';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

// const db = new Loki('data.db', { persistenceMethod: 'memory' });
// const gallery = db.addCollection('gallery', { disableMeta: true });

const db = { gallery: [] };
const gallery = db.gallery;

@Injectable()
export class GalleryService {
  constructor() {}

  findAll() {
    return gallery;
  }

  find(condition: object) {
    const values = _.filter(gallery, condition);
    return values;
  }

  findOne(condition: object) {
    return _.find(gallery, condition);
  }

  add(record: any) {
    record.id = uuidv4();
    gallery.push(record);
    return record;
  }
}
