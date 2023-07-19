# Demo Project for Self-Hosted Secret Providers

## Overview

This repository demonstrates how to implement a server that handles requests for injecting env variables and secret files into user workloads.

The secret server receives requests from workloads that are about to start. The requests are authenticated using a JWT which is signed using a secret that is shared with Northflank.

This feature can be enabled on a team- or user-basis. If this feature is enabled for a team/user, all workloads of that team will fetch secrets from the secondary secret source in addition to the regular Northflank secrets. 

To enable the feature, let us know the endpoint of your server and the secret that we shall use to sign our JWTs.


## Protocol

Workloads will fetch secrets like env vars or secret files from Northflank and all secondary, self-hosted secret sources that are configured for a team or user.

Each configured secret source will receive a GET request which is authenticated using the bearer authentication scheme. The request's `Authorization` header will contain a signed bearer JWT with the following payload:

```typescript
/** Payload of the JWT token sent with the secret fetch request */
export interface JwtPayload {
  /** Project ID of the service/job that makes the request */
  projectId: string;
  /** Object ID of the service/job that makes the request */
  nfObjectId: string;
  /** Object type of the service/job that makes the request */
  nfObjectType: string;
}
```

A typical `Authorization` header might look something like this:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiJwcm9qZWN0LmludGVybmFsSWQiLCJuZk9iamVjdElkIjoiaW50ZXJuYWxJZCIsIm5mT2JqZWN0VHlwZSI6Im9iamVjdHR5cGUiLCJpYXQiOjE2ODk3NjA0NjIsImV4cCI6MTY4OTg0Njg2Mn0.FcUR2ZeTuYDbi_QsviEJvCG9x3sB1vtjjAEuuIGD2OU
```

The server is expected to verify that the JWT token's signature is correct and matches its payload. If the signature is valid, respond with a 200 code and a JSON object containing the environment variables and secret files for the service designated by the JWT's payload.

The exact format for the response is detailed in [src/types.ts](src/types.ts).

A typical response might look something like this:
```json
{
   "secrets":[
      {
         "type":"FILE",
         "path":"/test-file",
         "data":"Hello world!"
      },
      {
         "type":"ENV",
         "key":"SECRET_ENV_1",
         "value":"VALUE_1"
      },
      {
         "type":"ENV",
         "key":"SECRET_ENV_2",
         "value":"VALUE_2"
      },
   ]

}
```

## Repo structure 

 * [src/main.ts](src/main.ts): Demo server
 * [src/types.ts](src/types.ts): Type definitions for requests/responses 
 * [src/sign-test-jwt.ts](src/sign-test-jwt.ts): Code for generating a test jwt token

