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

## Menus

## Orders

## Featured

# Data structures
## User
```ts
id: string
firstname: string
lastname: string
email: string
level: number
```
