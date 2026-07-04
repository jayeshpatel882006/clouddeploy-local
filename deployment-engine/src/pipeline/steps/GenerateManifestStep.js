/**
 * GenerateManifestStep
 *
 * Generates the Kubernetes Deployment and Service manifests
 * from the pipeline context. Populates
 * context.deploymentManifest and context.serviceManifest
 * for the DeployKubernetesStep to consume.
 */

import { BaseStep } from "../core/BaseStep.js";
import { generateDeploymentManifest } from "../../manifests/deployment.manifest.js";
import { generateServiceManifest } from "../../manifests/service.manifest.js";

class GenerateManifestStep extends BaseStep {
  constructor() {
    super("GenerateManifestStep");
  }

  /**
   * @param {import("../PipelineContext.js").PipelineContext} context
   * @returns {Promise<import("../PipelineContext.js").PipelineContext>}
   */
  async execute(context) {
    this.logInfo(context, "Generating Kubernetes manifests…");

    const deploymentConfig = {
      applicationName: context.applicationName,
      namespace: context.namespace,
      dockerImage: context.dockerImage,
      imageTag: context.imageTag,
      replicas: context.replicas,
      containerPort: context.containerPort,
    };

    context.deploymentManifest = generateDeploymentManifest(deploymentConfig);
    context.serviceManifest = generateServiceManifest(deploymentConfig);

    this.logInfo(context, "Deployment and Service manifests generated ✓");
    return context;
  }
}

export { GenerateManifestStep };
