// api/send-confirmation.js
// Vercel serverless function to send confirmation email via Resend

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    clientName, 
    clientEmail, 
    items, 
    total, 
    paymentType,
    deposit,
    installments,
    installmentAmount 
  } = req.body;

  // Validate required fields
  if (!clientEmail || !clientName || !items || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Build items list HTML
  const itemsHtml = items.map(item => 
    `<tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;">${item.name}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">$${item.price}</td>
    </tr>`
  ).join('');

  // Payment info
  const paymentHtml = paymentType === 'full' 
    ? `<p style="font-size: 16px;"><strong>Amount Due:</strong> $${total}</p>`
    : `<p style="font-size: 16px;"><strong>Deposit Due:</strong> $${deposit}<br>
       <span style="color: #666;">Then ${installments} payments of $${installmentAmount} after we start</span></p>`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #134e4a; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; background: #14b8a6; color: white; font-weight: bold; font-size: 24px; width: 60px; height: 60px; line-height: 60px; border-radius: 12px;">JW</div>
    <h1 style="margin: 15px 0 5px; color: #134e4a;">You're all set!</h1>
    <p style="color: #5eead4; margin: 0;">Agreement confirmed</p>
  </div>

  <div style="background: #f0fdfa; border: 2px solid #14b8a6; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 16px; color: #134e4a; font-size: 18px;">Hi ${clientName},</h2>
    <p style="margin: 0 0 16px;">Thanks for choosing Job Wingman! Here's a summary of your package and next steps.</p>
  </div>

  <div style="background: #fff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px; color: #134e4a;">📋 Your Package</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding: 12px 0 0; font-weight: bold; font-size: 18px;">Total</td>
        <td style="padding: 12px 0 0; font-weight: bold; font-size: 18px; text-align: right;">$${total}</td>
      </tr>
    </table>
  </div>

  <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px; color: #134e4a;">💳 Payment</h3>
    ${paymentHtml}
    <p style="margin: 16px 0 8px;"><strong>Zelle:</strong> (628) 228-1964</p>
    <p style="margin: 0 0 8px;"><strong>Venmo:</strong> @ChisomEgwuatu</p>
    <p style="margin: 16px 0 0; font-size: 14px; color: #666;">Memo: JW - ${clientName}</p>
  </div>

  <div style="background: #fff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px; color: #134e4a;">✅ Next Steps</h3>
    <ol style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 12px;">Send your ${paymentType === 'full' ? 'payment' : 'deposit'} via Zelle or Venmo</li>
      <li style="margin-bottom: 12px;"><a href="https://forms.fillout.com/t/17S72kpyV1us" style="color: #14b8a6; font-weight: bold;">Fill out the Intake Form</a> (~10 min)</li>
      <li style="margin-bottom: 12px;">Once payment clears, we'll send you a link to schedule your <strong>Kickoff Call</strong> (15 min)</li>
      <li style="margin-bottom: 0;">We get started within 48 hours of the kickoff call!</li>
    </ol>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
    <p>Questions? Reply to this email or text (628) 228-1964</p>
    <p style="margin-top: 20px;">— The Job Wingman Team</p>
  </div>

</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Job Wingman <onboarding@resend.dev>',
        to: clientEmail,
        subject: `You're all set, ${clientName}! Here's your Job Wingman agreement`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
