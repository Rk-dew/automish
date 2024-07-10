import PropTypes from 'prop-types';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { EditorContext } from 'contexts/Editor';
import { StepExecutionsProvider } from 'contexts/StepExecutions';
import TestSubstep from 'components/TestSubstep';
import FlowSubstep from 'components/FlowSubstep';
import ChooseAppAndEventSubstep from 'components/ChooseAppAndEventSubstep';
import ChooseConnectionSubstep from 'components/ChooseConnectionSubstep';
import Form from 'components/Form';
import FlowStepContextMenu from 'components/FlowStepContextMenu';
import AppIcon from 'components/AppIcon';

import useFormatMessage from 'hooks/useFormatMessage';
import useApps from 'hooks/useApps';
import {
  AppIconWrapper,
  AppIconStatusIconWrapper,
  Content,
  Header,
  Wrapper,
} from './style';
import { StepPropType } from 'propTypes/propTypes';
import useTriggers from 'hooks/useTriggers';
import useActions from 'hooks/useActions';
import useTriggerSubsteps from 'hooks/useTriggerSubsteps';
import useActionSubsteps from 'hooks/useActionSubsteps';
import useStepWithTestExecutions from 'hooks/useStepWithTestExecutions';
import { validationSchemaResolver } from './validation';
import { isEqual } from 'lodash';

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

