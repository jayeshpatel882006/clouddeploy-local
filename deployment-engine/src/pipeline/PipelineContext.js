/**
 * PipelineContext
 *
 * A shared state object that flows through every step of the
 * deployment pipeline. Each step reads from and writes to
 * this context, building up deployment metadata, logs, errors,
 * and final results as execution progresses.
 *
 * The context is created once per pipeline run and is passed
 * by reference to each step's execute() method.
 */

class PipelineContext {
  /**
   * @param {Object} input - Raw deployment request payload
   * @param {string} input.applicationName
   * @param {string} input.dockerImage
   * @param {number} input.containerPort
   * @param {string} [input.namespace="default"]
   * @param {number} [input.replicas=1]
   * @param {string} [input.imageTag="latest"]
   * @param {string} [input.deployedBy="system"]
   * @param {string} [input.commitSha=""]
   * @param {string} [input.deploymentMessage=""]
   */
  constructor(input = {}) {
    /* ─── Identity ──────────────────────────── */
    this.deploymentId = input.deploymentId || null;

    /* ─── Application Configuration ─────────── */
    this.applicationName = input.applicationName || "";
    this.dockerImage = input.dockerImage || "";
    this.namespace = input.namespace || "default";
    this.replicas = input.replicas || 1;
    this.containerPort = input.containerPort || null;
    this.imageTag = input.imageTag || "latest";
    this.deployedBy = input.deployedBy || "system";
    this.commitSha = input.commitSha || "";
    this.deploymentMessage = input.deploymentMessage || "";

    /* ─── Pipeline State ────────────────────── */
    this.currentStep = null;
    this.status = "Pending";       // Pending | Running | Completed | Failed
    this.progress = 0;             // 0–100 percentage
    this.startedAt = null;
    this.completedAt = null;

    /* ─── Step Results ──────────────────────── */
    /** @type {Array<{name:string,status:string,duration:number|null,error:string|null}>} */
    this.steps = [];

    /* ─── Generated Artifacts (populated by steps) ── */
    this.deploymentManifest = null;
    this.serviceManifest = null;
    this.imageName = null;

    /* ─── Metadata / Extensible ─────────────── */
    this.metadata = {};

    /* ─── Logs & Errors ─────────────────────── */
    /** @type {string[]} */
    this.logs = [];
    /** @type {{step:string,message:string}[]} */
    this.errors = [];
  }

  /* ─── Progress Helpers ─────────────────────── */

  /**
   * Record a step result and advance progress.
   * @param {string} stepName
   * @param {"completed"|"failed"} status
   * @param {number|null} [durationMs=null]
   * @param {string|null} [error=null]
   */
  recordStep(stepName, status, durationMs = null, error = null) {
    this.steps.push({
      name: stepName,
      status,
      duration: durationMs,
      error,
    });
  }

  /**
   * Log a message during pipeline execution.
   * @param {string} message
   */
  log(message) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  /**
   * Record a pipeline error.
   * @param {string} step
   * @param {string} message
   */
  addError(step, message) {
    this.errors.push({ step, message });
    this.log(`ERROR [${step}]: ${message}`);
  }

  /**
   * Set pipeline progress percentage.
   * @param {number} pct - 0–100
   */
  setProgress(pct) {
    this.progress = Math.min(100, Math.max(0, pct));
  }

  /**
   * Mark the pipeline as started.
   */
  markStarted() {
    this.status = "Running";
    this.startedAt = new Date().toISOString();
    this.log("Pipeline started");
  }

  /**
   * Mark the pipeline as completed.
   */
  markCompleted() {
    this.status = "Completed";
    this.completedAt = new Date().toISOString();
    this.progress = 100;
    this.log("Pipeline completed");
  }

  /**
   * Mark the pipeline as failed.
   * @param {string} [reason="Unknown error"]
   */
  markFailed(reason = "Unknown error") {
    this.status = "Failed";
    this.completedAt = new Date().toISOString();
    this.addError("pipeline", reason);
  }

  /**
   * Return a plain object snapshot of the context.
   * Useful for serialisation or API responses.
   * @returns {Object}
   */
  toJSON() {
    return {
      deploymentId: this.deploymentId,
      applicationName: this.applicationName,
      dockerImage: this.dockerImage,
      namespace: this.namespace,
      replicas: this.replicas,
      containerPort: this.containerPort,
      imageTag: this.imageTag,
      currentStep: this.currentStep,
      status: this.status,
      progress: this.progress,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      metadata: this.metadata,
      steps: this.steps,
      errors: this.errors,
    };
  }
}

export { PipelineContext };
