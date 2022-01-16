typescript prisma graphql type-graphql apollo-server-express postgresql

**!note:** Note that I am a junior and would be grateful if you could fix any bugs and add any additional features ❤️.

# How to run

  

1. Run `npm i`.

2. Fill `.env.sample` with your configuration and save it as `.env`

3. Run `npx prisma migrate dev --name init`.

4. Run `npm run dev`.

  

# Schema

You can create your schema in `prisma/schema.prisma`, we have a User entity to show you how to define everything!

There is a generator for Graphql to generate models automatically from prisma schema.

``` graphql

generator  typegraphql {
	provider  =  "typegraphql-prisma"
}

```

`output` is optional and should be used with `emitTranspiledCode`. if you don't define output, default generated folder will be created in `node_modules`.

``` graphql

generator  typegraphql {
	provider  =  "typegraphql-prisma"
	output  =  "./generated/"
	emitTranspiledCode  =  true
}

```

  

After `npx prisma migrate dev --name init` or `npx prisma generate` you have a beautiful crud with all relations and types.

  

**!note:** after each time you change `schema.prisma`, you have to run `npx prisma migrate dev --name anything` that 'anything' is any name you want to control each change on database.

  

To read more about prisma and type-graphql, [follow this link](https://prisma.typegraphql.com/docs/basics/configuration/).

# 🚀 Runner 
### index.ts
Here we have an index file that will create and run our server.

# ⚙️ Configuration 
### apollo.ts
I don't want to explain all about how to build a project with apollo, graphql and etc. so w'll talk only about specific configuration.

All we need to create a server with `apollo` is here.

### app.ts
we need to create an express app to handle upload files (remove it if you doesn't have upload in your project but pay attention to clear usage from `index.ts` ).
`graphql-upload` is a package to handle upload in our graphql project and we use it as middleware.

### context.ts
we need to access `prismaClient` and user in all of our project so we have to define them in context.

# ![GraphQL-icon](https://s4.uupload.ir/files/graphql_u69v.png) GraphQL
### Inputs
We defined our input structures with `type-graphql` in this directory, inputs will used to control input fields in requests.

for example login input:
``` typescript
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
Interface is different from inputs, we will use this interfaces in project but inputs are for validation requests.

for example Upload :
``` typescript
import { Stream } from  'stream';

export  interface  Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () =>  Stream;
}
```