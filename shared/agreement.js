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

export const AGREEMENT_VERSION = '2026-10-02'

export const TERMS_OF_USE_URL = 'https://dashboard.thejobwingman.com/terms'
export const PRIVACY_POLICY_URL = 'https://dashboard.thejobwingman.com/privacy'
export const LEMFI_GUIDE_URL = 'https://dashboard.thejobwingman.com/pay-with-lemfi'

export const AGREEMENT_SECTIONS = [
  ['1. Services.', 'Job Wingman ("JW") agrees to provide the job search services selected above for the duration specified. Services include resume writing, job applications, and any add-ons selected.'],
  ['2. What We Do.', 'We submit applications on your behalf to positions matching your criteria. We target a minimum of 400 applications in each 30-day period of service. We cannot guarantee interviews or job offers, as hiring decisions are made by employers.'],
  ['3. What You Do.', 'You agree to provide accurate information about your background, respond to our communications within 48 hours, and notify us of any interviews or offers received.'],
  ['4. Payment.', 'A deposit is required before services begin. For payment plans, remaining installments are due on Mondays, beginning one week after applications go live. We accept payment by transfer to our bank account (Job Wingman LTD, Zenith Bank), sent through LemFi.'],
  ['5. Refunds.', 'Resume services are non-refundable once work begins. Application services may be paused but are non-refundable. If you land a job, unused months can be credited toward future services.'],
  ['6. Timeline.', 'Resume drafts delivered within 3 weeks. Applications begin on a Monday. To start on a given Monday, your approved resume, completed intake form, and deposit must all be received by the Thursday before at 11:59 PM Eastern Time; otherwise applications begin the following Monday.'],
  ['7. Communication.', 'We provide weekly updates on application activity. You can reach us via email or text for questions.'],
  ['8. Results Disclaimer.', 'While we work hard to maximize your interview opportunities, job search outcomes depend on many factors outside our control including market conditions, your qualifications, and employer decisions.'],
]

// The single acceptance at checkout, as the client reads it.
export const ACCEPTANCE_TEXT =
  'I have read and agree to the Client Service Agreement and the Terms of Use, and I acknowledge the Privacy Policy. I understand that Job Wingman will apply to jobs on my behalf and that results are not guaranteed.'
