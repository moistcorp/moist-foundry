import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const ALLOWED_AMOUNTS = ['499.00'] // only reservation fee allowed from this route

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { txnid, amount, productinfo, firstname, email } = body

    // Validate inputs
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Only allow whitelisted amounts
    if (!ALLOWED_AMOUNTS.includes(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Sanitize txnid — only alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(txnid)) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 })
    }

    const key = process.env.PAYU_MERCHANT_KEY!
    const salt = process.env.PAYU_SALT!

    if (!key || !salt) {
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 })
    }

    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`
    const hash = crypto.createHash('sha512').update(hashString).digest('hex')

    return NextResponse.json({ hash, key })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}