import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, type } = body

  try {
    await resend.emails.send({
      from: 'Moist Foundry <moistfoundry@moistcorp.com>',
      to: email,
      subject: 'We received your request - Moist Foundry',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111111;">
          <div style="border-bottom: 1px solid #E5E5E5; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Moist Foundry</h1>
          </div>

          <p style="font-size: 15px; margin-bottom: 8px;">Hi ${name.split(' ')[0]},</p>
          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Thanks for reaching out. We've received your ${type === 'configure' ? 'order configuration' : 'enquiry'} and our team will review it and get back to you with a detailed quote within <strong>24 hours</strong>.
          </p>

          ${type === 'configure' ? `
          <div style="background: #F7F7F7; border: 1px solid #E5E5E5; padding: 16px 20px; margin: 24px 0; font-size: 13px; color: #555;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #111;">What happens next</p>
            <ol style="margin: 8px 0 0 0; padding-left: 18px; line-height: 1.8;">
              <li>We review your configuration</li>
              <li>We send you a detailed proforma invoice</li>
              <li>Once confirmed, production begins</li>
              <li>Delivery within 35 days</li>
            </ol>
          </div>
          ` : ''}

          <p style="font-size: 14px; color: #888; line-height: 1.6;">
            If you have any urgent questions, reply to this email or WhatsApp us directly.
          </p>

          <div style="border-top: 1px solid #E5E5E5; margin-top: 32px; padding-top: 20px; font-size: 12px; color: #aaa;">
            <p style="margin: 0;">Moist Foundry — Powered by Moist Corp</p>
            <p style="margin: 4px 0 0 0;">Greater Noida, Uttar Pradesh, India</p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}