/**
 * PipelineEvents
 *
 * Central registry of event names used throughout the
 * deployment pipeline lifecycle.
 *
 * These constants define the canonical event types that
 * the PipelineRunner and PipelineContext publish during
 * execution. A future EventEmitter implementation will
 * consume these events for logging, metrics, and real-time
 * status updates.
 */

const PipelineEvents = Object.freeze({
  /* ─── Pipeline Lifecycle ───────────────────── */
  PIPELINE_STARTED: "pipeline:started",
  PIPELINE_COMPLETED: "pipeline:completed",
  PIPELINE_FAILED: "pipeline:failed",

  /* ─── Step Lifecycle ───────────────────────── */
  STEP_STARTED: "step:started",
  STEP_COMPLETED: "step:completed",
  STEP_FAILED: "step:failed",
});

export { PipelineEvents };
