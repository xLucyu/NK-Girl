# Duplicate event announcement investigation

Date: 2026-11-16
Repository: xLucyu/NK-Girl
Base commit: 5451abaa3928b3cc0139410d67dc6a3a4642e6df

## Findings

The scheduler already prevents overlapping cycles within one process. However, direct sends and broadcasts had separate delivery implementations. Both checked history, sent a Discord message, crossposted it when applicable, and then recorded the event.

Two paths could produce duplicates:

1. Concurrent calls could both read "not announced" before either recorded the event.
2. Crossposting could fail after a successful Discord send. Because recording followed crossposting, a later attempt could send the original message again.

A failed history write after a successful send posed a similar retry risk. Inspection and mocked tests confirm these code paths; production logs were not inspected, so the specific cause of the reported incidents remains unconfirmed.

## Changes and reasons

- Added src/btd6/services/services.announcement-delivery.ts. A shared in-flight guard uses guild ID, event type, and event ID. It is acquired before asynchronous checks and released in a finally block. Overlapping calls for the same identity are skipped.
- The coordinator temporarily remembers successful sends whose history writes failed. A later invocation retries recording without resending. Successful recording clears the temporary entry.
- Delivery is recorded before crossposting. Crosspost failure therefore cannot leave a successfully sent original message absent from history.
- Updated src/btd6/services/services.event-announcer.ts so send() and sendAll() use the same guarded delivery method and cache event ID for checks and writes.
- Broadcasts deduplicate channel IDs, retain per-channel error reporting, and lazily share one image-rendering promise.
- Explicit forced sends still bypass persisted history when no matching delivery is in flight. Existing edit behavior and CT exclusions remain unchanged.
- Added test/event-announcer.test.cjs and an npm test script. Tests exercise the real EventAnnouncer with mocked database, Discord, registry, and image-rendering boundaries.

## Validation

All checks passed locally:

- npm test: 8 passed, 0 failed.
- npm run typecheck.
- npm run build.
- CRLF-aware Git whitespace validation.

The eight tests cover overlapping direct and broadcast sends; overlapping broadcasts and duplicate guild targets; persisted history and forced sends; retrying rejected Discord sends; retrying recording without resending; crosspost failure with a fresh announcer using persisted history; independent guilds, event IDs, and event types with shared rendering; and missing channels.

No live database or Discord connection was used for testing. Generated build output and installed dependencies are excluded from the PR.

## Database and deployment scope

No live database was accessed or changed. There are no schema changes, migrations, manual data edits, or changes to database query code. At runtime the application continues using its existing history methods, with recording moved before crossposting.

This change has not been deployed. Merging and deployment are separate steps.

## Remaining limitations

- The guard belongs to one EventAnnouncer instance, including the application's singleton. Separate bot processes or independent instances can still race. This is not a distributed exactly-once guarantee.
- Temporary sent-but-unrecorded state is lost on restart. A process stopping after Discord accepts a message but before recording succeeds can still lead to a resend.
- An ambiguous network failure, where Discord accepts a message but the client receives an error, is not resolved by this guard.
- Crosspost failures are reported but are not automatically retried.
- Retrying failed recording requires another invocation for that event. The scheduler's existing cache policy is unchanged and does not guarantee that retry.
- A concurrent forced send is skipped and returns null. The existing manual command may describe that skip as a missing channel.
