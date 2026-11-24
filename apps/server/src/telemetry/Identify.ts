// Cross-tool identity reading (~/.codex/auth.json, ~/.claude.json, T3 Connect owner hashing)
// is permanently disabled in this no-telemetry fork.
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

export const TelemetryOwnerSource = Schema.Literals(["connect", "openai", "claude", "device"]);
export type TelemetryOwnerSource = typeof TelemetryOwnerSource.Type;

export interface TelemetryOwner {
  readonly source: TelemetryOwnerSource;
  readonly ownerId: string;
}

export const TelemetryIdentitySource = Schema.Literals(["codex", "claude", "anonymous"]);
export type TelemetryIdentitySource = typeof TelemetryIdentitySource.Type;

export class TelemetryAnonymousIdGenerationError extends Schema.TaggedError<TelemetryAnonymousIdGenerationError>()(
  "TelemetryAnonymousIdGenerationError",
  {
    source: Schema.Literal("anonymous"),
    filePath: Schema.String,
    cause: Schema.Defect(),
  },
) {
  override get message(): string {
    return `Failed to generate anonymous telemetry identity for '${this.filePath}'.`;
  }
}

export class TelemetryAnonymousIdPersistenceError extends Schema.TaggedError<TelemetryAnonymousIdPersistenceError>()(
  "TelemetryAnonymousIdPersistenceError",
  {
    source: Schema.Literal("anonymous"),
    filePath: Schema.String,
    cause: Schema.Defect(),
  },
) {
  override get message(): string {
    return `Failed to persist anonymous telemetry identity at '${this.filePath}'.`;
  }
}

export const openAiUserId = (_idToken: string): Option.Option<string> => Option.none<string>();

export const getTelemetryIdentityForHome = (_homeDirectory: string) =>
  Effect.succeed<{ readonly distinctId: string | null; readonly installId: string | null }>({
    distinctId: null,
    installId: null,
  });

export const getTelemetryIdentity = getTelemetryIdentityForHome("");

export const getServerOwnersForHome = (_homeDirectory: string) =>
  Effect.succeed<ReadonlyArray<TelemetryOwner>>([]);

export const getServerOwners = getServerOwnersForHome("");
