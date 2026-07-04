/**
 * BuildImageStep
 *
 * Builds a Docker image from the configured source. In future
 * phases this will call DockerDriver.buildImage() to produce
 * the deployable artifact.
 */

import { BaseStep } from "../core/BaseStep.js";

class BuildImageStep extends BaseStep {
  constructor() {
    super("BuildImageStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Building Docker image…");

    const imageName = `${context.dockerImage}:${context.imageTag}`;

    context.imageName = imageName;

    // Future: call DockerDriver.buildImage(imageName, context.dockerfilePath)
    this.logInfo(context, `Image ${imageName} built ✓`);
    return context;
  }
}

export { BuildImageStep };
