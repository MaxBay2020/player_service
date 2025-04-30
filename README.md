# Player Service

## Project Overview
This service manages player data, responding to client requests with varying levels of detail based on user roles.



# Steps to run this project:

1. Run `yarn` command to install dependencies.
2. Setup database settings inside `data-source.ts` file
3. Run `yarn dev` command


# Steps to run this test:
```shell
    $ yarn test
```


# Database selection
Based on the facts below, SQL database is the right choice for this project:
+ All the entities have clear structure with obvious relationships.
+ The business needs to join tables, do complex queries.

# Denormalized fields:
Considering the JOIN operation in the future, denormalize `battingStatisticsq`, `fieldingStatistics`, `pitchingStatistics`, for example:
`Query the statistics of a team`. The tradeoff is it saves repeating data, but it can improve the query speed greatly.

# Seed
+ Run `yarn seed` to insert seeds data to database.

# DTO
Validate data from the frontend.

# Log system
Manage HTTP status code and message. All the 'response data structure' unified format.

# Test
+ Unit test.
    + Endpoint: Query all players
        + When validation failed.
        + Select correct fields when isAdmin is **true** with status code 200.
        + Select correct fields when isAdmin is **false** with status code 200.
        + When the server is crashed.
    + Endpoint: Query a single player by player ID
        + When validation failed.
        + Select correct fields when isAdmin is **true** with status code 200.
        + Select correct fields when isAdmin is **false** with status code 200.
        + When the server is crashed.
+ integration test
    + API: GET - query all players
        + When isAdmin is **true**.
        + When isAdmin is **false**.
        + When isAdmin is **NOT** passed.
        + When is Admin is neither true nor false.
        + When the server is crashed.
    + API: GET - query a single players by player ID
        + When isAdmin is **true**.
        + When isAdmin is **false**.
        + When isAdmin is **NOT** passed.
        + When is Admin is neither true nor false.
        + When the server is crashed.

# AI
+ LLM: TinyLlama-1.1B-Chat-v1.0.
+ LLM server created.
+ Integration test and unit test.
    + When validation failed.
    + When country is missing。
    + When country is not a string.
    + When the server is crashed.