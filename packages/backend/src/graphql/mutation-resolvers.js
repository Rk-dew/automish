// Converted mutations
import verifyConnection from './mutations/verify-connection.js';
import updateCurrentUser from './mutations/update-current-user.js';
import generateAuthUrl from './mutations/generate-auth-url.js';
import createConnection from './mutations/create-connection.js';
import resetConnection from './mutations/reset-connection.js';
import updateConnection from './mutations/update-connection.js';

const mutationResolvers = {
  createConnection,
  generateAuthUrl,
  resetConnection,
  updateConnection,
  updateCurrentUser,
  verifyConnection,
};

export default mutationResolvers;
