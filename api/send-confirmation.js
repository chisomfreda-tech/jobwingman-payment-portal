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
    accessCode,
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
    ? `<p style="font-size: 18px; font-weight: bold; color: #14b8a6;">Total Due: $${total}</p>`
    : `<p style="font-size: 18px; font-weight: bold; color: #14b8a6;">
        Deposit Due Now: $${deposit}<br>
        <span style="font-size: 14px; font-weight: normal; color: #666;">
          Then ${installments} payments of $${installmentAmount}
        </span>
      </p>`;

  // Memo instruction - use access code if available
  const memoText = accessCode ? accessCode.toUpperCase() : 'JW Deposit';
  // What to send now: the whole total, or the deposit on a payment plan.
  const amountDue = paymentType === 'full' ? total : deposit;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #134e4a;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; background: #14b8a6; color: white; font-weight: bold; padding: 12px 20px; border-radius: 12px; font-size: 18px;">
      JW
    </div>
    <h1 style="margin: 20px 0 10px; color: #134e4a;">You're all set, ${clientName}!</h1>
    <p style="color: #666; margin: 0;">Here's your Job Wingman service agreement</p>
  </div>

  <div style="background: #f0fdfa; border: 2px solid #14b8a6; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 15px; font-size: 16px; color: #134e4a;">Your Package</h2>
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding: 12px 0 0; font-weight: bold;">Total</td>
        <td style="padding: 12px 0 0; text-align: right; font-weight: bold; font-size: 18px;">$${total}</td>
      </tr>
    </table>
  </div>

  <div style="background: #fff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 15px; font-size: 16px; color: #134e4a;">Payment Details</h2>
    ${paymentHtml}
    
    <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-top: 15px;">
      <p style="margin: 0 0 8px; font-weight: bold; color: #92400e;">Pay with LemFi (no transfer fees):</p>
      <p style="margin: 0 0 10px; font-size: 13px; color: #134e4a; line-height: 1.6;">Download LemFi, verify your ID, then Send money &rarr; Nigeria &rarr; Bank account. Send <strong>$${amountDue}</strong> in US dollars to:<br>
        Bank: <strong>Zenith Bank</strong><br>Account name: <strong>Job Wingman LTD</strong><br>Account number: <strong>1312115776</strong><br>
        Then email the confirmation screenshot to wingman@thejobwingman.com with your code below.</p>
      <p style="margin: 12px 0 8px; font-weight: bold; color: #92400e;">Or send via Zelle:</p>
      <p style="margin: 0; font-size: 18px; color: #134e4a;">(628) 228-1964</p>
      <p style="margin: 5px 0 0; font-size: 12px; color: #666;">Will show as "Chisom Egwuatu"</p>
      <p style="margin: 10px 0 0; font-weight: bold; color: #92400e;">Memo: <span style="font-family: monospace; background: #fff; padding: 2px 8px; border-radius: 4px;">${memoText}</span></p>
    </div>
  </div>

  <div style="background: #fff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 15px; font-size: 16px; color: #134e4a;">Next Steps</h2>
    <ol style="margin: 0; padding-left: 20px; color: #666;">
      <li style="margin-bottom: 12px;">Send your ${paymentType === 'full' ? 'payment' : 'deposit'} via LemFi, Zelle or Venmo</li>
      <li style="margin-bottom: 12px;"><a href="https://dashboard.thejobwingman.com/intake" style="color: #14b8a6; font-weight: bold;">Fill out the Intake Form</a> (~10 min)</li>
      <li style="margin-bottom: 12px;">Once payment clears, we'll send you a link to schedule your <strong>Kickoff Call</strong> (15 min)</li>
      <li style="margin-bottom: 0;">Applications start on a Monday once your resume is approved and your deposit is in, as long as both are done by Thursday 11:59 PM Eastern.</li>
    </ol>
  </div>

  <div style="background: #f9fafb; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <span style="font-size: 16px; margin-right: 8px;">📋</span>
      <h2 style="margin: 0; font-size: 14px; color: #134e4a; text-transform: uppercase; letter-spacing: 0.5px;">Service Agreement</h2>
    </div>
    
    <div style="font-size: 12px; color: #666; line-height: 1.6;">
      <p style="margin: 0 0 10px;"><strong>1. Services.</strong> Job Wingman ("JW") agrees to provide the job search services selected above for the duration specified. Services include resume writing, job applications, and any add-ons selected.</p>
      
      <p style="margin: 0 0 10px;"><strong>2. What We Do.</strong> We submit applications on your behalf to positions matching your criteria. We target a minimum of 400 applications in each 30-day period of service. We cannot guarantee interviews or job offers, as hiring decisions are made by employers.</p>
      
      <p style="margin: 0 0 10px;"><strong>3. What You Do.</strong> You agree to provide accurate information about your background, respond to our communications within 48 hours, and notify us of any interviews or offers received.</p>
      
      <p style="margin: 0 0 10px;"><strong>4. Payment.</strong> A deposit is required before services begin. For payment plans, remaining installments are due on Mondays, beginning one week after applications go live. We accept payment by LemFi transfer to our Nigerian bank account (Job Wingman LTD, Zenith Bank), Zelle, and Venmo.</p>
      
      <p style="margin: 0 0 10px;"><strong>5. Refunds.</strong> Resume services are non-refundable once work begins. Application services may be paused but are non-refundable. If you land a job, unused months can be credited toward future services.</p>
      
      <p style="margin: 0 0 10px;"><strong>6. Timeline.</strong> Resume drafts delivered within 3 weeks. Applications begin on a Monday. To start on a given Monday, your approved resume, completed intake form, and deposit must all be received by the Thursday before at 11:59 PM Eastern Time; otherwise applications begin the following Monday.</p>
      
      <p style="margin: 0 0 10px;"><strong>7. Communication.</strong> We provide weekly updates on application activity. You can reach us via email for questions.</p>
      
      <p style="margin: 0 0 15px;"><strong>8. Results Disclaimer.</strong> While we work hard to maximize your interview opportunities, job search outcomes depend on many factors outside our control including market conditions, your qualifications, and employer decisions.</p>
      
      <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 12px; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #666;">
          <strong style="color: #134e4a;">${clientName}</strong> agreed to these terms on <strong style="color: #134e4a;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>
      </div>
    </div>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
    <p>Questions? Just reply to this email.</p>
    <p style="margin-top: 20px;">— The Job Wingman Team</p>
  </div>

</body>
</html>
  `;

  try {
    // Send to client
    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Job Wingman <freda@thejobwingman.com>',
        to: clientEmail,
        reply_to: 'thejobwingman@gmail.com',
        subject: `You're all set, ${clientName}! Here's your Job Wingman agreement`,
        html: emailHtml,
      }),
    });

    const clientData = await clientResponse.json();

    if (!clientResponse.ok) {
      console.error('Resend error (client):', clientData);
      return res.status(500).json({ error: 'Failed to send email', details: clientData });
    }

    // Send copy to Job Wingman
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Job Wingman <freda@thejobwingman.com>',
        to: 'thejobwingman@gmail.com',
        subject: `[Copy] New order from ${clientName} - $${total}`,
        html: `<p><strong>New order received!</strong></p>
               <p>Client: ${clientName} (${clientEmail})</p>
               <p>Access Code: ${accessCode || 'N/A'}</p>
               <hr>
               ${emailHtml}`,
      }),
    });

    return res.status(200).json({ success: true, messageId: clientData.id });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
