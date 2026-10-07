
### 2. `docs/architecture.md`
*Save this inside your `docs/` folder.*

```markdown
# QuickNotes Architecture

## Requirements
-   **Functional:** CRUD notes, tag organization, user auth, feed generation
-   **Non-functional:** <200ms p95 latency, 99.9% availability, support 1M users

## Load Estimates (1M Users)
-   DAU: 200,000 (20% activation)
-   Writes: 10/sec avg, 50/sec peak (5 notes/user/day)
-   Reads: 40/sec avg, 200/sec peak (20 feed loads/user/day)
-   Storage: ~180 GB/year (500 bytes/note × 1M notes/day)
-   **Profile:** Read-heavy (4:1 ratio) → caching critical

## Architecture Diagram
```text
         ┌─────────┐
Users───>│   DNS   │
         ────┬────┘
              │ static assets
              ▼
         ┌─────────┐     ┌──────────────┐
         │   CDN   │<────│ Origin Server│
         └─────────     └──────┬───────┘
                                │ API calls
                                ▼
                         ┌──────────────┐
                         │ Load Balancer│
                         └──────┬───────
                     ┌──────────┼──────────┐
                     ▼          ▼          ▼
                 ┌───────┐ ┌───────┐ ┌───────┐    ┌──────────┐
                 │ App 1 │ │ App 2 │ │ App 3 │───>│ Redis    │
                 ───┬───┘ ───┬───┘ └──────┘    │ (Cache)  │
                     │writes  │reads    │jobs      └──────────┘
                     ▼         ▼         ▼
                 ┌──────── ┌─────────┐ ┌───────  ┌────────┐
                 │Primary │>|Read     │ │Queue  │─>│Worker  │
                 │  DB    │ |Replicas │ └───────┘  │(Thumbs)│
                 ────────┘ └─────────┘            ──┬────┘
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │Object Storage│
                                                │  (Photos)    │
                                                ──────────────┘