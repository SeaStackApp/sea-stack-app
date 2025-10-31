# SeaStack

## Environment Setup

In [packages/db](packages/db), create a `.env` file with the following:

```dotenv
DATABASE_URL="postgresql://postgres:password@localhost:5432/public?schema=public"
```
  
In [apps/web](apps/web), create a `.env` file with the following:

```dotenv
BETTER_AUTH_SECRET=CeOx3AmjqVWNIlmeMLOgwtq87J49YpQX
BETTER_AUTH_URL=http://localhost:3000
```

