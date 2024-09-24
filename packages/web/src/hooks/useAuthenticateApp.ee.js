import * as React from 'react';

import {
  processMutation,
  processOpenWithPopup,
  processPopupMessage,
} from 'helpers/authenticationSteps';
import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import useFormatMessage from './useFormatMessage';
import useAppAuth from './useAppAuth';
import useCreateConnection from './useCreateConnection';
import useCreateConnectionAuthUrl from './useCreateConnectionAuthUrl';
import useUpdateConnection from './useUpdateConnection';
import useResetConnection from './useResetConnection';

function getSteps(auth, hasConnection, useShared) {
  if (hasConnection) {
    if (useShared) {
      return auth?.sharedReconnectionSteps;
    }
    return auth?.reconnectionSteps;
  }

  if (useShared) {
    return auth?.sharedAuthenticationSteps;
  }

  return auth?.authenticationSteps;
}

export default function useAuthenticateApp(payload) {
  const { appKey, appAuthClientId, connectionId, useShared = false } = payload;
  const { data: auth } = useAppAuth(appKey);
  const { mutateAsync: createConnection } = useCreateConnection(appKey);
  const { mutateAsync: createConnectionAuthUrl } = useCreateConnectionAuthUrl();
  const { mutateAsync: updateConnection } = useUpdateConnection();
  const { mutateAsync: resetConnection } = useResetConnection();
  const [authenticationInProgress, setAuthenticationInProgress] =
    React.useState(false);
  const formatMessage = useFormatMessage();
  const steps = getSteps(auth?.data, !!connectionId, useShared);

  const authenticate = React.useMemo(() => {
    if (!steps?.length) return;

    return async function authenticate(payload = {}) {
      const { fields } = payload;
      setAuthenticationInProgress(true);

      const response = {
        key: appKey,
        appAuthClientId: appAuthClientId || payload.appAuthClientId,
        connectionId,
        fields,
      };
      let stepIndex = 0;

      while (stepIndex < steps?.length) {
        const step = steps[stepIndex];
        const variables = computeAuthStepVariables(step.arguments, response);

        try {
          let popup;

          if (step.type === 'openWithPopup') {
            popup = processOpenWithPopup(variables.url);

            if (!popup) {
              throw new Error(formatMessage('addAppConnection.popupReminder'));
            }
          }

          if (step.type === 'mutation') {
            if (step.name === 'createConnection') {
              const stepResponse = await createConnection(variables);
              response[step.name] = stepResponse.data;
              response.connectionId = stepResponse.data.id;
            } else if (step.name === 'generateAuthUrl') {
              const stepResponse = await createConnectionAuthUrl(
                response.connectionId,
              );
              response[step.name] = stepResponse.data;
            } else if (step.name === 'updateConnection') {
              const stepResponse = await updateConnection({
                ...variables,
                connectionId: response.connectionId,
              });

              response[step.name] = stepResponse.data;
            } else if (step.name === 'resetConnection') {
              const stepResponse = await resetConnection(response.connectionId);

              response[step.name] = stepResponse.data;
            } else {
              const stepResponse = await processMutation(step.name, variables);
              response[step.name] = stepResponse;
            }
          } else if (step.type === 'openWithPopup') {
            const stepResponse = await processPopupMessage(popup);
            response[step.name] = stepResponse;
          }
        } catch (err) {
          console.log(err);
          setAuthenticationInProgress(false);
          throw err;
        }
        stepIndex++;

        if (stepIndex === steps.length) {
          return response;
        }
        setAuthenticationInProgress(false);
      }
    };
  }, [
    steps,
    appKey,
    appAuthClientId,
    connectionId,
    formatMessage,
    createConnection,
    createConnectionAuthUrl,
    updateConnection,
    resetConnection,
  ]);

  return {
    authenticate,
    inProgress: authenticationInProgress,
  };
}
