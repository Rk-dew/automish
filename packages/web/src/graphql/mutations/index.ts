import { CREATE_CONNECTION } from './create-connection';
import { UPDATE_CONNECTION } from './update-connection';
import { VERIFY_CONNECTION } from './verify-connection';
import { RESET_CONNECTION } from './reset-connection';
import { DELETE_CONNECTION } from './delete-connection';
import { CREATE_AUTH_LINK } from './create-auth-link';

type Mutations = {
  [key: string]: any,
}

const mutations: Mutations = {
  createConnection: CREATE_CONNECTION,
  updateConnection: UPDATE_CONNECTION,
  verifyConnection: VERIFY_CONNECTION,
  resetConnection: RESET_CONNECTION,
  deleteConnection: DELETE_CONNECTION,
  createAuthLink: CREATE_AUTH_LINK,
};

export default mutations;
