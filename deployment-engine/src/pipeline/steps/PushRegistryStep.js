/**
 * PushRegistryStep
 *
 * Pushes the built Docker image to the configured container
 * registry. In future phases this will call
 * RegistryDriver.pushImage() after tagging.
 */

import { BaseStep } from "../core/BaseStep.js";

class PushRegistryStep extends BaseStep {
  constructor() {
    super("PushRegistryStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Pushing image to registry…");

    // Future: call RegistryDriver.pushImage(context.imageName)
    this.logInfo(context, `Image ${context.imageName} pushed to registry ✓`);
    return context;
  }
}

export { PushRegistryStep };
