import argon2, { argon2id } from 'argon2'

const argon2_config: argon2.Options & { raw?: false } = {
    type: argon2id,
}

export async function hash(str: string) {
    return await argon2.hash(str, argon2_config)
}

export async function compare_hash(hash: string, plain: string | Buffer) {
    return await argon2.verify(hash, plain, argon2_config)
}
