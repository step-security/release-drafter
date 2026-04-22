# Autolabeler action

This folder only serves as an alias when users reference the action, which
requires the presence of the [`action.yml`](./action.yml) file

```yaml
steps:
  # runs autolabeler
  - uses: step-security/release-drafter/autolabeler@v6
  # ⚠️ targets root `action.yaml` - runs drafter
  - uses: step-security/release-drafter@v6
```
