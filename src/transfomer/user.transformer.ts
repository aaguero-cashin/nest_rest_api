import { ValueTransformer } from 'typeorm';
import { hashPassword } from '../utils/hashPassword';

class Password implements ValueTransformer {
  to(value) {
    return hashPassword(value);
  }

  from(value) {
    return value;
  }
}

export default {
  Password,
};
