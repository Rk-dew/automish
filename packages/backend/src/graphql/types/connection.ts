import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import connectionDataType from './connection-data';

const connectionType = new GraphQLObjectType({
  name: 'Connection',
  fields: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appType = require('./app').default;

    return {
      id: { type: GraphQLString },
      key: { type: GraphQLString },
      data: { type: connectionDataType },
      verified: { type: GraphQLBoolean },
      app: { type: appType },
      createdAt: { type: GraphQLString },
    };
  },
});

export default connectionType;
