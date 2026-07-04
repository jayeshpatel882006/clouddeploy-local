/**
 * UpdateDatabaseStep
 *
 * Persists the deployment result back to the database. In
 * future phases this will update the DeploymentHistory
 * record with the final status and manifest details.
 */

import { BaseStep } from "../core/BaseStep.js";

class UpdateDatabaseStep extends BaseStep {
  constructor() {
    super("UpdateDatabaseStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Updating deployment database record…");

    // Future: call an external API or DB driver to persist status
    this.logInfo(context, "Database record updated ✓");
    return context;
  }
}

export { UpdateDatabaseStep };
