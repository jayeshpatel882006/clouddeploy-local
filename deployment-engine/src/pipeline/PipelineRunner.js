/**
 * PipelineRunner
 *
 * Orchestrates the sequential execution of a deployment
 * pipeline. The runner:
 *
 * 1. Accepts a PipelineContext and a list of Pipeline Steps
 * 2. Executes each step in order
 * 3. Updates progress after each step
 * 4. Catches failures and halts the pipeline
 * 5. Returns the final PipelineContext
 *
 * The runner does NOT execute Docker or Kubernetes operations.
 * It delegates entirely to the registered step instances.
 */

import { PipelineContext } from "./PipelineContext.js";
import { BaseStep } from "./core/BaseStep.js";
import { PipelineEvents } from "./events/PipelineEvents.js";

class PipelineRunner {
  constructor() {
    /**
     * Ordered list of step instances to execute.
     * @type {BaseStep[]}
     */
    this.steps = [];

    /**
     * Total progress weight per step (100 ÷ number of steps).
     * Calculated when the pipeline starts.
     * @type {number}
     */
    this.stepWeight = 0;
  }

  /**
   * Register a step. Steps execute in registration order.
   * @param {BaseStep} step - A step instance extending BaseStep
   * @returns {PipelineRunner} - For chaining
   */
  addStep(step) {
    if (!(step instanceof BaseStep)) {
      throw new Error(
        `Invalid step: ${step?.constructor?.name || typeof step} ` +
        `must extend BaseStep`,
      );
    }
    this.steps.push(step);
    return this;
  }

  /**
   * Run the full pipeline.
   *
   * @param {PipelineContext} context - Initialised pipeline context
   * @returns {Promise<PipelineContext>} - Context with final status
   */
  async run(context) {
    if (!(context instanceof PipelineContext)) {
      throw new Error("PipelineRunner.run() requires a PipelineContext instance");
    }

    if (this.steps.length === 0) {
      throw new Error("No steps registered — use addStep() before run()");
    }

    /* ─── Calculate step weight ─────────────── */
    this.stepWeight = 100 / this.steps.length;

    /* ─── Mark pipeline as started ──────────── */
    context.markStarted();
    this._emit(PipelineEvents.PIPELINE_STARTED, context);

    /* ─── Execute each step sequentially ────── */
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];

      /* Guard against mid-pipeline failure */
      if (context.status === "Failed") {
        context.log(`[PipelineRunner] Pipeline already failed — skipping step ${step.stepName}`);
        break;
      }

      /* Update current step */
      context.currentStep = step.stepName;

      /* Step started */
      const stepStart = Date.now();
      context.log(`\n▶ ${step.stepName}`);
      this._emit(PipelineEvents.STEP_STARTED, { context, step });

      try {
        /* Execute the step */
        await step.execute(context);

        /* Record success */
        const duration = Date.now() - stepStart;
        context.recordStep(step.stepName, "completed", duration);
        context.setProgress((i + 1) * this.stepWeight);
        context.log(`✔ ${step.stepName} completed (${duration}ms)`);
        this._emit(PipelineEvents.STEP_COMPLETED, { context, step, duration });
      } catch (error) {
        /* Record failure */
        const duration = Date.now() - stepStart;
        context.recordStep(step.stepName, "failed", duration, error.message);
        context.addError(step.stepName, error.message);
        context.markFailed(`Failed at step: ${step.stepName}`);
        context.log(`✗ ${step.stepName} FAILED — ${error.message}`);
        this._emit(PipelineEvents.STEP_FAILED, {
          context,
          step,
          duration,
          error: error.message,
        });

        /* Stop pipeline on failure */
        break;
      }
    }

    /* ─── Finalise ──────────────────────────── */
    if (context.status === "Running") {
      context.markCompleted();
      this._emit(PipelineEvents.PIPELINE_COMPLETED, context);
    } else if (context.status === "Failed") {
      this._emit(PipelineEvents.PIPELINE_FAILED, context);
    }

    context.currentStep = null;
    return context;
  }

  /* ─── Internal Helpers ─────────────────────── */

  /**
   * Emit a pipeline event.
   * Currently a stub — a future EventEmitter integration
   * will route these to WebSockets, logs, or monitoring.
   *
   * @param {string} eventName
   * @param {*} payload
   * @private
   */
  _emit(eventName, payload) {
    // Future: real event bus integration
    if (process.env.NODE_ENV === "development") {
      // console.debug(`[PipelineEvent] ${eventName}`);
    }
  }
}

export { PipelineRunner };
