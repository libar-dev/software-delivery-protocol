# Plan 46 prototype measurements

The engine replaced both prototypes. This archive keeps only their cited measurements.
No prototype source, rendered page or screenshot is retained here; git holds the originals.
These are design evidence, not measurements of the closing build.

| Evidence | Source commit | Original measurement file |
| --- | --- | --- |
| `studio-diagrams/{protocol,platform,platform-synthetic}/measurements.json` | `2f2611c3eaf6cecc183e1e912303941271ee9745` | The diagram prototype's `out/<corpus>/measurements.json`, copied byte for byte. |
| [Vault measurements](vault-measurements.md) | `76c2c8f58b73900209dfb6afa2b7652d3a4a344d` | The vault prototype's README, “What it measured” section, which was its only tracked measurement record. |

The diagram-renderer decision cites the diagram measurements; the vault Spec cites the vault
measurements. The platform corpus was at `b038bd4` in both experiments. The source commits preserve
the prototype code and reproduction commands for historical review.
