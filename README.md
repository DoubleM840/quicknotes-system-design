# QuickNotes System Design

A production-ready architecture for scaling QuickNotes from browser-only to 1M users.

## Running the API Client
Open `index.html` in a browser or use Live Server. Requires internet connection for JSONPlaceholder API.

## Documentation
-   [API Design](docs/api-design.md)
-   [Data Model](docs/data-model.md)  
-   [Architecture](docs/architecture.md)

## What I Learned
1.  **Stateless Scaling:** Horizontal scaling requires externalizing all session state to Redis/database
2.  **Async Patterns:** Message queues decouple slow operations from user-facing API responses
3.  **Trade-off Analysis:** Every architectural decision involves balancing consistency, latency, cost, and complexity