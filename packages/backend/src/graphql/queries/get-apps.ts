import App from '../../models/app';
import { IApp } from '@automatisch/types';

type Params = {
  name: string;
  onlyWithTriggers: boolean;
};

const getApps = (_parent: unknown, params: Params) => {
  const apps = App.findAll(params.name);

  if (params.onlyWithTriggers) {
    return apps.filter((app: IApp) => app.triggers?.length);
  }

  return apps;
};

export default getApps;
