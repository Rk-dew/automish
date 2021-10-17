export const DASHBOARD = '/dashboard';
export const APPS = '/apps';
export const FLOWS = '/flows';
export const EXPLORE = '/explore';
export const APP = (appSlug: string) => `/app/${appSlug}`;
export const APP_PATTERN = '/app/:slug';
export const APP_CONNECTIONS = (appSlug: string) => `/app/${appSlug}/connections`;
export const APP_CONNECTIONS_PATTERN = '/app/:slug/connections';
export const APP_ADD_CONNECTION = (appSlug: string) => `/app/${appSlug}/connections/add`;
export const APP_ADD_CONNECTION_PATTERN = '/app/:slug/connections/add';
export const APP_FLOWS = (appSlug: string) => `/app/${appSlug}/flows`;
export const APP_FLOWS_PATTERN = '/app/:slug/flows';

export const NEW_APP_CONNECTION = '/apps/new';