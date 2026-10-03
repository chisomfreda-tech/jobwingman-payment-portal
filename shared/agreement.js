// shared/agreement.js
// The Client Service Agreement — ONE copy, read by the checkout page
// (src/App.jsx), the confirmation email (api/send-confirmation.js) and the
// order record (api/create-order.js, which stores the version and this text).
// It used to be pasted into the page and the email separately.
//
// Changing any wording changes what clients agree to: bump AGREEMENT_VERSION.
// Checkout is the ONE place a client accepts the legal documents (this
// agreement, the Terms of Use and the Privacy Policy). The intake form only
// asks for the job-search permissions; it does not ask again.

export const AGREEMENT_VERSION = '2026-10-02b'  // b: campaigns counted in applications, refunds and credit, pausing, late payments

export const TERMS_OF_USE_URL = 'https://dashboard.thejobwingman.com/terms'
export const PRIVACY_POLICY_URL = 'https://dashboard.thejobwingman.com/privacy'
export const LEMFI_GUIDE_URL = 'https://dashboard.thejobwingman.com/pay-with-lemfi'

// Owner's decisions, 2026-10-02:
//  - A campaign is measured in applications, not days (data: 1 of 15 campaigns
//    in 2026 reached 400 within 30 days; those that reached it took ~2 months).
//  - Unused services are refundable; a campaign cancelled part-way becomes
//    credit, valid 12 months. Bundle parts are valued at their own price less
//    the bundle discount.
//  - 7-day grace period on installments, then applications pause.
//  - Pause up to 3 months; payments continue during a pause.
export const AGREEMENT_SECTIONS = [
  ['1. Services.', 'Job Wingman ("JW") agrees to provide the job search services selected above. Services include resume writing, job applications, and any add-ons selected.'],
  ['2. Application Campaigns.', 'Each application campaign is 400 applications submitted on your behalf to positions matching your criteria (600 for a Volume 600 campaign). A campaign is complete when its applications have been submitted. Most 400-application campaigns finish in about 2 months, but we do not promise a number of days. We cannot guarantee interviews or job offers, as hiring decisions are made by employers.'],
  ['3. What You Do.', 'You agree to provide accurate information about your background, respond to our communications within 48 hours, and notify us of any interviews or offers received.'],
  ['4. Payment.', 'A deposit is required before services begin. For payment plans, remaining installments are due on Mondays, beginning one week after applications go live. We accept payment by transfer to our bank account (Job Wingman LTD, Zenith Bank), sent through LemFi.'],
  ['5. Late Payments.', 'If an installment has not been received 7 days after its due date, applications pause until it is paid. They resume on the Monday after payment, provided payment is received by the Thursday before at 11:59 PM Eastern Time.'],
  ['6. Pausing.', 'You may pause your applications at any time, for up to 3 months in total. Scheduled payments continue while paused. If a pause goes beyond 3 months, the unused part of your services becomes credit under section 7.'],
  ['7. Refunds and Credit.', 'Services you have paid for that we have not started are refundable. Resume services cannot be refunded once work on them has begun. If you cancel during an application campaign, the unused part becomes credit, worked out as the share of the campaign\'s applications not yet submitted. For services bought as a bundle, each service is valued at its individual price, reduced by the same percentage as the bundle discount. Credit can be used toward any Job Wingman service within 12 months and cannot be exchanged for cash. [TO CONFIRM: whether installments not yet due remain payable after you cancel.]'],
  ['8. Timeline.', 'Resume drafts are delivered within 3 weeks of you completing your experience checklist. Applications begin on a Monday. To start on a given Monday, your approved resume, completed intake form, and deposit must all be received by the Thursday before at 11:59 PM Eastern Time; otherwise applications begin the following Monday.'],
  ['9. Your Materials.', 'Once your services are paid in full, the resume and other materials we create for you are yours to use.'],
  ['10. Communication.', 'We provide weekly updates on application activity. You can reach us via email or text for questions.'],
  ['11. Results Disclaimer.', 'While we work hard to maximize your interview opportunities, job search outcomes depend on many factors outside our control including market conditions, your qualifications, and employer decisions.'],
]

// The single acceptance at checkout, as the client reads it.
export const ACCEPTANCE_TEXT =
  'I have read and agree to the Client Service Agreement and the Terms of Use, and I acknowledge the Privacy Policy. I understand that Job Wingman will apply to jobs on my behalf and that results are not guaranteed.'
