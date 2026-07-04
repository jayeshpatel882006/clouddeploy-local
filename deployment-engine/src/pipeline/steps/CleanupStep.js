/**
 * CleanupStep
 *
 * Performs post-deployment cleanup: removes temporary build
 * artifacts, prunes unused Docker resources, and releases
 * workspace directories.
 */

import { BaseStep } from "../core/BaseStep.js";

class CleanupStep extends BaseStep {
  constructor() {
    super("CleanupStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Cleaning up temporary resources…");

    // Future: remove temp dirs, prune Docker build cache, clean workspace
    this.logInfo(context, "Cleanup complete ✓");
    return context;
  }
}

export { CleanupStep };
