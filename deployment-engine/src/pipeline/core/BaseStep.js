/**
 * BaseStep
 *
 * Abstract base class for all pipeline steps.
 *
 * Every concrete step must extend BaseStep and implement
 * the execute(context) method. The base class provides:
 *
 * - Standardised step metadata (stepName)
 * - Logging helpers for the pipeline context
 * - A validation helper for required context fields
 * - A clear execute() contract
 */

import { PipelineContext } from "../PipelineContext.js";

class BaseStep {
  /**
   * @param {string} stepName - Human-readable name for this step
   */
  constructor(stepName) {
    if (new.target === BaseStep) {
      throw new Error(
        `BaseStep cannot be instantiated directly. ` +
        `Create a subclass (e.g. class ${stepName || "MyStep"} extends BaseStep).`,
      );
    }

    /**
     * Human-readable step name used for logging and progress reporting.
     * @type {string}
     */
    this.stepName = stepName || "UnnamedStep";
  }

  /**
   * Execute the step's logic.
   *
   * @param {PipelineContext} context - Shared pipeline context
   * @returns {Promise<PipelineContext>} The updated context after execution
   * @throws {Error} If the step fails irrecoverably
   */
  async execute(context) {
    throw new Error(
      `${this.constructor.name} must implement the execute(context) method.`,
    );
  }

  /* ─── Logging Helpers ──────────────────────── */

  /**
   * Log an info message via the pipeline context.
   * @param {PipelineContext} context
   * @param {string} message
   */
  logInfo(context, message) {
    context.log(`[${this.stepName}] ${message}`);
  }

  /**
   * Log a warning message via the pipeline context.
   * @param {PipelineContext} context
   * @param {string} message
   */
  logWarn(context, message) {
    context.log(`[${this.stepName}] ⚠ ${message}`);
  }

  /**
   * Log an error message via the pipeline context.
   * @param {PipelineContext} context
   * @param {string} message
   */
  logError(context, message) {
    context.log(`[${this.stepName}] ✗ ${message}`);
  }

  /* ─── Validation Helper ────────────────────── */

  /**
   * Validate that the specified fields exist and are non-empty
   * on the deployment request fields of the context.
   *
   * @param {PipelineContext} context
   * @param {string[]} requiredFields - Names of required fields
   * @throws {Error} If any required field is missing
   */
  validateRequired(context, requiredFields) {
    const missing = requiredFields.filter((field) => {
      const value = context[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      const msg = `Missing required field(s): ${missing.join(", ")}`;
      this.logError(context, msg);
      throw new Error(msg);
    }
  }
}

export { BaseStep };
