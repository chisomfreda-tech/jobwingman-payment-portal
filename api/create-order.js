// api/create-order.js
// Server-side endpoint to create a client order in Supabase.
// Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS — safe because this runs on Vercel, never in the browser.

import { createClient } from '@supabase/supabase-js';
import { AGREEMENT_VERSION, AGREEMENT_SECTIONS, ACCEPTANCE_TEXT } from '../shared/agreement.js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dpgisnslhirfljwerrci.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Build a payment_schedule jsonb array matching the format the dashboard expects.
// Pay later: nothing is due at checkout, so no dates are set here. The dates are
// set when online payment opens and the client is notified (deposit due 5
// business days after that notice); until then each item is 'awaiting_notice'.
function buildSchedule({ paymentType, deposit, installments, installmentAmount, lastInstallmentAmount, total }) {
  const schedule = [];

  schedule.push({
    label: paymentType === 'full' ? 'Payment in full' : 'Deposit',
    amount: paymentType === 'full' ? total : deposit,
    due_date: null,
    status: 'awaiting_notice',
  });

  if (paymentType !== 'full' && installments > 0) {
    for (let i = 1; i <= installments; i++) {
      schedule.push({
        label: `Installment ${i} of ${installments}`,
        // The last installment can be a dollar or two more, so the plan adds up to the total.
        amount: i === installments && lastInstallmentAmount ? lastInstallmentAmount : installmentAmount,
        due_date: null,
        status: 'awaiting_notice',
      });
    }
  }

  return schedule;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!serviceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY env var is not set');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const {
    clientId,
    firstName,
    lastName,
    email,
    accessCode,
    items,
    total,
    paymentType,       // 'full' or 'installment'
    deposit,
    installments,
    installmentAmount,
    lastInstallmentAmount,
  } = req.body || {};

  // Validate
  if (!clientId || !firstName || !email || !items || !Array.isArray(items) || !total) {
    return res.status(400).json({ error: 'Missing required fields', got: Object.keys(req.body || {}) });
  }

  // Server-side Supabase client with service role — bypasses RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Build schedule
    const schedule = buildSchedule({
      paymentType,
      deposit: Number(deposit) || 0,
      installments: Number(installments) || 0,
      installmentAmount: Number(installmentAmount) || 0,
      lastInstallmentAmount: Number(lastInstallmentAmount) || 0,
      total: Number(total),
    });

    // Package description from item names
    const packageType = items.map(i => i.name).join(', ') || 'Custom';

    // 1. Insert the order
    const orderData = {
      client_id: clientId,
      first_name: firstName,
      last_name: lastName || null,
      email,
      items,                                         // jsonb, not stringified
      total_amount: Number(total),
      original_amount: Number(total),
      discount_amount: 0,
      payment_type: paymentType === 'full' ? 'full' : 'installment',
      deposit_amount: paymentType === 'full' ? Number(total) : Number(deposit) || 0,
      num_installments: paymentType === 'full' ? 0 : Number(installments) || 0,
      installment_amount: paymentType === 'full' ? null : Number(installmentAmount) || 0,
      status: 'pending',
      source: 'services_site',                       // NEW — flags this row for dashboard review
      package_type: packageType,
      payment_schedule: schedule,                    // NEW — jsonb array of installments
      notes: accessCode ? `Access code: ${accessCode.toUpperCase()}` : null,
      // The one acceptance of the Client Service Agreement, Terms of Use and
      // Privacy Policy: which wording, when, from where. The server's own copy
      // of the text is stored, not the browser's, so it can't be altered.
      ...(req.body.agreement?.accepted === true ? {
        agreement_version: AGREEMENT_VERSION,
        agreement_accepted_at: new Date().toISOString(),
        agreement_accepted_ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null,
        agreement_snapshot: { acceptance: ACCEPTANCE_TEXT, sections: AGREEMENT_SECTIONS },
      } : {}),
    };

    const { data: order, error: orderError } = await supabase
      .from('client_orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return res.status(500).json({ error: 'Failed to create order', details: orderError.message });
    }

    // No client_payments rows yet: they are created with real due dates when
    // online payment opens and the client is notified. Creating them now would
    // need dates, and the portal and money check would show them as late.

    return res.status(200).json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
