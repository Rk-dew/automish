export const CONNECTIONS = '/connections';
export const EXPLORE = '/explore';

export const LOGIN = '/login';

export const APPS = '/apps';
export const NEW_APP_CONNECTION = '/apps/new';
export const APP = (appKey: string): string => `/app/${appKey}`;
export const APP_PATTERN = '/app/:appKey';
export const APP_CONNECTIONS = (appKey: string): string => `/app/${appKey}/connections`;
export const APP_CONNECTIONS_PATTERN = '/app/:appKey/connections';
export const APP_ADD_CONNECTION = (appKey: string): string => `/app/${appKey}/connections/add`;
export const APP_ADD_CONNECTION_PATTERN = '/app/:appKey/connections/add';
export const APP_RECONNECT_CONNECTION = (appKey: string, connectionId: string): string => `/app/${appKey}/connections/${connectionId}/reconnect`;
export const APP_RECONNECT_CONNECTION_PATTERN = '/app/:appKey/connections/:connectionId/reconnect';
export const APP_FLOWS = (appKey: string): string => `/app/${appKey}/flows`;
export const APP_FLOWS_PATTERN = '/app/:appKey/flows';

export const EDITOR = '/editor';
export const CREATE_FLOW ='/editor/create';
export const CREATE_FLOW_WITH_APP = (appKey: string) => `/editor/create?appKey=${appKey}`;
export const FLOW_EDITOR = (flowId: string): string => `/editor/${flowId}`;

export const FLOWS = '/flows';
// TODO: revert this back to /flows/:flowId once we have a proper single flow page
export const FLOW = (flowId: string): string => `/editor/${flowId}`;
export const FLOW_PATTERN = '/flows/:flowId';


export const DASHBOARD = FLOWS;
