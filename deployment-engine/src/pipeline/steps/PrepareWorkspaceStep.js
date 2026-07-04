/**
 * PrepareWorkspaceStep
 *
 * Prepares the local workspace for the deployment. In future
 * phases this will clone repositories, set up build contexts,
 * and initialise working directories.
 */

import { BaseStep } from "../core/BaseStep.js";

class PrepareWorkspaceStep extends BaseStep {
  constructor() {
    super("PrepareWorkspaceStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Preparing workspace…");

    // Future: clone repo, create temp dir, set up build context
    this.logInfo(context, "Workspace ready ✓");
    return context;
  }
}

export { PrepareWorkspaceStep };
