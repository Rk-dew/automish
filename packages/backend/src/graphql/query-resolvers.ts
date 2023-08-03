import getApps from './queries/get-apps';
import getApp from './queries/get-app';
import getConnectedApps from './queries/get-connected-apps';
import testConnection from './queries/test-connection';
import getFlow from './queries/get-flow';
import getFlows from './queries/get-flows';
import getStepWithTestExecutions from './queries/get-step-with-test-executions';
import getExecution from './queries/get-execution';
import getExecutions from './queries/get-executions';
import getExecutionSteps from './queries/get-execution-steps';
import getDynamicData from './queries/get-dynamic-data';
import getDynamicFields from './queries/get-dynamic-fields';
import getCurrentUser from './queries/get-current-user';
import getPaymentPlans from './queries/get-payment-plans.ee';
import getPaddleInfo from './queries/get-paddle-info.ee';
import getBillingAndUsage from './queries/get-billing-and-usage.ee';
import getInvoices from './queries/get-invoices.ee';
import getAutomatischInfo from './queries/get-automatisch-info';
import getTrialStatus from './queries/get-trial-status.ee';
import getSubscriptionStatus from './queries/get-subscription-status.ee';
import getSamlAuthProviders from './queries/get-saml-auth-providers.ee';
import healthcheck from './queries/healthcheck';

const queryResolvers = {
  getApps,
  getApp,
  getConnectedApps,
  testConnection,
  getFlow,
  getFlows,
  getStepWithTestExecutions,
  getExecution,
  getExecutions,
  getExecutionSteps,
  getDynamicData,
  getDynamicFields,
  getCurrentUser,
  getPaymentPlans,
  getPaddleInfo,
  getBillingAndUsage,
  getInvoices,
  getAutomatischInfo,
  getTrialStatus,
  getSubscriptionStatus,
  getSamlAuthProviders,
  healthcheck,
};

export default queryResolvers;
