import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export async function verifyToken(request: Request): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}
