import isEmpty from 'lodash/isEmpty.js';

import Flow from '../models/flow.js';
import { processTrigger } from '../services/trigger.js';
import { executeTrigger } from '../jobs/execute-trigger.js';
import globalVariable from './global-variable.js';
import QuotaExceededError from '../errors/quote-exceeded.js';

export default async (flowId, request, response) => {
  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const user = await flow.$relatedQuery('user');

  const testRun = !flow.active;
  const quotaExceeded = !testRun && !(await user.isAllowedToRunFlows());

  if (quotaExceeded) {
    throw new QuotaExceededError();
  }

  const triggerStep = await flow.getTriggerStep();
  const app = await triggerStep.getApp();
  const isWebhookApp = app.key === 'webhook';

  if (testRun && !isWebhookApp) {
    return response.status(404);
  }

  const connection = await triggerStep.$relatedQuery('connection');

  const $ = await globalVariable({
    flow,
    connection,
    app,
    step: triggerStep,
    testRun,
    request,
  });

  const triggerCommand = await triggerStep.getTriggerCommand();
  await triggerCommand.run($);

  const reversedTriggerItems = $.triggerOutput.data.reverse();

  // This is the case when we filter out the incoming data
  // in the run method of the webhook trigger.
  // In this case, we don't want to process anything.
  if (isEmpty(reversedTriggerItems)) {
    return response.status(204);
  }

  for (const triggerItem of reversedTriggerItems) {
    if (testRun) {
      await processTrigger({
        flowId,
        stepId: triggerStep.id,
        triggerItem,
        testRun,
      });

      continue;
    }

    await executeTrigger({ flowId, triggerStep, triggerItem });
  }

  return response.status(204);
};
