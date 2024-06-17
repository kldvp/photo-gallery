import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  greet(): string {
    return 'Hello World with Nest.js';
  }
}
