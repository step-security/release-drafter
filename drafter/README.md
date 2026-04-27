# Drafter action

This folder only serves as an alias when users reference the action, which
requires the presence of the [`action.yml`](./action.yml) file

```yaml
steps:
  # targets root `action.yaml` - runs drafter
  - uses: step-security/release-drafter@v7
  # also runs drafter
  - uses: step-security/release-drafter/drafter@v7
```
