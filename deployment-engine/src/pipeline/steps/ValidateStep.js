/**
 * ValidateStep
 *
 * Validates that the pipeline context contains all required
 * fields before any deployment work begins. This is the first
 * step in every pipeline execution.
 */

import { BaseStep } from "../core/BaseStep.js";

class ValidateStep extends BaseStep {
  constructor() {
    super("ValidateStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Validating deployment configuration…");

    this.validateRequired(context, [
      "applicationName",
      "dockerImage",
      "containerPort",
    ]);

    this.logInfo(context, "All required fields present ✓");
    return context;
  }
}

export { ValidateStep };
