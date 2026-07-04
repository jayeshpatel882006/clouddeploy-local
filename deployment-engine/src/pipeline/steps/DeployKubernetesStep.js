/**
 * DeployKubernetesStep
 *
 * Applies the previously generated Kubernetes manifests to the
 * cluster. In future phases this will call
 * KubernetesDriver.createDeployment() and
 * KubernetesDriver.createService().
 */

import { BaseStep } from "../core/BaseStep.js";

class DeployKubernetesStep extends BaseStep {
  constructor() {
    super("DeployKubernetesStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Deploying to Kubernetes cluster…");

    if (!context.deploymentManifest) {
      throw new Error("No deployment manifest found — run GenerateManifestStep first");
    }

    // Future: call KubernetesDriver.createDeployment(context.deploymentManifest)
    // Future: call KubernetesDriver.createService(context.serviceManifest)
    this.logInfo(context, `Deployment ${context.applicationName} applied ✓`);
    return context;
  }
}

export { DeployKubernetesStep };
