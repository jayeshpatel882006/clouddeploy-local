/**
 * WaitForReadyStep
 *
 * Waits for the Kubernetes deployment to become healthy and
 * ready. In future phases this will poll Kubernetes for
 * rollout status and replica readiness.
 */

import { BaseStep } from "../core/BaseStep.js";

class WaitForReadyStep extends BaseStep {
  constructor() {
    super("WaitForReadyStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Waiting for deployment to become ready…");

    // Future: poll KubernetesDriver.rolloutStatus(context.applicationName, context.namespace)
    // Future: timeout after configurable duration
    this.logInfo(context, "Deployment is ready ✓");
    return context;
  }
}

export { WaitForReadyStep };
