typescript prisma graphql type-graphql apollo-server-express postgresql

**!note:** Note that I am a junior and would be grateful if you could fix any bugs and add any additional features ❤️.

# How to run

  

1. Run `npm i`.

2. Fill `.env.sample` with your configuration and save it as `.env`

3. Run `npx prisma migrate dev --name init`.

4. Run `npm run dev`.

  

# Schema

You can create your schema in `prisma/schema.prisma`, we have a User entity to show you how to define everything!

There is a generator for Graphql to generate models automatically from Prisma schema.

```prisma
// prisma/schema.prisma

generator  typegraphql {
	provider  =  "typegraphql-prisma"
}

```

`output` is optional and should be used with `emitTranspiledCode`. if you don't define output, default generated folder will be created in `node_modules`.

```prisma

generator typegraphql {
    provider  =  "typegraphql-prisma"
    output  =  "./generated/"
    emitTranspiledCode  =  true
}

```

  

After `npx prisma migrate dev --name init` or `npx prisma generate` you have a beautiful crud with all relations and types.

  

**!note:** after each time you change `schema.prisma`, you have to run `npx prisma migrate dev --name anything` that 'anything' is any name you want to control each change on the database.

  

To read more about Prisma and type-graphql, [follow this link](https://prisma.typegraphql.com/docs/basics/configuration/).

# 🚀 Runner 
### index.ts
Here we have an index file that will create and run our server.

# ⚙️ Configuration 
### apollo.ts
I don't want to explain all about how to build a project with apollo, graphql, etc. so we'll talk only about specific configurations.

All we need to create a server with `apollo` is here.

Apollo-server 3 removes some features from Apollo-server 2.
one of these features is `playground`, to enable playground
you should add the following code to your apollo config 
(we enabled it in the boilerplate):
```typescript
// part of src/config/apollo.ts

import { ApolloServerPluginLandingPageGraphQLPlayground,
         ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
new ApolloServer({
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});
```

### app.ts
we need to create an express app to handle upload files (remove it if you don't have upload in your project but pay attention to clear usage from `index.ts` ).
`graphql-upload` is a package to handle upload in our graphql project and we use it as middleware.

### context.ts
we need to access `prismaClient` and user in the whole of our project so we have to define them in context.

# ![GraphQL-icon](https://s4.uupload.ir/files/graphql_u69v.png) GraphQL
### Inputs
We defined our input structures with `type-graphql` in this directory, inputs will be used to control input fields in requests.

for example login input:
```typescript
// src/graphql/inputs/Authentication.input.ts

import { InputType, Field } from  'type-graphql';

@InputType()
export  class  LoginInput {
    @Field()
    username: string;
    @Field()
    password: string;
}
```
### Interfaces
The interface is different from inputs, we will use these interfaces in the project but inputs are for validation requests.

for example Upload :
```typescript
// src/graphql/interfaces/Upload.interface.ts
import { Stream } from  'stream';

export  interface  Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () =>  Stream;
}
```

### Responses
In response, we define what should send to the client.

### Resolvers
With Prisma, we have all resolvers we need for CRUD, perfect and clean
resolvers to Create, Read, Update and Delete with all relations defined in Prisma schema.
But sometimes we may need a custom resolver for CRUD of a specific model,
to perform that we can extend a specific resolver. focus
your dry eyes for a big moment on the following example:

```typescript
// src/graphql/resolvers/User.resolver.ts

@Resolver(of => User)
export default class HashPassword extends UserCrudResolver {
  constructor() {
    super();
  }
  createUser(ctx, info, args) {
    args = this.hashPassword(args);
    return super.createUser(ctx, info, args);
  }
}
```
in this example, `HashPassword` class extends from `UserCrudResolver`,
with `super()` we have access to UCR methods. as we know `createUser` 
method (and many other crud methods like createManyUser, updateUser, etc.)
is used to create a new user and in user, we have to hash password so
in a method with the exact name in UCR class we'll get exact parameters
need for a resolver and after the change or check data, pass them to the original
method that called with super.

At some other time, we may need an extra resolver that is not defined in Prisma
so let's put our bloody wand down and do a real programming:
```typescript
// src/graphql/resolvers/Authentication.resolver.ts

@Resolver()
export default class AuthenticationResolver {
  @Mutation(() => outputs.UserOutput)
  async login(@Arg('data') data: inputs.LoginInput, @Ctx() ctx: AppContext) {
    const err = new Error('`username` or `password` is incorrect!');
    const user = await ctx.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });
    if (!user) throw err;

    const validPassword = await bcrypt.compare(data.password, user?.password);
    
    if (!validPassword) throw err;

    const token = await createToken(user);

    return {
      token,
      ...user,
    };
  }
}
```
this is login, have a good day... 👋😁

OK, now these new resolvers should register in apollo, same as
Prisma resolvers. to have a clean control on resolvers, we can
collect them all and export them in a single file:
```typescript
// src/graphql/resolvers/index.ts

import { NonEmptyArray } from 'type-graphql';

import { resolvers } from '@generated/type-graphql';
import AuthenticationResolver from './Authentication.resolver';
import UserResolver from "./User.resolver";

export default [
  ...resolvers,
  AuthenticationResolver,
  UserResolver
] as NonEmptyArray<Function>;
```

### Security

### Utils
**Logger.ts:**\
To enable logging (in console, or anywhere you want), you have to
set `ENABLE_LOG` to `true`. You can log user info (from context) and request
info (such as query, variables, etc.)
```typescript
// src/utils/logger.ts

const { query, operationName } = requestContext.request;
    if (
      operationName === 'IntrospectionQuery' &&
      process.env.ENABLE_LOG !== 'true'
    ) return {};

    const logLevel = getLevel(requestContext.logger.getLevel());
    const user = requestContext.context.user || 'GUEST';

    console.log(`[${logLevel}] user: ${user.username} | query: ${query}`);
```
**!note:** operation `IntrospectionQuery` is for the playground to get schema,
I suggest you keep ignoring this operation, but you can log it, if you need to adventure