function FlowStep(props) {
  const { collapsed, onChange, onContinue, flowId } = props;
  const editorContext = React.useContext(EditorContext);
  const contextButtonRef = React.useRef(null);
  const step = props.step;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isTrigger = step.type === 'trigger';
  const isAction = step.type === 'action';
  const formatMessage = useFormatMessage();
  const [currentSubstep, setCurrentSubstep] = React.useState(0);
  const [formResolverContext, setFormResolverContext] = React.useState({
    substeps: [],
    additionalFields: {},
  });
  const useAppsOptions = {};

  if (isTrigger) {
    useAppsOptions.onlyWithTriggers = true;
  }

  if (isAction) {
    useAppsOptions.onlyWithActions = true;
  }

  const { data: apps } = useApps(useAppsOptions);

  const { data: stepWithTestExecutions, refetch } = useStepWithTestExecutions(
    step.id,
  );
  const stepWithTestExecutionsData = stepWithTestExecutions?.data;

  React.useEffect(() => {
    if (!collapsed && !isTrigger) {
      refetch(step.id);
    }
  }, [collapsed, refetch, step.id, isTrigger]);

  const app = apps?.data?.find((currentApp) => currentApp.key === step.appKey);

  const { data: triggers } = useTriggers(app?.key);

  const { data: actions } = useActions(app?.key);

  const actionsOrTriggers = (isTrigger ? triggers?.data : actions?.data) || [];

  const actionOrTrigger = actionsOrTriggers?.find(
    ({ key }) => key === step.key,
  );

  const { data: triggerSubsteps } = useTriggerSubsteps({
    appKey: app?.key,
    triggerKey: actionOrTrigger?.key,
  });

  const triggerSubstepsData = triggerSubsteps?.data || [];

  const { data: actionSubsteps } = useActionSubsteps({
    appKey: app?.key,
    actionKey: actionOrTrigger?.key,
  });

  const actionSubstepsData = actionSubsteps?.data || [];

  const substeps =
    triggerSubstepsData.length > 0
      ? triggerSubstepsData
      : actionSubstepsData || [];

  React.useEffect(() => {
    if (!isEqual(substeps, formResolverContext.substeps)) {
      setFormResolverContext({ substeps, additionalFields: {} });
    }
  }, [substeps]);

  const handleChange = React.useCallback(({ step }) => {
    onChange(step);
  }, []);

  const expandNextStep = React.useCallback(() => {
    setCurrentSubstep((currentSubstep) => (currentSubstep ?? 0) + 1);
  }, []);

  const handleSubmit = (val) => {
    handleChange({ step: val });
  };

  if (!apps?.data) {
    return (
      <CircularProgress
        data-test="step-circular-loader"
        sx={{ display: 'block', my: 2 }}
      />
    );
  }

  const onContextMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const onContextMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(contextButtonRef.current);
  };

  const onOpen = () => collapsed && props.onOpen?.();

  const onClose = () => props.onClose?.();

  const toggleSubstep = (substepIndex) =>
    setCurrentSubstep((value) =>
      value !== substepIndex ? substepIndex : null,
    );

  const addAdditionalFieldsValidation = (additionalFields) => {
    if (additionalFields) {
      setFormResolverContext((prev) => ({
        ...prev,
        additionalFields: { ...prev.additionalFields, ...additionalFields },
      }));
    }
  };

  const validationStatusIcon =
    step.status === 'completed' ? validIcon : errorIcon;

  return (
    <Wrapper
      elevation={collapsed ? 1 : 4}
      onClick={onOpen}
      data-test="flow-step"
    >
      <Header collapsed={collapsed}>
        <Stack direction="row" alignItems="center" gap={2}>
          <AppIconWrapper>
            <AppIcon url={app?.iconUrl} name={app?.name} />

            <AppIconStatusIconWrapper>
              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <div>
            <Typography variant="caption">
              {isTrigger
                ? formatMessage('flowStep.triggerType')
                : formatMessage('flowStep.actionType')}
            </Typography>

            <Typography variant="body2">
              {step.position}. {app?.name}
            </Typography>
          </div>

          <Box display="flex" flex={1} justifyContent="end">
            {/* as there are no other actions besides "delete step", we hide the context menu. */}
            {!isTrigger && !editorContext.readOnly && (
              <IconButton
                color="primary"
                onClick={onContextMenuClick}
                ref={contextButtonRef}
              >
                <MoreHorizIcon />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Header>

      <Collapse in={!collapsed} unmountOnExit>
        <Content>
          <List>
            <StepExecutionsProvider value={stepWithTestExecutionsData}>
              <Form
                defaultValues={step}
                onSubmit={handleSubmit}
                resolver={validationSchemaResolver}
                context={formResolverContext}
              >
                <ChooseAppAndEventSubstep
                  expanded={currentSubstep === 0}
                  substep={{
                    key: 'chooAppAndEvent',
                    name: 'Choose app & event',
                    arguments: [],
                  }}
                  onExpand={() => toggleSubstep(0)}
                  onCollapse={() => toggleSubstep(0)}
                  onSubmit={expandNextStep}
                  onChange={handleChange}
                  step={step}
                />

                {actionOrTrigger &&
                  substeps?.length > 0 &&
                  substeps.map((substep, index) => (
                    <React.Fragment key={`${substep?.name}-${index}`}>
                      {substep.key === 'chooseConnection' && app && (
                        <ChooseConnectionSubstep
                          expanded={currentSubstep === index + 1}
                          substep={substep}
                          onExpand={() => toggleSubstep(index + 1)}
                          onCollapse={() => toggleSubstep(index + 1)}
                          onSubmit={expandNextStep}
                          onChange={handleChange}
                          application={app}
                          step={step}
                        />
                      )}

                      {substep.key === 'testStep' && (
                        <TestSubstep
                          expanded={currentSubstep === index + 1}
                          substep={substep}
                          onExpand={() => toggleSubstep(index + 1)}
                          onCollapse={() => toggleSubstep(index + 1)}
                          onSubmit={expandNextStep}
                          onChange={handleChange}
                          onContinue={onContinue}
                          showWebhookUrl={
                            'showWebhookUrl' in actionOrTrigger
                              ? actionOrTrigger.showWebhookUrl
                              : false
                          }
                          step={step}
                          flowId={flowId}
                        />
                      )}

                      {substep.key &&
                        ['chooseConnection', 'testStep'].includes(
                          substep.key,
                        ) === false && (
                          <FlowSubstep
                            expanded={currentSubstep === index + 1}
                            substep={substep}
                            onExpand={() => toggleSubstep(index + 1)}
                            onCollapse={() => toggleSubstep(index + 1)}
                            onSubmit={expandNextStep}
                            onChange={handleChange}
                            step={step}
                            addAdditionalFieldsValidation={
                              addAdditionalFieldsValidation
                            }
                          />
                        )}
                    </React.Fragment>
                  ))}
              </Form>
            </StepExecutionsProvider>
          </List>
        </Content>

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </Collapse>

      {anchorEl && (
        <FlowStepContextMenu
          stepId={step.id}
          deletable={!isTrigger}
          onClose={onContextMenuClose}
          anchorEl={anchorEl}
          flowId={flowId}
        />
      )}
    </Wrapper>
  );
}

FlowStep.propTypes = {
  collapsed: PropTypes.bool,
  step: StepPropType.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onContinue: PropTypes.func,
};

export default FlowStep;
