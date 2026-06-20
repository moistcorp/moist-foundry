import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, type, orderDetails } = body

  const firstName = name.split(' ')[0]

  const contactEmailHtml = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111111;">
      <div style="border-bottom: 1px solid #E5E5E5; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.3px;">Moist Foundry</h1>
      </div>
      <p style="font-size: 15px; margin-bottom: 6px;">Hi ${firstName},</p>
      <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
        Thanks for reaching out. We&apos;ve received your enquiry and our team will review it and get back to you with a detailed quote within <strong style="color: #111;">24 hours</strong>.
      </p>
      <div style="background: #F7F7F7; border: 1px solid #E5E5E5; padding: 16px 20px; margin-bottom: 24px;">
        <p style="font-size: 12px; font-weight: 600; color: #111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">What happens next</p>
        <ol style="margin: 0; padding-left: 18px; font-size: 13px; color: #555; line-height: 2;">
          <li>We review your requirements</li>
          <li>We send you a detailed proforma invoice</li>
          <li>Once confirmed, production begins</li>
          <li>Delivery within 35 days</li>
        </ol>
      </div>
      <p style="font-size: 13px; color: #888; line-height: 1.7;">
        If you have any urgent questions, reply directly to this email.
      </p>
      <div style="border-top: 1px solid #E5E5E5; margin-top: 32px; padding-top: 20px; font-size: 11px; color: #aaa;">
        <p style="margin: 0;">Moist Foundry — Powered by Moist Corp</p>
        <p style="margin: 4px 0 0 0;">Greater Noida, Uttar Pradesh, India</p>
      </div>
    </div>
  `

  const configureEmailHtml = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111111;">
      <div style="border-bottom: 1px solid #E5E5E5; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.3px;">Moist Foundry</h1>
      </div>

      <p style="font-size: 15px; margin-bottom: 6px;">Hi ${firstName},</p>
      <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
        Your slot reservation is confirmed. Here&apos;s a summary of your configuration. Our team will review it and send your proforma invoice within <strong style="color: #111;">24 hours</strong>.
      </p>

      ${orderDetails ? `
      <div style="border: 1px solid #E5E5E5; margin-bottom: 24px;">
        <div style="background: #111111; padding: 12px 20px;">
          <p style="font-size: 11px; font-weight: 600; color: white; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Order Configuration</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${orderDetails.product ? `
          <tr style="border-bottom: 1px solid #F0F0F0;">
            <td style="padding: 10px 20px; color: #888; width: 40%;">Product</td>
            <td style="padding: 10px 20px; color: #111; font-weight: 500;">${orderDetails.product}</td>
          </tr>` : ''}
          ${orderDetails.color ? `
          <tr style="border-bottom: 1px solid #F0F0F0;">
            <td style="padding: 10px 20px; color: #888;">Fabric color</td>
            <td style="padding: 10px 20px; color: #111; font-weight: 500;">${orderDetails.color}</td>
          </tr>` : ''}
          ${orderDetails.technique ? `
          <tr style="border-bottom: 1px solid #F0F0F0;">
            <td style="padding: 10px 20px; color: #888;">Print technique</td>
            <td style="padding: 10px 20px; color: #111; font-weight: 500;">${orderDetails.technique}</td>
          </tr>` : ''}
          ${orderDetails.placements ? `
          <tr style="border-bottom: 1px solid #F0F0F0;">
            <td style="padding: 10px 20px; color: #888;">Placement</td>
            <td style="padding: 10px 20px; color: #111; font-weight: 500;">${orderDetails.placements}</td>
          </tr>` : ''}
          ${orderDetails.totalQty ? `
          <tr style="border-bottom: 1px solid #F0F0F0;">
            <td style="padding: 10px 20px; color: #888;">Total quantity</td>
            <td style="padding: 10px 20px; color: #111; font-weight: 500;">${orderDetails.totalQty} pieces</td>
          </tr>` : ''}
          ${orderDetails.sizeBreakdown ? `
          <tr style="border-bottom: 1px solid #F0F0F0;">
            <td style="padding: 10px 20px; color: #888;">Size breakdown</td>
            <td style="padding: 10px 20px; color: #111; font-weight: 500;">${orderDetails.sizeBreakdown}</td>
          </tr>` : ''}
          ${orderDetails.estimatedTotal ? `
          <tr style="background: #F7F7F7;">
            <td style="padding: 12px 20px; color: #888; font-weight: 600;">Estimated total</td>
            <td style="padding: 12px 20px; color: #111; font-weight: 700; font-size: 15px;">${orderDetails.estimatedTotal}</td>
          </tr>` : ''}
        </table>
      </div>
      ` : ''}

      <div style="background: #F7F7F7; border: 1px solid #E5E5E5; padding: 16px 20px; margin-bottom: 24px;">
        <p style="font-size: 12px; font-weight: 600; color: #111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">What happens next</p>
        <ol style="margin: 0; padding-left: 18px; font-size: 13px; color: #555; line-height: 2;">
          <li>We review your configuration</li>
          <li>We send you a detailed proforma invoice</li>
          <li>Balance payment via net banking</li>
          <li>Production begins immediately after confirmation</li>
          <li>Delivery within 35 days</li>
        </ol>
      </div>

      <div style="border: 1px solid #E5E5E5; padding: 16px 20px; margin-bottom: 24px;">
        <p style="font-size: 12px; font-weight: 600; color: #111; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">Reservation fee paid</p>
        <p style="font-size: 20px; font-weight: 700; color: #111; margin: 0;">&#8377;499</p>
        <p style="font-size: 11px; color: #aaa; margin: 4px 0 0 0;">This will be adjusted against your final invoice.</p>
      </div>

      <p style="font-size: 13px; color: #888; line-height: 1.7;">
        Questions? Reply to this email and we&apos;ll get back to you within a few hours.
      </p>
      <div style="border-top: 1px solid #E5E5E5; margin-top: 32px; padding-top: 20px; font-size: 11px; color: #aaa;">
        <p style="margin: 0;">Moist Foundry — Powered by Moist Corp</p>
        <p style="margin: 4px 0 0 0;">Greater Noida, Uttar Pradesh, India</p>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'Moist Foundry <moistfoundry@moistcorp.com>',
      to: email,
      subject: type === 'configure'
        ? 'Slot confirmed — your configuration summary'
        : 'We received your enquiry — Moist Foundry',
      html: type === 'configure' ? configureEmailHtml : contactEmailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}