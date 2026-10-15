[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# Drafter action

This directory contains an alternative public entrypoint for the Drafter
action. The repository root runs the same action.

```yaml
steps:
  - uses: step-security/release-drafter@v7
  # This entrypoint is equivalent to the repository root.
  - uses: release-drafter/release-drafter/drafter@v7
```
