/**
 * switch-all-to-reviewed-transcripts.ts
 *
 * Retired safety guard.
 *
 * This file intentionally remains as an explicit failure instead of being
 * removed: a previous version relabelled every record as a reviewed
 * transcription merely because a file existed at /patents/transcripts/. Most
 * of those files were short editorial excerpts, not complete patents.
 */

throw new Error(
  "This bulk relabelling command is retired. A reviewed transcription requires page-by-page human review, a documented provenance record, and an explicit per-patent catalogue change; a filename is not evidence of completeness.",
);
