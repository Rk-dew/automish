import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Connection from '../../models/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import connectionType from '../types/connection'

type Params = {
  id: string,
  data: object
}
const testConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  });

  const appClass = (await import(`../../apps/${connection.key}`)).default;

  const appInstance = new appClass(connection.data);
  const isStillVerified = await appInstance.authenticationClient.isStillVerified();

  connection = await connection.$query().patchAndFetch({
    data: connection.data,
    verified: isStillVerified
  })

  return connection;
}

const testConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => testConnectionResolver(params, req)
};

export default testConnection;
