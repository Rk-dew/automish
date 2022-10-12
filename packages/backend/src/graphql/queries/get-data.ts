import { IData, IJSONObject } from '@automatisch/types';
import Context from '../../types/express/context';
import App from '../../models/app';
import globalVariable from '../../helpers/global-variable';

type Params = {
  stepId: string;
  key: string;
  parameters: IJSONObject;
};

const getData = async (_parent: unknown, params: Params, context: Context) => {
  const step = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched({
      connection: true,
      flow: true,
    })
    .findById(params.stepId);

  if (!step) return null;

  const connection = step.connection;

  if (!connection || !step.appKey) return null;

  const app = await App.findOneByKey(step.appKey);
  const $ = await globalVariable({ connection, app, flow: step.flow, step });

  const command = app.data.find((data: IData) => data.key === params.key);

  const fetchedData = await command.run($);

  if (fetchedData.error) {
    throw new Error(JSON.stringify(fetchedData.error));
  }

  return fetchedData.data;
};

export default getData;
