
import { Request } from 'express';

interface UserRequest extends Request {
  user: {
    uid: string;
  };
}

export default UserRequest;
