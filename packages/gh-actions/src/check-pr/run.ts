/*! release-drafter-action-entry:check-pr */
/* node:coverage ignore file -- @preserve */
import { validateSubscription } from '../../../../src/stepsecurity/subscription-check.ts'
import { run } from './runner.ts'

await validateSubscription()
await run()
