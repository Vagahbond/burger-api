# Burger API

- [Endpoints](#endpoints)
    - [Auth](#auth)
        - [POST /auth/register](#post-authregister)
    - [User](#user)
    - [Products](#products)
    - [Menus](#menus)
    - [Orders](#orders)
    - [Featured](#featured)
- [Data structures](#data-structures)
    - [User](#user-1)

# Endpoints
## Auth
### POST /auth/register
Register a new account.

#### Body data structure
```ts
firstname: string
lastname: string
email: string
password: string
```

#### Errors
* 500 - Failed to register.

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
email: string
password: string
```

#### Errors
* 400 - Invalid credentials.
* 500 - Failed to login.

#### Response data structure
```ts
success: boolean
error?: string
token?: string
```

## User

## Products

### GET /products
Fetch all products.

#### Errors
* 500 - Error while fetching products.

#### Response data structure
```ts
success: boolean
error?: string
products?: Product[]
```

### GET /products/:id
Fetch an product with a specific ID.

#### Errors
* 500 - Error while fetching the product.

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
name: string
count: integer
price: number
promotion: integer
```

#### Errors

* 500 - Error while creating the product.

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

* 500 - Error while creating the product.

#### Response data structure
```ts
success: boolean
error?: string
product?: Product
```

## Menus

## Orders
### GET /orders
Fetch all orders.

#### Errors
* 500 - Error while fetching orders.

#### Response data structure
```ts
success: boolean
error?: string
orders?: Order[]
```

### GET /orders/:id
Fetch an order with a specific ID.

#### Errors
* 500 - Error while fetching the order.

#### Response data structure
```ts
success: boolean
error?: string
order?: Order
```

### POST /orders/:id/cancel
Cancel a specific order.

#### Errors
* 500 - Error while updating the order.

#### Response data structure
```ts
success: boolean
error?: string
```

### POST /orders/:id/done
Validate the completion of a specific order.

#### Errors
* 500 - Error while updating the order.

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
* 400 - Product with id 'xxxxxxxxxxxxxxxxxxxxxxxx' doesn't exists.
* 400 - There is no more products with id 'xxxxxxxxxxxxxxxxxxxxxxxx' available.
* 400 - Menu with id 'xxxxxxxxxxxxxxxxxxxxxxxx' doesn't exists.
* 500 - Error while creating the order.

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

* 500 - Error while fetching products and menus.

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
id: string
firstname: string
lastname: string
email: string
level: number
```

## Product
```ts
_id: string
name: string
count: number
price: number
promotion: number
featured: boolean
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
