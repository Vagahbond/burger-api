# Burger API
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
errors?: string
user?: User
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
