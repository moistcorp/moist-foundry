import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { txnid, amount, productinfo, firstname, email } = body

  const key = process.env.PAYU_MERCHANT_KEY!
  const salt = process.env.PAYU_SALT!

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`
  const hash = crypto.createHash('sha512').update(hashString).digest('hex')

  return NextResponse.json({ hash, key })
}