import { describe, expect, it } from 'vitest'
import {
  hasPublishAutoCorrectionWarning,
  packArguments,
  publishArguments,
  sanitizedNpmEnvironment,
} from '#src/scripts/check-package-readiness.ts'

describe('npm package readiness', () => {
  it('uses the packed tarball for an offline publication dry run', () => {
    expect(packArguments('/isolated/pack')).toEqual([
      'pack',
      '--ignore-scripts',
      '--json',
      '--pack-destination',
      '/isolated/pack',
    ])
    expect(
      publishArguments('/isolated/pack/release-drafter-7.7.0.tgz'),
    ).toEqual([
      'publish',
      '/isolated/pack/release-drafter-7.7.0.tgz',
      '--dry-run',
      '--ignore-scripts',
      '--offline',
      '--json',
      '--provenance=false',
    ])
    expect(publishArguments('/artifact.tgz')).not.toContain('--workspace')
  })

  it('rejects hyphenated and spaced npm metadata correction warnings', () => {
    expect(
      hasPublishAutoCorrectionWarning(
        'npm warn publish npm auto-corrected some errors in your package.json',
      ),
    ).toBe(true)
    expect(
      hasPublishAutoCorrectionWarning(
        'npm WARN publish npm auto corrected some errors in your package.json',
      ),
    ).toBe(true)
    expect(
      hasPublishAutoCorrectionWarning('npm notice publish dry-run complete'),
    ).toBe(false)
  })

  it('removes auth-related environment and isolates npm configuration', () => {
    const environment = sanitizedNpmEnvironment(
      {
        HOME: '/home/test',
        HTTPS_PROXY: 'https://publisher:secret@proxy.example',
        NPM_CONFIG_CERT: '/home/test/client-cert.pem',
        NODE_AUTH_TOKEN: 'node-secret',
        NPM_CONFIG_GLOBALCONFIG: '/etc/npmrc',
        NPM_CONFIG_KEY: '/home/test/client-key.pem',
        NPM_CONFIG_OTP: '123456',
        NPM_CONFIG_REGISTRY: 'https://publisher:secret@registry.example',
        NPM_CONFIG_USERCONFIG: '/home/test/.npmrc',
        NPM_TOKEN: 'npm-secret',
        'npm_config_//registry.npmjs.org/:_authToken': 'registry-secret',
        npm_config_proxy: 'https://publisher:secret@proxy.example',
        npm_config_username: 'publisher',
      },
      '/isolated/user.npmrc',
      '/isolated/global.npmrc',
    )

    expect(environment).toMatchObject({
      HOME: '/home/test',
      NPM_CONFIG_CACHE: '/isolated/cache',
      NPM_CONFIG_GLOBALCONFIG: '/isolated/global.npmrc',
      NPM_CONFIG_OFFLINE: 'true',
      NPM_CONFIG_PROVENANCE: 'false',
      NPM_CONFIG_USERCONFIG: '/isolated/user.npmrc',
      npm_config_globalconfig: '/isolated/global.npmrc',
      npm_config_userconfig: '/isolated/user.npmrc',
    })
    for (const name of [
      'NODE_AUTH_TOKEN',
      'NPM_TOKEN',
      'HTTPS_PROXY',
      'NPM_CONFIG_CERT',
      'NPM_CONFIG_KEY',
      'NPM_CONFIG_OTP',
      'NPM_CONFIG_REGISTRY',
      'npm_config_//registry.npmjs.org/:_authToken',
      'npm_config_proxy',
      'npm_config_username',
    ]) {
      expect(environment[name]).toBeUndefined()
    }
  })
})
