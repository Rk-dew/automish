import { IGlobalVariable } from '@automatisch/types';
import searchTweets from './search-tweets';

export default {
  name: 'Search Tweets',
  key: 'searchTweets',
  pollInterval: 15,
  description:
    'Will be triggered when any user tweet something containing a specific keyword, phrase, username or hashtag.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Search Term',
          key: 'searchTerm',
          type: 'string',
          required: true,
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($: IGlobalVariable) {
    return await searchTweets($, {
      searchTerm: $.step.parameters.searchTerm as string,
      lastInternalId: $.flow.lastInternalId,
    });
  },

  async testRun($: IGlobalVariable) {
    return await searchTweets($, {
      searchTerm: $.step.parameters.searchTerm as string,
    });
  },
};
