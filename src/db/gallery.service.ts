import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

// in memory db
const db = { gallery: [] };
let gallery = db.gallery;

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

  deleteAll() {
    gallery = [];
  }
}
