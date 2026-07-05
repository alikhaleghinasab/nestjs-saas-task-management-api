# Caching

This document describes how caching is integrated into the application and the reasoning behind the selected caching strategy.

The project uses Redis to reduce repeated database access for frequently requested data while keeping cache management explicit and predictable.

Rather than attempting to cache every query, caching is applied selectively to operations where it provides clear value without significantly increasing application complexity.

---

# Caching Strategy

The application currently caches two categories of data.

| Cached Data             | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| User organization roles | Reduce repeated membership lookups during authorization                   |
| Paginated project lists | Reduce repeated database queries for frequently accessed project listings |

Task lists are intentionally **not** cached.

Given the expected frequency of updates and filtering combinations, caching task queries would introduce additional invalidation complexity with limited practical benefit.

---

# Cache Architecture

Business services interact with caching through an application abstraction rather than communicating with Redis directly.

```mermaid
flowchart LR

Service --> CacheProvider
CacheProvider --> Redis
```

This separation keeps business logic independent from the underlying cache implementation.

If the caching technology changes in the future, business services remain unaffected.

---

# Cache Keys

The project uses predictable cache keys to avoid collisions while keeping cache ownership explicit.

| Cached Data  | Key Format                                                      |
| ------------ | --------------------------------------------------------------- |
| User role    | `getUserRoleCacheKey(userId, organizationId)`                   |
| Project list | `project:{organizationId}:v{version}:page={page}:limit={limit}` |

Including the organization identifier ensures that cached data remains isolated between tenants.

 Version numbers are included in project list keys to support efficient cache invalidation without requiring individual cache entries to be deleted.

# Cache Invalidation

The application uses different invalidation strategies depending on the characteristics of the cached data.

## Membership Cache

User roles are cached to reduce repeated membership lookups during authorization.

When a user's role changes, the corresponding cache entry is explicitly removed.

This approach ensures that authorization decisions always reflect the latest membership state while keeping invalidation straightforward.

---

## Project List Cache

Project listings use **version-based invalidation**.

Instead of deleting every cached page individually, a cache version is maintained for each organization.

Whenever a project is created, updated, or deleted, the organization's cache version is incremented.

Subsequent requests automatically generate new cache keys using the updated version, causing previous cache entries to become obsolete without requiring explicit deletion.

This strategy keeps invalidation efficient even when multiple pages of project data are cached simultaneously.

---

# Design Decisions

Several decisions influenced the caching implementation.

| Decision                   | Rationale                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Selective caching          | Only cache operations with measurable benefit and manageable invalidation complexity. |
| Cache abstraction          | Keep business services independent from Redis.                                        |
| Version-based invalidation | Simplify invalidation of paginated project lists.                                     |
| Explicit cache ownership   | Each service is responsible for invalidating the data it owns.                        |

These decisions prioritize predictable behavior and maintainability over maximizing cache coverage.

---

# Related Documentation

Caching works alongside several other architectural components.

| Document            | Description                             |
| ------------------- | --------------------------------------- |
| `architecture.md`   | Overall application architecture        |
| `multi-tenancy.md`  | Tenant-aware cache isolation            |
| `authentication.md` | Membership caching during authorization |
| `asynchronous-processing.md` | Background processing architecture              |
| `testing.md`        | Testing strategy for cached operations  |

