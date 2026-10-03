# Handover

## Current state (3 Oct 2026)

- **Payment:** LemFi to Job Wingman LTD's Zenith Bank naira account; guide at
  dashboard.thejobwingman.com/pay-with-lemfi (the recipient details there must match
  `src/App.jsx` and `api/send-confirmation.js`). Zelle, Venmo and bank wire are gone.
  Paystack (USD to a Zenith USD account) comes next, once Chisom's account is approved;
  she adds the keys to Vercel herself.
- **Agreement:** `shared/agreement.js` is the only copy, used by the page, the email and
  the order record. Bump `AGREEMENT_VERSION` on any wording change. Checkout is the one
  place a client accepts the agreement + Terms of Use + Privacy Policy; `client_orders`
  `agreement_*` columns record version, time, IP and text.
- **Campaigns are counted in applications** (250 for $199 on its own; bundles hold 400),
  not days. Installments fall on Mondays.
- **Expected to change:** the bundles, after Chisom's services and pricing rework.
- To-do list and reasoning: `jw-dashboard/docs/memory/TASKS.md` and `JOURNAL.md`.

---

## Earlier: 14 Sep 2026

Written 14 Sep 2026. Machine setup is in `sift-job-board/HANDOVER.md`.

## What this is

The client payment page. Small, and it sits on the same Supabase project as the dashboard
and Sift (`dpgisnslhirfljwerrci`), which is what made it security-relevant.

## The one change that matters

On 4 Sep 2026 this app was the reason every client record was readable by anyone holding the
public anon key. It looked clients up with:

```js
supabase.from('clients').select(...).eq('access_code', code)
```

which required an RLS policy permissive enough to allow it. That policy read
`USING ((auth.role() = 'anon') AND (access_code IS NOT NULL))` — it tested that a row **has**
a code, not that the caller supplied the right one, which is true of every row. All 39
records were exposed: emails, phones, dates of birth, home addresses, race/ethnicity,
disability status.

A row-level policy cannot do better, because it runs after the request arrives and cannot
see the filter. The code has to be an argument, which means a function:

```js
supabase.rpc('client_by_access_code', { p_code: code })
```

That function returns only what this page needs — name, email, status, dates, target roles
and locations. No date of birth, no address, no phone, no race, no disability status. Those
are not withheld by a rule that could be misread again; they are simply not in the function.

This app was switched over and deployed **first**, verified against the live bundle, and only
then was the policy dropped. So there was no window where the page was broken.

## Still open

`src/App.jsx` carries the Supabase URL and anon key as hardcoded literals, and this repo is
public. That is hygiene rather than exposure — an anon key ships in the browser bundle of
every Supabase app and is meant to be public; it was only dangerous because the policy was
broken, and that is fixed.

Two ways to close it, in order of ease:

1. Make the repo private. One setting, no code change.
2. Remove the literals — **but only after confirming** `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` are set in the Vercel project. They could not be verified from
   outside the dashboard, and removing the fallback without them takes the live payment page
   off its database.
