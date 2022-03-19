import App from '../../models/app';
import Context from '../../types/express/context';

type Params = {
  stepId: string;
  key: string;
};

const getData = async (_parent: unknown, params: Params, context: Context) => {
  const step = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .findById(params.stepId);

  const connection = step.connection;

  const appData = App.findOneByKey(step.appKey);
  const AppClass = (await import(`../../apps/${step.appKey}`)).default;

  const appInstance = new AppClass(appData, connection.formattedData);
  const command = appInstance.data[params.key];
  const fetchedData = await command.run();

  return fetchedData;
};

export default getData;
