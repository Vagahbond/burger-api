# Burger API

- [How to setup](#how-to-setup)
- [Endpoints](#endpoints)
  - [Setup](#setup)
  - [Auth](#auth)
  - [User](#user)
  - [Products](#products)
  - [Menus](#menus)
  - [Orders](#orders)
  - [Featured](#featured)
- [Data structures](#data-structures)
  - [User](#user-1)
  - [Product](#product)
  - [Menu](#menu)
  - [Order](#order)

# How to setup

- Clone this repository: `git clone https://github.com/Vagahbond/burger-api.git`
- Install NPM dependencies: `npm i`
- Make a [POST request at `/setup`](#post-setup) to define the admin user
- You're done!

# Endpoints

## Setup

### POST /setup

Setup Admin user.

#### Body data structure

```ts
firstname: string;
lastname: string;
email: string;
password: string;
```

#### Errors

- 500 - Failed to setup.

#### Response data structure

```ts
success: boolean
user?: User
errors?: string[]
```

## Auth

### POST /auth/register

Register a new account.

#### Body data structure

```ts
firstname: string;
lastname: string;
email: string;
password: string;
```

#### Errors

- 500 - Failed to register.

#### Response data structure

```ts
success: boolean
error?: string
user?: User
```

### POST /auth/login

Login to an account.

#### Body data structure

```ts
email: string;
password: string;
```

#### Errors

- 400 - Invalid credentials.
- 500 - Failed to login.

#### Response data structure

```ts
success: boolean
error?: string
token?: string
```

## User

### GET /users

Fetch all users.

#### Errors

- 500 - Could not query users.

#### Response data structure

```ts
success: boolean
error?: string
users?: User[]
```

### GET /users/:level

Fetch users with a specific right level.
Right levels are the following : 
```typescript
enum UserLevel {
    Customer,
    Preparator,
    Admin,
}
```

#### Errors

- 400 - Provided authentification level is invalid.
- 500 - Could not query users with level XXXXX.

#### Response data structure

```ts
success: boolean
error?: string
menu?: Menu[]
```

### get /user/:id

get the user with the requested ID.

#### Errors

- 404 - User with ID XXXXX does not exist.
- 500 - Could not query user.

#### Response data structure

```ts
success: boolean
error?: string
user?: User
```

### Get /user/email/:email

Get the user with the requested email address.

#### Errors

- 404 - User with email example@domain.com does not exist.
- 500 - Error while creating the product.

#### Response data structure

```ts
success: boolean
error?: string
user?: User
```

### PUT /user

Update the currently connected user.

#### Body data structure

```ts
firstname?: string
lastname?: string
password?: string
```

#### Errors

- 500 - Could not modify user account.

#### Response data structure

```ts
success: boolean
error?: string
user?: User
```

### PUT /user/rights/:id

Update the right of the specified user.

#### Body data structure

```ts
level?: string
```

#### Errors
- 304 - User XXXXXXXXXXX does not exist.
- 500 - Could not modify user account.

#### Response data structure

```ts
success: boolean
error?: string
user?: User
```

## Products

### GET /products

Fetch all products.

#### Errors

- 500 - Error while fetching products.

#### Response data structure

```ts
success: boolean
error?: string
products?: Product[]
```

### GET /products/:id

Fetch an product with a specific ID.

#### Errors

- 500 - Error while fetching the product.

#### Response data structure

```ts
success: boolean
error?: string
product?: Product
```

### POST /products

Create a product.

#### Body data structure

```ts
name: string;
count: integer;
price: number;
promotion: integer;
```

#### Errors

- 500 - Error while creating the product.

#### Response data structure

```ts
success: boolean
error?: string
product?: Product
```

### PUT /products

Update a product.

#### Body data structure

```ts
name?: string
count?: integer
price?: number
promotion?: integer
featured?: boolean
```

#### Errors

- 500 - Error while creating the product.

#### Response data structure

```ts
success: boolean
error?: string
product?: Product
```

## Menus

### GET /menus

Fetch all menus.

#### Errors

- 500 - Could not query menus.

#### Response data structure

```ts
success: boolean
error?: string
menus?: Menu[]
```

### GET /menu/:id

Fetch a menu with a specific ID.

#### Errors

- 500 - Could not query menu.

#### Response data structure

```ts
success: boolean
error?: string
menu?: Menu
```

### POST /menus

Create a menu.

#### Body data structure

```ts
name: string
products: integer
price: number
promotion: integer
featured: boolean
```

#### Errors

- 400 - Product XXXXXXXXXX does not exist.
- 500 - Failed to create menu.

#### Response data structure

```ts
success: boolean
error?: string
menu?: menu
```

### PUT /menus/:id

update a menu's properties.

#### Body data structure

```ts
name?: string
products?: integer
price?: number
promotion?: integer
featured?: boolean
```

#### Errors

- 304 - Menu XXXXXXXXXX does not exist.
- 500 - Error while updating the order.

#### Response data structure

```ts
success: boolean
error?: string
menu?: Menu
```

## Orders

### GET /orders

Fetch all orders.

#### Errors

- 500 - Error while fetching orders.

#### Response data structure

```ts
success: boolean
error?: string
orders?: Order[]
```

### GET /orders/:id

Fetch an order with a specific ID.

#### Errors

- 500 - Error while fetching the order.

#### Response data structure

```ts
success: boolean
error?: string
order?: Order
```

### POST /orders/:id/cancel

Cancel a specific order.

#### Errors

- 500 - Error while updating the order.

#### Response data structure

```ts
success: boolean
error?: string
```

### POST /orders/:id/done

Validate the completion of a specific order.

#### Errors

- 500 - Error while updating the order.

#### Response data structure

```ts
success: boolean
error?: string
```

### POST /orders

Create an order.

#### Body data structure

```ts
products: string[]
menus: string[]
```

#### Errors

- 400 - Product with id 'xxxxxxxxxxxxxxxxxxxxxxxx' doesn't exists.
- 400 - There is no more products with id 'xxxxxxxxxxxxxxxxxxxxxxxx' available.
- 400 - Menu with id 'xxxxxxxxxxxxxxxxxxxxxxxx' doesn't exists.
- 500 - Error while creating the order.

#### Response data structure

```ts
success: boolean
error?: string
order?: Order
```

## Featured

### GET /featured

Fetch all featured products and menus.

#### Errors

- 500 - Error while fetching products and menus.

#### Response data structure

```ts
success: boolean
error?: string
products: Product[]
menus: Menu[]
```

# Data structures

## User

```ts
id: string;
firstname: string;
lastname: string;
email: string;
level: number;
```

## Product

```ts
_id: string;
name: string;
count: number;
price: number;
promotion: number;
featured: boolean;
```

## Menu

```ts
_id: string
name: string,
products: (string | Product)[]
price: number
promotion: number
featured: boolean
```

## Order

```ts
_id: string
status: number
customer?: string
products: Product[]
menus: Menu[]
creation_date?: Date
withdrawal_date?: Date
```
