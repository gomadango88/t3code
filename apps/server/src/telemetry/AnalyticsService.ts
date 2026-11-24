// Product analytics are permanently disabled in this no-telemetry fork.
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import type { TelemetryOwner } from "./Identify.ts";

export class AnalyticsService extends Context.Service<
  AnalyticsService,
  {
    /** Whether the event was queued to send; always false in this no-telemetry fork. */
    readonly record: (
      event: string,
      properties?: Readonly<Record<string, unknown>>,
    ) => Effect.Effect<boolean>;

    readonly flush: Effect.Effect<void>;

    readonly recordOwners: (
      owners: ReadonlyArray<TelemetryOwner>,
      observedBy: "server" | "client",
    ) => Effect.Effect<void>;
  }
>()("t3/telemetry/AnalyticsService") {}

const noopRecord: AnalyticsService["Service"]["record"] = Effect.fnUntraced(function* () {
  return false;
});

const noopRecordOwners: AnalyticsService["Service"]["recordOwners"] = Effect.fnUntraced(
  function* () {},
);

/** @public */
export const make = Effect.succeed(
  AnalyticsService.of({
    record: noopRecord,
    flush: Effect.void,
    recordOwners: noopRecordOwners,
  }),
);

export const layer = Layer.effect(AnalyticsService, make);
