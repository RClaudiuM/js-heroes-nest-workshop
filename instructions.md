[TOC]

# JS Heroes Nest Workshop

## What we're gonna build

In this workshop we will create a simple REST API using [NestJS](https://docs.nestjs.com/).

The application that we're gonna build is by no means a production ready application. It's a simple API that will serve as a foundation for a real application.

## Prerequisites

- GIT installed
- Node.js 22.x or newer
- VS Code or other IDE of your choice
- [Docker](https://www.docker.com/) installed
- [DBeaver](https://dbeaver.io/) or other database client installed (optional)

## 1. Project Setup

### 1.1. Install Nest CLI

In order to bootstrap a starter project we will have to use [Nest CLI](https://docs.nestjs.com/cli/overview) and install it with the following command:

```bash
npm install -g @nestjs/cli
```

### 1.2. Create a new project

We will use the `nest new` command to create a new project.

To create it in the current directory we will use the following command:

```bash
nest new .
```

Be sure to chose `npm` as the package manager.
The command will create the project structure and install the dependencies.
Take some time to explore the project structure and the files inside.

### 1.3. [Nestjs Modules](https://docs.nestjs.com/modules)

In Nestjs, a module is a class that groups together related functionality.
The said resource can be either a controller, a provider, a module, etc.
Take a look at the [`src/app.module.ts`](src/app.module.ts) file and you will see that it is a module that imports other modules and providers and makes it available to the application.

### 1.4. [Nestjs Controllers](https://docs.nestjs.com/controllers)

In Nestjs, a controller is a class that handles incoming HTTP requests and sends back HTTP responses.
Take a look at the [`src/app.controller.ts`](src/app.controller.ts) file.

### 1.5. [Nestjs Providers](https://docs.nestjs.com/providers)

In Nestjs, a provider is a class that can be injected as a dependency.
The services should handle the business logic of the application.
Take a look at the [`src/app.service.ts`](src/app.service.ts) file.

They are injected into the necessary controllers with the help of [Dependency Injection.](https://docs.nestjs.com/providers#dependency-injection)

### 1.6. Run the project

The entrypoint of the application is the [`src/main.ts`](src/main.ts) file.

To run the project we will use the `nest start` command.

```bash
npm run start:dev
```

The project will start on port 3000.
You can access the API at `http://localhost:3000`.

When you're done, close the project by pressing `Ctrl+C`.

### 1.7. Update `tsconfig.json`

We will use [Prisma](https://www.prisma.io/) as our ORM for a postgres database.
In order to use Prisma we need to update the `tsconfig.json` file.
We will have to change the module and module resolution to `commonjs` and `node` respectively.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

## 2. Core endpoint definition

In this section we will define a `pokemons` resource and we will learn some utilities from `nestjs/common`.

### 2.1. Create a new resource with the Nest CLI

The Nest CLI is powerful and allows us to create a new resource with the following command:

```bash
nest g resource pokemons
```

Make sure you chose `REST API` as the transport layer.
And also chose `no` when prompted for CRUD entry points.

### 2.2. Explore the generated files

The above CLI command generated the necessary files for the `pokemons` resource and also added the pokemons module to the [`app.module.ts`](src/app.module.ts) file.

### 2.3. Define a GET endpoint

Take a look at the [`src/pokemons/pokemons.controller.ts`](src/pokemons/pokemons.controller.ts) file.

We will next define a get endpoint to fetch all of our pokemons but first we will need to add the business logic into our [PokemonService](src/pokemons/pokemons.service.ts) and to do that we will define a `findAll` method inside the service that should just return a string for now.

```typescript
export class PokemonsService {
  public findAll() {
    return 'Returned all pokemons';
  }
}
```

Once that is done we can go back to our controller to define the GET endpoint.
The Pokemon service is already injected into the controller via the constructor and we can access it using `this.pokemonsService`.

In order to define a GET endpoint, we will use the `@Get` decorator from the `@nestjs/common` package and return the result of the `findAll` method from the service.

```typescript
@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  findAll() {
    return this.pokemonsService.findAll();
  }
}
```

Once that is done we can run the project and test our endpoint.

```bash
npm run start:dev
```

You can access the API at [`http://localhost:3000/pokemons`](http://localhost:3000/pokemons).

You should see the response `Returned all pokemons`.

### 2.4. Define a GET by id endpoint

First we will need to define a `findOne` method inside the service. It should take an id as a parameter and return a string with the id.

```typescript
export class PokemonsService {
  public findOne(id: string) {
    return `Returned pokemon with id ${id}`;
  }
}
```

Once we have defined the method into the service we can go back to the controller to define the GET by id endpoint.

In order to define a GET by id endpoint, we will again use the `@Get` decorator from the `@nestjs/common` package but this time we will also use the `@Param` decorator to get the id from the request parameters.

What the `@Param` decorator does is that it will extract the id from the request parameters and make it available as a string.

```typescript
@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonsService.findOne(id);
  }
}
```

### 2.5 Add query parameters into our GET endpoint

Let's say we want a list of pokemons with a specific type, electric, for example.

In order to achieve that we will need to add a query parameter to our GET endpoint.
Nestjs has a built in way to handle query parameters using the `@Query` decorator.

What that decorator does is that it will extract the query parameters from the request and make them available as a plain object.

We will update the `findAll` method in the service to accept a type query parameter and return a string with the type if it is provided.

```typescript
@Get()
findAll(@Query('type') type?: string) {
  return this.pokemonsService.findAll(type);
}
```

And in our service we will need to update the findAll method to accept that `type` parameter:

```typescript
public findAll(type?: string) {
  return `Returned all pokemons ${type ? `with type ${type}` : ''}`;
}
```

### 2.6. Read env variables with the help of `ConfigModule`

In order to read environment variables we will need to install the `ConfigModule` as a dependency.

```bash
npm i --save @nestjs/config
```

The `ConfigModule` will have to be set up globally in our app module:
Just add `ConfigModule.forRoot({ isGlobal: true }),` to the imports array of the app module.

Once that's done you can create a `.env` file and declare a variable in there, for example a `NODE_ENV` variable.

```env
NODE_ENV=development
```

We can then make use of the `ConfigService` to read the variable from the `.env` file.
For that we will import the config service in our `AppService` and instantiate it in the constructor.
We will also add a property to the service to store the environment variable and use it in the `getHello` method.

```typescript
export class AppService {
  environment: string;
  constructor(private readonly configService: ConfigService) {
    this.environment = this.configService.get('NODE_ENV') ?? 'not-defined';
  }

  getHello(): string {
    return `Hello World! ${this.environment}`;
  }
}
```

If you now restart the project you should see the environment variable in the response.
Try changing the environment variable in the `.env` file and see the changes in the response after restarting the project.

### 2.7. Other useful decorators

There are other useful decorators that we can use to handle the request.

- `@Body`: To extract the body of the request.
- `@Headers`: To extract the headers of the request.
- `@Ip`: To extract the IP address of the request.
- `@HostParam`: To extract a specific host parameter from the request.
- `@Session`: To extract the session from the request.
- `@Req`: To extract the entire request object.
- `@Res`: To extract the response object.

## 3. Database integration

In this section we will integrate our API with a postgres database using [Prisma](https://www.prisma.io/) and [Docker](https://www.docker.com/).

### 3.1. Define a docker-compose file

We will create a `docker-compose.yml` file in the root of the project to define the services we need for our database.

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:17
    container_name: js-heroes-postgres-dev
    environment:
      POSTGRES_DB: js-heroes-backend
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres-data-js-heroes:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres -d js-heroes-backend']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data-js-heroes:
```

After you define the file, you can either run it from the ide ( extension might be needed) or from the command line using the following command:

```bash
docker-compose up -d
```

This will start the postgres container and make it available on port 5432.
You can then connect to the database using DBeaver or your preferred database client.

### 3.2. Setting up Prisma

We will use Prisma to interact with the database so we should install it as a dev dependency.

```bash
npm install prisma --save-dev
```

We will use prisma cli to handle various DB operations and a best practice is to call it like this:

```bash
npx prisma <command>
```

We will next initialize prisma in our project by running the following command:

```bash
npx prisma init
```

This will generate three files:

- [.env](.env): Environment variables file.
- [prisma.config.ts](prisma.config.ts): Prisma configuration file.
- [prisma/schema.prisma](prisma/schema.prisma): Prisma schema file.

We will have to install dotenv as a dependency to be able to use the environment variables in our project.

```bash
npm install dotenv --save
```

And also add `import 'dotenv/config';` at the top of the prisma config file so that it can read the environment variables from the .env file.

Next we will have to update our [schema.prisma](prisma/schema.prisma) client provider to be `prisma-client-js` so that it is compatible with Nestjs.

We will also have to update tsconfig.build.json to include the generated prisma client.

```json
{
  "extends": "./tsconfig.json",
  "include": ["src", "generated"],
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```

### 3.3. Set up database connection

In our env file since we're running our own postgres instance we will have to set the DATABASE_URL environment variable.

This should be the correct connection string for our postgres instance.

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/js-heroes-backend
```

### 3.4. Add User Model run first migration on the database

We can define a user model in our schema.prisma file.

```typescript
model User {
  @@map("users")
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Once that is done we can run the first migration on the database by running the following command:

```bash
npx prisma migrate dev --name init
```

The above command will create a new migration file in the migrations folder and run it on the database.

If all goes well you should see a `users` table and a `_prisma_migrations` table created in the database.

### 3.5. Generate Prisma client and use it in our project

In order to generate the prisma client we will first need to install it as a dependency.

```bash
npm install @prisma/client
```

The above command will also generate the prisma client in the `generated` folder.
You can read more on how prisma works [here](https://docs.nestjs.com/recipes/prisma)

#### 3.5.1. Use the Prisma client in a service

In order to use the prisma client in our project we will have to declare a service that will handle the database connection and the database operations.
Wean create a new file called `prisma.service.ts` in the `src` folder.

```typescript
import { Injectable, OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

This service leverages OnModuleInit and OnModuleDestroy to handle the database connection and disconnection.
OnModuleInit is a lifecycle hook that is called when the module is initialized.
OnModuleDestroy is a lifecycle hook that is called when the module is destroyed.

Now we should theoretically be able to use the prisma service in our project but first we will need to define a `users` resource.

## 4. Add a swagger interface for our project

In order to facilitate the testing of our API we will add a swagger interface to our project.

### 4.1. Set up swagger

We will install the swagger package as a dependency.

```bash
npm install --save @nestjs/swagger
```

And then in our main.ts file we will add a new function named `configureSwagger`:

```typescript
function configureSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JS Heroes API')
    .setDescription('This is a nice description of the API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}
```

and then call it in the bootstrap function.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
```

If all goes well you should be able to access the swagger interface at [`http://localhost:3000/docs`](http://localhost:3000/docs).

## 5. Define a resource and link it to database

In this section we will define a resource and link it to the database.

### 5.1. Define a `users` resource

We will define a `users` resource in our project by using the Nest CLI.

```bash
nest g resource users
```

Make sure you chose `REST API` as the transport layer.
And this time chose `yes` when prompted for CRUD entry points.

This time the command generated additional files for the `users` resource and also added the users module to the [`app.module.ts`](src/app.module.ts) file.

The additional files generated contain the DTOs for the `users` resource.
What is a DTO you ask?
DTO stands for Data Transfer Object.
It is a plain object that carries data between processes.
It is used to transfer data between the client and the server.
It is also used to validate the data that is sent to the server.

In order to create a user we will need an `email` and a `password` field so we can specify them in the [src/users/dto/create-user.dto.ts](src/users/dto/create-user.dto.ts) file

We can also take advantage of the fact that we have set up swagger and provide aditional ApiProperty decorators to the DTOs.

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;
}
```

If you added those and refresh the swagger interface you should see the email and password fields with the example values.

### 5.2. Create a new user in the database

Right now our POST `users` endpoint only outputs a string. but we want it to create a new user in the database.

To do that we will need to use the prisma service to create a new user in the database and we will need to update the `create` method in the [src/users/users.service.ts](src/users/users.service.ts) file.

But first don't forget to add the `PrismaService` as a provider in the [src/users/users.module.ts](src/users/users.module.ts) file.

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
```

In our service we will have to firstly add prisma as a dependency and then use it to create a new user in the database.
We can specify it in the constructor of the service.

```typescript
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
}
```

And then use it to create a new user in the database.

```typescript
create(createUserDto: CreateUserDto) {
  return this.prisma.user.create({
    data: {
      email: createUserDto.email,
      password: createUserDto.password,
    },
  });
}
```

We should also update the findAll method to return all users from the database and select only the email and id fields.

```typescript
findAll() {
  return this.prisma.user.findMany({ select: { email: true, id: true } });
}
```

You can now run the project and try the endpoints!

## 6. Basic validation with [pipes](https://docs.nestjs.com/pipes)

In this section we will add basic validation to our DTOs using the `class-validator` and `class-transformer` packages.

What are pipes you ask?
Pipes are classes that implement the PipeTransform interface.
They are used to transform the data before it is handled by the controller.
They are also used to validate the data.
You can read more about them [here](https://docs.nestjs.com/pipes).

### 6.1. Install the necessary packages

We will install the `class-validator` and `class-transformer` packages as dependencies.

```bash
npm i --save class-validator class-transformer
```

### 6.2. Setup a global pipe

For the scope of this project we will setup a global pipe in the [`src/main.ts`](src/main.ts) file.

Just before the `configureSwagger` function we will add the following code:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    disableErrorMessages: false,
  })
);
```

### 6.3. Add validation to the DTOs

Then on our create-user.dto.ts file we will add an `@IsEmail` decorator to the email field and an `@IsString` decorator to the password field so that they are validated before it is handled by the controller.

```typescript
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

You can now run the project and try to create a new user with an invalid email.
You should get a 400 Bad Request response with the error message.

```json
{
  "message": ["email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 7. API Documentation with Swagger

In this section we will document our API using swagger

### 7.1. Add Swagger decorators to the controllers

Api documentation is done using swagger decorators.

Some useful decorators are:

- `@ApiTags`: To group related endpoints.
- `@ApiOperation`: To add a description to the endpoint.
- `@ApiResponse`: To add a response to the endpoint.
- `@ApiBody`: To add a body to the endpoint.
- `@ApiQuery`: To add a query parameter to the endpoint.
- `@ApiParam`: To add a path parameter to the endpoint.
- `@ApiHeader`: To add a header to the endpoint.
- `@ApiCookie`: To add a cookie to the endpoint.
- `@ApiSecurity`: To add a security scheme to the endpoint.

We will update the [src/users/users.controller.ts](src/users/users.controller.ts) file to add these decorators to the endpoints.

For example for the create endpoint we will add the following decorators

```typescript
@Get()
@ApiOperation({ summary: 'Get all users' })
@ApiResponse({ status: HttpStatus.OK, description: 'Get all users' })
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
findAll() {
  return this.usersService.findAll();
}
```

If you refresh the swagger interface you should see the documentation for the endpoint.

Now we can document the create user endpoint.

```typescript
@Post()
@ApiOperation({ summary: 'Create a new user' })
@ApiBody({ type: CreateUserDto })
@ApiResponse({
  status: HttpStatus.CREATED,
  description: 'User created successfully',
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

## 8. Authentication with Passport and JWT

In this section we will add authentication to our API using Passport and JWT.

Authentication is an essential part of any API and there are many different approaches and strategies to handle it.

We will use Passport to implement a basic authentication strategy.

We will first login with an email and password and then we will get a JWT token that can be used to authenticate requests to the API.

### 8.1. Install the necessary packages

We will install the `passport` and `passport-jwt` packages as dependencies.

```bash
npm install --save @nestjs/passport passport passport-local @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-local @types/passport-jwt
```

### 8.2. Update user service with find by email method

We will add a new method to the [src/users/users.service.ts](src/users/users.service.ts) file to find a user by email.

```typescript
async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
  });
}

```

We will also want to export the `UsersService` from the `UsersModule` so that we can use it in the `AuthService`.

### 8.3. Create a custom @Public decorator

We will create a custom decorator to mark endpoints as public so that they are not protected by authentication.

We will do that under `src/common/decorators/public.decorator.ts` file where we will set a metadata key `isPublic` to true.

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### 8.4. Create AUTH resource and a local passport strategy

We will create a new resource for the authentication.

```bash
nest g resource auth
```

In the auth Module we will import `PassportModule` and `UsersModule` and we will also configure the `JwtModule` with a secret and an expiration time.

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

Then in the auth service we will import the `UsersService` and use it to validate the user.
We will also need to create a login method in the `AuthService` that will be used to login a user.

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: this.jwtService.sign({ email, password }),
    };
  }
}
```

**IMPORTANT:** We are not hashing the password here for the sake of simplicity. In a real application you would want to hash the password before storing it in the database.

Then in the created `auth` folder we will create a `strategies` folder and inside it we will create a `local.strategy.ts` file.

```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../../../generated/prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

What happens on the LocalStrategy class?
swap the usernameField to email and the validate method to use the email and password.
TODO: explain this

Now we need to add the local Strategy to the auth module providers.

### 8.5. Create a local auth guard

Guards in nestjs are classes that implement the CanActivate interface.
They are used to protect endpoints and to validate requests.
You can read more about them [here](https://docs.nestjs.com/guards).

For this workshop we will create a local auth guard `src/auth/guards/localAuth.guard.ts` that will be used to protect the login endpoint.

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

### 8.6. Create login endpoint and use the local auth guard

We will add a login endpoint to the [src/auth/auth.controller.ts](src/auth/auth.controller.ts) file.

```typescript
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/localAuth.guard';
// How should loginDto look like?
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login({
      email: loginDto.email,
      password: loginDto.password,
    });
  }
}
```

After calling this endpoint you should get a JWT token in the response.

### 8.7 Setting up a JWT strategy

We will need to create a JWT strategy in the `src/auth/strategies/jwt.strategy.ts` file in order to extract the JWT token from the request and validate it.

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { UsersService } from 'src/users/users.service';

interface JwtPayload {
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO: get the secret from the environment variables
      secretOrKey: 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
```

Our `JwtStrategy` holds the actual JWT validation logic and it will work hand in hand with another guard that we will create in the next section.
Our `JwtStrategy` extends `PassportStrategy(Strategy)`, which tells Next to register this as a Passport JWT strategy.

We're calling `super` with the options for the JWT strategy.
We're telling Passport to extract the JWT token from the Authorization header using the `ExtractJwt.fromAuthHeaderAsBearerToken()` function.
We're also telling Passport to ignore the expiration time of the token.
We're also telling Passport to use the `secret` key to verify the token.

Our class implements the `validate` method, which is the method that Passport will use to validate the token.

Here's the flow:

1. Passport extracts and verifies the JWT token
2. If valid, it decodes the payload (which contains the user's email)
3. The validate() method receives this payload as the JwtPayload object
4. We fetch the user from the database using usersService.findByEmail(payload.email)
5. If no user is found, we throw an UnauthorizedException
6. If everything checks out, we return the user object

**Don't forget to add the JwtStrategy to the AuthModule providers.**

### 8.8 Setting up a JWT global guard

We will now need a guard in order to protect our private endpoints.
We will create a `JwtAuthGuard` in the `src/auth/guards/jwtAuth.guard.ts` file.

```typescript
import { Injectable, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'generated/prisma';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<T = User>(err: Error | null, user: T) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user as T;
  }
}
```

The `JwtAuthGuard` acts as a gatekeeper, it decides whether a request gets trough the route handler or gets blocked.

The defined class extends the `AuthGuard('jwt')` which does the heavy lifting ( it triggers the JWT strategy and validates the token ).

We're injecting `Reflector` in order to check the metadata of our routes ( public or private ).

The `canActivate` method runs before our route handler and:

1. checks if the route is public
2. if it is public, it allows the request to pass through
3. if it is not public, it calls `super.canActivate(context)` to trigger the JWT strategy and validate the token.

The `handleRequest` method is the method that handles the request after it has been validated.

The guard is defined, now we will need to register it as a global guard.For that we will specify it as a custom provider inside our `app.module.ts` file as:

```typescript
{
  provide: APP_GUARD, // <- this comes from @nestjs/core
  useClass: JwtAuthGuard,
},
```

### 8.9. Setting up swagger to use the JWT token in requests

At this point every endpoint that is not marked as public with our custom decorator will be protected by the JWT auth guard.

You can try it by running a request on the previously defined endpoints that are not marked as public with our custom decorator.
You will see a 401 Unauthorized response.

BUT, we will need a way to send the JWT token in the request headers from the swagger interface in order to test the endpoints right? Let's do that.

In our main.ts file we will need to update the `configureSwagger` function to add bearer authentication.
We will add the following after `setVersion('1.0')`:

```typescript
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
  },
  'token',
)
.addSecurityRequirements('token')
```

That tells the swagger interface to add a bearer authentication token to the request headers.

You can now refresh the swagger interface and you should see an `Authorize` button that will open up a modal to enter the JWT token.

You can get that from hitting the login endpoint.

## 9. Custom providers

By default, NestJS handles dependency injection automatically when you use the @Injectable() decorator on your services. But there are scenarios where you need more control over how dependencies are created and injected.

For that we have the possibility to create custom providers.

Custom providers solve these problems:

- Conditional logic
  You need different implementations based on environment (development vs production)
- External values
  You want to inject configuration objects, API keys, or constants
- Factory patterns
  The creation of your service requires complex initialization logic
- Interface-based design
  You want to inject different implementations of the same interface

We've already seen custom providers in action in our auth setup [src/auth/guards/jwtAuth.guard.ts, src/app.module.ts]. When we registered `JwtAuthGuard` globally using `APP_GUARD`, that was a custom provider. Instead of letting NestJS automatically handle it, we explicitly told it how to provide that guard throughout your application.

### 9.1. Create a custom provider

We will create a `storage` resource in which we will define a custom provider to handle the storage of the data.
The provider will use the `useFactory` pattern to create the storage service.

We will use the Nest CLI to create the resource.

```bash
nest g resource storage
```

**REST API and NO CRUD endpoints.**

Inside the storage service we will define the abstract class that will be implemented by the storage services.
The abstract class will have two methods: `save` and `retrieve`.

```typescript
export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export abstract class StorageService {
  abstract save(data: string): string;
  abstract retrieve(id: string): string;
}
```

We will then create a services folder inside the `src/storage` folder and inside it we will create two services that will implement the interface:

- developmentStorage.service.ts
- productionStorage.service.ts

Example of the DevelopmentStorageService:

```typescript
import { Injectable } from '@nestjs/common';
import type { StorageService } from 'src/storage/storage.service';

@Injectable()
export class DevelopmentStorageService implements StorageService {
  retrieve(id: string): string {
    return `[Development] Retrieved data for id: ${id}`;
  }

  save(data: string): string {
    return `[Development] Saved data: ${data}`;
  }
}
```

Once we have defined the services we will then need to update the storage module to use the necessary service based on the environment.

Inside the storage module we will declare a custom provider that will use the `useFactory` pattern to create the storage service based on the environment.

```typescript
providers: [
  {
    provide: STORAGE_PROVIDER,
    useFactory: (configService: ConfigService) => {
      const environment =
        configService.get<string>('NODE_ENV') ?? 'development';
      return environment === 'development'
        ? new DevelopmentStorageService()
        : new ProductionStorageService();
    },
    inject: [ConfigService],
  },
],
```

What happens here?

We are declaring a custom provider that makes use of the `useFactory` pattern to create the storage service based on the environment.
We are injecting the `ConfigService` into the factory function in order to use it to read the environment variable.
Inside the factory function we are returning the appropriate storage service based on the environment.

Lastly we will export the STORAGE_PROVIDER token in order to be able to use it in other modules.

```typescript
exports: [STORAGE_PROVIDER],
```

### 9.2. Use the storage service in the storage controller

We will now need to use the storage service in the storage controller.

Inside the storage controller constructor we will make use of the abstract class to inject the storage service and a token to inject the service.

```typescript
constructor(
  @Inject(STORAGE_PROVIDER) private readonly storageService: StorageService,
) {}
```

What happens here?
We tell NestJS that we want to inject the STORAGE_PROVIDER token into the constructor in order to inject the storage service.

```typescript
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { STORAGE_PROVIDER, StorageService } from 'src/storage/storage.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(@Inject(STORAGE_PROVIDER) private readonly storageService: StorageService) {}

  @Get(':id')
  @Public()
  retrieve(@Param('id') id: string) {
    return this.storageService.retrieve(id);
  }
}
```

We can now test the endpoint in swagger and see the response, then change node_env to production and see the response again.

# 10. Additional chapters or homework

## 10.1. Add hashing on user passwords

## 10.2. Use a data access layer (DAL)

## 10.3. Add a simple Role-Based Access Control (RBAC)

## 10.4. Dynamic module usage
