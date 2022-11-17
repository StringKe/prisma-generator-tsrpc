# @stringke/prisma-generator-tsrpc

> This generator was bootstraped
> using [create-prisma-generator](https://github.com/YassinEldeeb/create-prisma-generator)

## Usage

```sh
npm install @stringke/prisma-generator-tsrpc
```

```sh
yarn add @stringke/prisma-generator-tsrpc
```

```prisma
generator tsrpc {
    provider = "node ./node_modules/@stringke/prisma-generator-tsrpc"
    output   = "../src/shared/protocols/db"
}
```
