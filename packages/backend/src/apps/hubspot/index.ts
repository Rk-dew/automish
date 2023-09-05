import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import actions from './actions';
import auth from './auth';

export default defineApp({
  name: 'Hubspot',
  key: 'hubspot',
  iconUrl: '{BASE_URL}/apps/hubspot/assets/favicon.svg',
  authDocUrl: 'https://developers.hubspot.com/docs/api/crm/contacts',
  supportsConnections: true,
  baseUrl: 'https://www.hubspot.com',
  apiBaseUrl: 'https://api.hubapi.com',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
