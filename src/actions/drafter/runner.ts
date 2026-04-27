import * as core from '@actions/core'
import axios, { isAxiosError } from 'axios'
import {
  getActionInput,
  getConfig,
  mergeInputAndConfig,
  setActionOutput,
} from './config'
import { main } from './main'

async function validateSubscription(): Promise<void> {
  const upstream = 'release-drafter/release-drafter'
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`
  try {
    await axios.get(API_URL, { timeout: 3000 })
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      core.error(
        'Subscription is not valid. Reach out to support@stepsecurity.io',
      )
      core.error(
        `This action is a fork of ${upstream}, and is used in the ${process.env.GITHUB_REPOSITORY} repository.`,
      )
      core.error(
        `Please contact support@stepsecurity.io for a valid subscription.`,
      )
      process.exit(1)
    } else {
      core.info('Timeout or error calling subscription API, continuing...')
    }
  }
}

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await validateSubscription()
    core.info('Parsing inputs and configuration...')
    const input = getActionInput()
    const config = mergeInputAndConfig({
      config: await getConfig(input['config-name']),
      input,
    })

    const { upsertedRelease, releasePayload } = await main({ input, config })

    setActionOutput({
      upsertedRelease,
      releasePayload,
    })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
