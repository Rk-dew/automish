import defineApp from '../../helpers/define-app';

export default defineApp({
  name: 'RSS',
  key: 'rss',
  iconUrl: '{BASE_URL}/apps/rss/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/rss',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: 'ff8800',
  beforeRequest: [],
});
