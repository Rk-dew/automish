const path = require('node:path');
const { BasePage } = require('./base-page');

export class FlowEditorPage extends BasePage {
  constructor(page) {
    super(page);
    this.appAutocomplete = this.page.getByTestId('choose-app-autocomplete');
    this.eventAutocomplete = this.page.getByTestId('choose-event-autocomplete');
    this.continueButton = this.page.getByTestId('flow-substep-continue-button');
    this.connectionAutocomplete = this.page.getByTestId(
      'choose-connection-autocomplete'
    );
    this.testOuput = this.page.getByTestId('flow-test-substep-output');
    this.unpublishFlowButton = this.page.getByTestId('unpublish-flow-button');
    this.publishFlowButton = this.page.getByTestId('publish-flow-button');
    this.infoSnackbar = this.page.getByTestId('flow-cannot-edit-info-snackbar');
    this.trigger = this.page.getByLabel('Trigger on weekends?');
  }

  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('flow-editor', plainPath);

    return await super.screenshot({ path: computedPath, ...restOptions });
  }
}
