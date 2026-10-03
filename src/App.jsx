import React, { useState, useEffect } from 'react';
import { AGREEMENT_VERSION, AGREEMENT_SECTIONS, ACCEPTANCE_TEXT, TERMS_OF_USE_URL, PRIVACY_POLICY_URL, LEMFI_GUIDE_URL } from '../shared/agreement.js'
import { createClient } from '@supabase/supabase-js';

// Supabase client.
//
// The hardcoded fallbacks stay for now, deliberately. This repository is public, so the key
// is published on GitHub rather than merely shipped in a browser bundle — but an anon key is
// designed to be public; it is in every Supabase web app including Sift. It was only
// dangerous in combination with a broken policy on `clients` (see handleLogin below), and
// that is what is being fixed here. With the policy gone this key reads public job adverts
// and nothing else.
//
// Removing the fallbacks is still worth doing, but only AFTER confirming
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel — otherwise this becomes a
// live payment page that cannot reach its database, which is a worse outcome than tidy code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dpgisnslhirfljwerrci.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZ2lzbnNsaGlyZmxqd2VycmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MzE3MjYsImV4cCI6MjA4MzIwNzcyNn0.B0J6G-PIc3LvIrFR6jKeuyGyX6cizF5ECRyLJi4-kNI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback passwords (in case Supabase is down)
const FALLBACK_PASSWORDS = {
  'demo2025': true,
};

// Navigation component
const TopNav = ({ currentPage, setCurrentPage, showNav }) => {
  if (!showNav) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-cream border-b-4 border-teal-900 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-500 border-3 border-teal-900 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]">
            <span className="text-white font-black text-sm">JW</span>
          </div>
          <span className="font-black text-teal-900 text-lg hidden sm:block">Job Wingman</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage('results')}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-3 transition-all ${
              currentPage === 'results'
                ? 'bg-teal-500 border-teal-800 text-white shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]'
                : 'bg-white border-teal-300 text-teal-700 hover:border-teal-500'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setCurrentPage('pricing')}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-3 transition-all ${
              currentPage === 'pricing'
                ? 'bg-teal-500 border-teal-800 text-white shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]'
                : 'bg-white border-teal-300 text-teal-700 hover:border-teal-500'
            }`}
          >
            Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

// Wingman mascot component
const Wingman = ({ message }) => {
  return (
    <div className="relative bg-cream border-3 border-teal-800 rounded-2xl p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]">
      <div className="absolute -top-4 -left-2 w-10 h-10 bg-teal-500 border-3 border-teal-800 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]">
        <span className="text-white font-black text-xs">JW</span>
      </div>
      <p className="text-teal-900 leading-relaxed ml-6">{message}</p>
    </div>
  );
};

// Sticker/badge component
const Sticker = ({ children, color = 'teal', rotate = 0 }) => {
  const colors = {
    teal: 'bg-teal-500 text-white border-teal-800',
    coral: 'bg-coral text-white border-teal-800',
    yellow: 'bg-yellow-300 text-teal-900 border-teal-800',
    cream: 'bg-cream text-teal-900 border-teal-800'
  };
  
  return (
    <span 
      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 rounded-full ${colors[color]}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
};

// Stat card for results page
const StatCard = ({ number, label, sublabel }) => (
  <div className="bg-white border-3 border-teal-800 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] text-center">
    <div className="text-4xl font-black text-teal-900 mb-1">{number}</div>
    <div className="text-teal-700 font-bold">{label}</div>
    {sublabel && <div className="text-teal-500 text-sm mt-1">{sublabel}</div>}
  </div>
);

// Case study card - clear before/after
const CaseStudyCard = ({ title, before, after, details, expanded, onToggle }) => (
  <div className="bg-white border-3 border-teal-200 rounded-2xl overflow-hidden hover:border-teal-400 transition-all">
    <div className="p-5">
      <h3 className="font-black text-teal-900 text-lg mb-4">{title}</h3>
      
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-16 text-right">
            <span className="text-xs font-bold text-teal-400 uppercase">Before</span>
          </div>
          <p className="text-teal-600 text-sm">{before}</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-16 text-right">
            <span className="text-xs font-bold text-coral uppercase">After</span>
          </div>
          <p className="text-teal-800 text-sm font-medium">{after}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-teal-50 px-5 py-3 flex flex-wrap gap-2">
      {details.map((detail, idx) => (
        <span key={idx} className="text-xs bg-white text-teal-700 px-3 py-1 rounded-full font-medium border border-teal-200">
          {detail}
        </span>
      ))}
    </div>
  </div>
);

// Progress steps component
const ProgressSteps = ({ currentStep }) => {
  const steps = ['Resume', 'Applications', 'Extras', 'Review'];
  return (
    <div className="flex justify-between items-center mb-8 bg-cream border-3 border-teal-800 rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full border-3 border-teal-800 flex items-center justify-center font-bold text-sm
            transition-all duration-300
            ${idx < currentStep ? 'bg-teal-500 text-white' : ''}
            ${idx === currentStep ? 'bg-yellow-300 text-teal-900 scale-110' : ''}
            ${idx > currentStep ? 'bg-white text-teal-400' : ''}
          `}>
            {idx < currentStep ? '✓' : idx + 1}
          </div>
          <span className={`hidden md:block ml-2 font-medium ${idx === currentStep ? 'text-teal-900' : 'text-teal-400'}`}>
            {step}
          </span>
          {idx < steps.length - 1 && (
            <div className={`hidden md:block w-8 lg:w-16 h-1 mx-2 rounded ${idx < currentStep ? 'bg-teal-500' : 'bg-teal-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

// Selection card
const SelectionCard = ({ title, price, subtitle, benefits, selected, onSelect, tag, recommended }) => (
  <div 
    onClick={onSelect}
    className={`
      relative p-5 rounded-2xl border-3 cursor-pointer transition-all
      ${selected 
        ? 'bg-teal-50 border-teal-800 shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] translate-x-[-2px] translate-y-[-2px]' 
        : 'bg-white border-teal-300 shadow-[4px_4px_0px_0px_rgba(204,251,241,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,0.3)] hover:border-teal-500'
      }
    `}
  >
    {recommended && (
      <div className="absolute -top-3 left-4">
        <Sticker color="coral" rotate={-2}>Most Popular</Sticker>
      </div>
    )}
    {tag && (
      <div className="absolute -top-3 right-4">
        <Sticker color="yellow" rotate={2}>{tag}</Sticker>
      </div>
    )}
    
    <div className="flex justify-between items-start mb-2 mt-2">
      <h3 className="font-bold text-teal-900 text-lg pr-4">{title}</h3>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-2xl font-black text-teal-900">${price}</span>
        <div className={`
          w-6 h-6 rounded-full border-3 flex items-center justify-center transition-all
          ${selected ? 'border-teal-800 bg-teal-500' : 'border-teal-300 bg-white'}
        `}>
          {selected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
    
    <p className="text-teal-600 text-sm mb-4">{subtitle}</p>
    
    {benefits && (
      <div className="space-y-2">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-teal-700">
            <span className="text-coral font-bold mt-0.5">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Add-on card component
const AddOnCard = ({ title, subtitle, options, selected, onSelect, selectedOption, onOptionSelect }) => (
  <div className={`
    p-5 rounded-2xl border-3 transition-all
    ${selected 
      ? 'bg-teal-50 border-teal-800 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]' 
      : 'bg-white border-teal-200'
    }
  `}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1 pr-4">
        <h3 className="font-bold text-teal-900">{title}</h3>
        <p className="text-teal-600 text-sm mt-1">{subtitle}</p>
      </div>
      <button
        onClick={onSelect}
        className={`
          px-4 py-2 rounded-xl text-sm font-bold border-3 transition-all flex-shrink-0
          ${selected 
            ? 'bg-coral border-teal-800 text-white shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]' 
            : 'bg-cream border-teal-300 text-teal-700 hover:border-teal-500'
          }
        `}
      >
        {selected ? 'Added ✓' : '+ Add'}
      </button>
    </div>
    
    {selected && options && (
      <div className="mt-4 pt-4 border-t-2 border-teal-200">
        <p className="text-sm text-teal-600 mb-3">Pick your volume:</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onOptionSelect(idx)}
              className={`
                px-4 py-2 rounded-xl text-sm font-bold border-3 transition-all
                ${selectedOption === idx
                  ? 'bg-yellow-300 border-teal-800 text-teal-900 shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]'
                  : 'bg-white border-teal-200 text-teal-600 hover:border-teal-400'
                }
              `}
            >
              {opt.volume} for ${opt.price}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Month selector button
const MonthButton = ({ months, selected, onClick, popular }) => (
  <button
    onClick={onClick}
    className={`
      relative p-4 rounded-xl border-3 transition-all text-left
      ${selected 
        ? 'bg-teal-500 border-teal-800 text-white shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]' 
        : 'bg-white border-teal-200 text-teal-900 hover:border-teal-400'
      }
    `}
  >
    {popular && (
      <div className="absolute -top-2 -right-2">
        <span className="bg-coral text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-teal-800">⭐</span>
      </div>
    )}
    <div className="text-2xl font-black">{months} mo</div>
    <div className={selected ? 'text-teal-100' : 'text-teal-500'}>${months * 199}</div>
  </button>
);

export default function JobWingmanPortal() {
  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [clientId, setClientId] = useState(null); // Supabase client ID
  const [accessCode, setAccessCode] = useState(''); // Client's access code
  
  // Name collection state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameCollected, setNameCollected] = useState(false);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('results');
  
  // Pricing flow state
  const [currentStep, setCurrentStep] = useState(-1);
  const [flowType, setFlowType] = useState(null); // 'bundle' or 'custom'
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [resumeChoice, setResumeChoice] = useState(null);
  const [appMonths, setAppMonths] = useState(null);
  const [extraTitles, setExtraTitles] = useState(0);
  const [paymentChoice, setPaymentChoice] = useState('full');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  
  // Agreement flow state
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Results page state
  const [showAllStories, setShowAllStories] = useState(false);
  
  // Add-ons state
  const [addOns, setAddOns] = useState({
    tailored: { selected: false, option: 0 },
    recruiterOutreach: { selected: false },
    informational: { selected: false, option: 0 },
    interview: { selected: false },
    portfolio: { selected: false },
    coverLetters: { selected: false, option: 0 },
    networkWingman: { selected: false }
  });

  // Scroll to top when page or step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, currentStep, authenticated, nameCollected, orderConfirmed, showAgreement]);

  const handleLogin = async () => {
    const code = password.toLowerCase().trim();
    setIsLoggingIn(true);
    setError('');
    
    try {
      // Look the code up through a function, not by selecting from `clients`.
      //
      // The policy that used to allow this read was:
      //     USING ((auth.role() = 'anon') AND (access_code IS NOT NULL))
      // which checks that a row HAS a code, not that the caller supplied the right one — a
      // row-level policy cannot see the filter in the request. Every one of the 39 client
      // records was therefore readable by anyone with the public key, including dates of
      // birth, home addresses, phone numbers, race/ethnicity and disability status.
      //
      // client_by_access_code takes the code as an ARGUMENT, so it can actually compare it,
      // and returns only the fields this page needs.
      const { data: rows, error: dbError } = await supabase
        .rpc('client_by_access_code', { p_code: code });
      const data = Array.isArray(rows) ? rows[0] : rows;
      
      if (data) {
        // Found client in database
        setClientId(data.id);
        setAccessCode(code); // Save access code for email
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        if (data.email) setClientEmail(data.email);
        setAuthenticated(true);
        setNameCollected(!!data.first_name); // Skip name step if we have it
      } else if (FALLBACK_PASSWORDS[code]) {
        // Fallback for demo/testing
        setAccessCode(code);
        setAuthenticated(true);
      } else {
        setError('That code doesn\'t look right. Check your email for your access link!');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Try fallback
      if (FALLBACK_PASSWORDS[code]) {
        setAuthenticated(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNameSubmit = () => {
    if (firstName.trim()) {
      setNameCollected(true);
    }
  };

  const toggleAddOn = (key) => {
    setAddOns(prev => ({
      ...prev,
      [key]: { ...prev[key], selected: !prev[key].selected }
    }));
  };

  const setAddOnOption = (key, option) => {
    setAddOns(prev => ({
      ...prev,
      [key]: { ...prev[key], option }
    }));
  };

  // Handle order completion - create order in Supabase and send email
  const handleOrderComplete = async (items, total, paymentPlan) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Only save to Supabase if we have a real client ID (not demo mode)
      if (clientId) {
        // 1. Create order + payment schedule via server endpoint (bypasses RLS).
        //    Direct browser inserts fail silently because RLS on client_orders/client_payments
        //    restricts to authenticated admins — the portal uses anon.
        try {
          const orderRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientId,
              firstName,
              lastName: lastName || null,
              email: clientEmail,
              accessCode,
              items,
              total,
              paymentType: paymentChoice,
              deposit: paymentPlan.deposit,
              installments: paymentPlan.installments,
              installmentAmount: paymentPlan.perInstallment,
              // The one acceptance of the legal documents; the server adds the
              // time and IP and stores the agreement text with the order.
              agreement: { version: AGREEMENT_VERSION, accepted: agreed === true, text: ACCEPTANCE_TEXT },
            }),
          });

          const orderResult = await orderRes.json();
          if (!orderRes.ok) {
            console.error('Order creation failed:', orderResult);
            // Don't block the user — we'll still send the email and show success.
            // The order can be re-entered manually from the dashboard if needed.
          } else if (orderResult.warning) {
            console.warn('Order created with warning:', orderResult.warning);
          }
        } catch (dbErr) {
          console.error('Order endpoint error:', dbErr);
          // Same as above — continue so the customer isn't blocked.
        }

        // 2. Send confirmation email (unchanged)
        try {
          await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName: firstName,
              clientEmail: clientEmail,
              accessCode: accessCode,
              items: items,
              total: total,
              paymentType: paymentChoice,
              deposit: paymentPlan.deposit,
              installments: paymentPlan.installments,
              installmentAmount: paymentPlan.perInstallment,
            }),
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
          // Don't block on email failure
        }
      }
      
      // 3. Show success screen (always - even for demo mode)
      setOrderConfirmed(true);
      
    } catch (err) {
      console.error('Order completion error:', err);
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pricing data
  const resumeOptions = [
    {
      id: 'none',
      title: 'My resume is ready to go',
      price: 0,
      subtitle: 'You\'re already getting interviews, or you just had it professionally done.',
      benefits: ['We start applying right away', 'No changes to your current resume']
    },
    {
      id: 'audit',
      title: 'Resume Audit',
      price: 49,
      subtitle: 'DIY with expert guidance. We review and tell you exactly what to fix.',
      benefits: [
        'Detailed feedback report within 48 hours',
        'ATS compatibility check',
        'AI detection cleanup recommendations',
        'You make the edits yourself'
      ],
      tag: 'DIY'
    },
    {
      id: 'refine',
      title: 'Resume Tune-Up',
      price: 149,
      subtitle: 'Your resume exists but isn\'t landing. We fix what\'s broken.',
      benefits: [
        'ATS formatting fixes',
        'AI phrase cleanup (remove ChatGPT-speak)',
        'Rewrite weak bullets with real impact',
        'Done in 3-5 business days'
      ]
    },
    {
      id: 'rewrite-self',
      title: 'Full Resume Rewrite',
      price: 399,
      subtitle: 'Start from scratch. We dig into your experience and build something new.',
      benefits: [
        'Fill out our experience questionnaire',
        'We extract achievements you forgot about',
        'Brand new resume built from scratch',
        '3-5 rounds of revisions until you love it'
      ],
      recommended: true
    },
    {
      id: 'rewrite-call',
      title: 'Full Rewrite + Strategy Call',
      price: 549,
      subtitle: 'Same rebuild, but we do it together on a call. Best for people who hate writing about themselves.',
      benefits: [
        '45-minute call to talk through your experience',
        'We ask the questions, you just talk',
        'Great for career changers or complex backgrounds',
        'Includes job targeting advice'
      ],
      tag: '1-on-1'
    }
  ];

  const addOnOptions = {
    tailored: [
      { volume: '10 apps', price: 75 },
      { volume: '20 apps', price: 125 },
      { volume: '40 apps', price: 199 }
    ],
    informational: [
      { volume: '10 intros', price: 99 },
      { volume: '20 intros', price: 149 },
      { volume: '40 intros', price: 249 }
    ],
    coverLetters: [
      { volume: '5 letters', price: 49 },
      { volume: '10 letters', price: 89 },
      { volume: '20 letters', price: 149 }
    ]
  };

  // Pre-built bundles (persona-based)
  const bundles = [
    {
      id: 'autopilot',
      name: 'Autopilot',
      price: 199,
      description: '"My resume is solid and I\'m already getting some interviews. I just need more volume."',
      includes: [
        '400+ applications in 30 days',
        '1 job title'
      ],
      best: 'Resume ready, just need the legwork handled'
    },
    {
      id: 'comeback',
      name: 'Comeback',
      price: 379,
      description: '"I\'ve been applying for months with no results. Something isn\'t working."',
      includes: [
        'Resume tune-up (ATS check, AI cleanup, stronger bullets)',
        '400+ applications in 30 days',
        '1 job title'
      ],
      best: 'Stuck in a rut, need a reset'
    },
    {
      id: 'fresh-start',
      name: 'Fresh Start',
      price: 649,
      savings: 98,
      description: '"I just got laid off. I need to rebuild and move fast."',
      includes: [
        'Full resume rewrite (we interview you, rebuild from scratch)',
        '400+ applications in 30 days',
        'Post-apply recruiter outreach',
        '1 job title'
      ],
      best: 'Recently laid off, need momentum',
      popular: true
    },
    {
      id: 'visa-friendly',
      name: 'Visa-Friendly',
      price: 1299,
      savings: 369,
      description: '"I need sponsorship and have limited time. Every application has to count."',
      includes: [
        'Full resume rewrite (we interview you, rebuild from scratch)',
        'Two 30-day campaigns (400+ applications each)',
        '20 tailored applications',
        '20 cover letters',
        'Post-apply recruiter outreach',
        'Network Wingman',
        'Portfolio slides',
        '1 job title'
      ],
      best: 'H1B, OPT, or work authorization with a deadline'
    }
  ];

  // Case studies data - clear before/after
  const caseStudies = [
    {
      title: "1 Day to First Interview",
      before: "Over a year of applying with zero responses. Working part-time and volunteering just to keep her visa status.",
      after: "First interview request within 24 hours. Five total interviews in six weeks.",
      details: ["Sales Ops", "Needs Sponsorship"]
    },
    {
      title: "Laid Off to Hired in 5 Weeks",
      before: "Lost his job right before the holidays. Facing unemployment stress during the worst hiring season.",
      after: "Started Dec 26, first interview in 8 days. Hired by Jan 31 with a $20K raise, fully remote.",
      details: ["IT", "+$20K salary"]
    },
    {
      title: "Broke a Year-Long Dry Spell",
      before: "Laid off for almost a year. Zero interviews despite getting new certifications.",
      after: "First interview in 9 days. Signed an offer for the exact role he couldn't get callbacks for.",
      details: ["IT / Cybersecurity", "9 days"]
    },
    {
      title: "Too Burned Out to Apply",
      before: "Draining job with long hours and brutal commute. No energy left to job search.",
      after: "We handled everything. Two interviews lined up within 6 days.",
      details: ["Project Manager", "6 days"]
    },
    {
      title: "6 Months of Silence to 3 Interviews",
      before: "Six months of active searching, zero interviews. Visa deadline adding pressure.",
      after: "Revamped resume, three interview invites within one week.",
      details: ["HR / Talent Acquisition", "7 days"]
    },
    {
      title: "5 Interviews from Outside the US",
      before: "Job searched in the US for a year with nothing. Visa expired, had to leave the country.",
      after: "5 interview invites and 4 assessments from US companies while living overseas.",
      details: ["Data Analyst", "International", "Needs Sponsorship"]
    },
    {
      title: "Career Pivot Without the Title",
      before: "Wanted to break into project management without ever holding a PM title. Tough Canadian market.",
      after: "Landed 3 interviews for PM roles by positioning transferable skills strategically.",
      details: ["PM Pivot", "Canada", "43 days"]
    }
  ];

  // Calculate total
  const calculateTotal = () => {
    let total = 0;
    let items = [];
    
    // If a bundle is selected, start with bundle pricing
    if (flowType === 'bundle' && selectedBundle) {
      const bundle = bundles.find(b => b.id === selectedBundle);
      if (bundle) {
        total = bundle.price;
        items.push({ name: bundle.name + ' Bundle', price: bundle.price });
      }
    } else {
      // Custom pricing calculation
      if (resumeChoice && resumeChoice !== 'none') {
        const resume = resumeOptions.find(r => r.id === resumeChoice);
        if (resume) {
          total += resume.price;
          items.push({ name: resume.title, price: resume.price });
        }
      }
      
      if (extraTitles > 0) {
        const extraCost = extraTitles * 99;
        total += extraCost;
        items.push({ name: `${extraTitles} extra job title${extraTitles > 1 ? 's' : ''}`, price: extraCost });
      }
      
      if (appMonths) {
        const appCost = appMonths * 199;
        total += appCost;
        items.push({ name: `${appMonths} month${appMonths > 1 ? 's' : ''} of applications`, price: appCost });
      }
    }
    
    // Add-ons apply to both bundles and custom
    if (addOns.tailored.selected) {
      const opt = addOnOptions.tailored[addOns.tailored.option];
      total += opt.price;
      items.push({ name: `Tailored apps (${opt.volume})`, price: opt.price });
    }
    if (addOns.recruiterOutreach.selected) {
      total += 199;
      items.push({ name: 'Post-apply recruiter outreach', price: 199 });
    }
    if (addOns.informational.selected) {
      const opt = addOnOptions.informational[addOns.informational.option];
      total += opt.price;
      items.push({ name: `Referral intros (${opt.volume})`, price: opt.price });
    }
    if (addOns.interview.selected) {
      total += 199;
      items.push({ name: 'Interview prep packets', price: 199 });
    }
    if (addOns.portfolio.selected) {
      total += 199;
      items.push({ name: 'Portfolio slides', price: 199 });
    }
    if (addOns.coverLetters.selected) {
      const opt = addOnOptions.coverLetters[addOns.coverLetters.option];
      total += opt.price;
      items.push({ name: `Cover letters (${opt.volume})`, price: opt.price });
    }
    if (addOns.networkWingman.selected) {
      total += 99;
      items.push({ name: 'Network Wingman', price: 99 });
    }
    
    return { total, items };
  };

  const { total, items } = calculateTotal();

  const getPaymentPlan = (total) => {
    if (total <= 300) {
      return { deposit: total, installments: 0, perInstallment: 0 };
    } else if (total <= 600) {
      const deposit = 150;
      const remaining = total - deposit;
      return { deposit, installments: 2, perInstallment: Math.ceil(remaining / 2) };
    } else if (total <= 1000) {
      const deposit = 200;
      const remaining = total - deposit;
      return { deposit, installments: 3, perInstallment: Math.ceil(remaining / 3) };
    } else {
      const deposit = 250;
      const remaining = total - deposit;
      return { deposit, installments: 4, perInstallment: Math.ceil(remaining / 4) };
    }
  };

  const paymentPlan = getPaymentPlan(total);

  // Custom styles
  const styles = `
    .bg-cream { background-color: #FFF8F0; }
    .bg-coral { background-color: #FF6B6B; }
    .text-coral { color: #FF6B6B; }
    .border-coral { border-color: #FF6B6B; }
    .border-3 { border-width: 3px; }
  `;

  // Show nav only after name collection
  const showNav = authenticated && nameCollected;

  // Password screen
  if (!authenticated) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full" />
            <div className="absolute top-40 right-20 w-16 h-16 border-4 border-white rotate-45" />
            <div className="absolute bottom-20 left-1/4 w-24 h-24 border-4 border-white rounded-full" />
          </div>
          
          <div className="relative bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-teal-500 border-4 border-teal-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] rotate-3 mx-auto">
                <span className="text-3xl font-black text-white">JW</span>
              </div>
              <h1 className="text-3xl font-black text-teal-900 mt-6">Job Wingman</h1>
              <p className="text-teal-600 mt-2">Your job search co-pilot</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-teal-800 mb-2">Access Code</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your code"
                  className="w-full px-5 py-4 bg-white border-3 border-teal-300 rounded-xl focus:border-teal-800 outline-none transition text-lg"
                />
              </div>
              
              {error && (
                <div className="bg-coral/10 border-3 border-coral rounded-xl p-4">
                  <p className="text-coral text-sm font-medium">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className={`w-full border-3 border-teal-900 py-4 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] transition-all ${
                  isLoggingIn 
                    ? 'bg-teal-400 text-white cursor-wait'
                    : 'bg-teal-500 hover:bg-teal-600 text-white hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                }`}
              >
                {isLoggingIn ? 'Checking...' : 'Continue'}
              </button>
            </div>
            
            <p className="text-center text-teal-500 text-sm mt-6">
              No code yet? <a href="#" className="text-coral font-bold hover:underline">Book a free intro call</a>
            </p>
          </div>
        </div>
      </>
    );
  }

  // Name collection screen
  if (!nameCollected) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full" />
            <div className="absolute bottom-20 right-1/4 w-24 h-24 border-4 border-white rounded-full" />
          </div>
          
          <div className="relative bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-300 border-4 border-teal-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] mx-auto">
                <span className="text-3xl">👋</span>
              </div>
              <h1 className="text-2xl font-black text-teal-900 mt-6">Before we start</h1>
              <p className="text-teal-600 mt-2">What should we call you?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-teal-800 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="First name"
                  className="w-full px-5 py-4 bg-white border-3 border-teal-300 rounded-xl focus:border-teal-800 outline-none transition text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-teal-800 mb-2">Last Name <span className="font-normal text-teal-400">(optional)</span></label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Last name"
                  className="w-full px-5 py-4 bg-white border-3 border-teal-300 rounded-xl focus:border-teal-800 outline-none transition text-lg"
                />
              </div>
              
              <button
                onClick={handleNameSubmit}
                disabled={!firstName.trim()}
                className={`w-full border-3 border-teal-900 py-4 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] transition-all ${
                  firstName.trim() 
                    ? 'bg-teal-500 hover:bg-teal-600 text-white hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-teal-200 text-teal-400 cursor-not-allowed'
                }`}
              >
                Let's go
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Results page
  if (currentPage === 'results') {
    const displayedStories = showAllStories ? caseStudies : caseStudies.slice(0, 3);
    
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-12">
          <div className="max-w-3xl mx-auto px-4 py-8">
            
            {/* Hero stat */}
            <div className="text-center mb-10">
              <div className="inline-block bg-yellow-300 border-4 border-teal-900 rounded-2xl px-6 py-2 mb-4 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] rotate-[-1deg]">
                <span className="text-teal-900 font-bold">Average time to first interview</span>
              </div>
              <div className="text-8xl font-black text-white mb-2">6 days</div>
              <p className="text-teal-100 text-lg">for US-based clients</p>
            </div>
            
            {/* Before/After comparison */}
            <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-sm font-bold text-teal-400 uppercase tracking-wide mb-2">Before Job Wingman</div>
                  <div className="text-4xl font-black text-teal-900 mb-1">7 months</div>
                  <div className="text-teal-600">average job search</div>
                  <div className="text-3xl font-black text-teal-900 mt-4 mb-1">&lt; 3</div>
                  <div className="text-teal-600">interviews total</div>
                </div>
                
                <div className="text-center p-4 bg-teal-500 rounded-2xl">
                  <div className="text-sm font-bold text-teal-100 uppercase tracking-wide mb-2">After Job Wingman</div>
                  <div className="text-4xl font-black text-white mb-1">6 days</div>
                  <div className="text-teal-100">to first interview</div>
                  <div className="text-3xl font-black text-white mt-4 mb-1">4+</div>
                  <div className="text-teal-100">interviews per month</div>
                </div>
              </div>
              <p className="text-center text-teal-500 text-xs mt-4">Data from client intake forms</p>
            </div>
            
            {/* Stories */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-6 text-center">Client Stories</h2>
              
              <div className="space-y-4">
                {displayedStories.map((study, idx) => (
                  <CaseStudyCard key={idx} {...study} />
                ))}
              </div>
              
              {!showAllStories && caseStudies.length > 3 && (
                <button
                  onClick={() => setShowAllStories(true)}
                  className="w-full mt-4 py-3 text-teal-100 font-bold hover:text-white transition"
                >
                  Show {caseStudies.length - 3} more stories ↓
                </button>
              )}
            </div>
            
            {/* Companies - simplified */}
            <div className="bg-white/10 rounded-2xl p-6 mb-8 text-center">
              <p className="text-teal-100 mb-2">Our clients have landed interviews at 100+ companies including</p>
              <p className="text-white font-bold">
                DoorDash • Rippling • JPMorgan • Vercel • Flexport • Verkada • Eight Sleep • Ironclad
              </p>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => setCurrentPage('pricing')}
                className="bg-coral hover:bg-red-400 text-white border-3 border-teal-900 px-8 py-4 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                See Pricing →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Pricing page - Welcome (choose bundle or custom)
  if (currentPage === 'pricing' && currentStep === -1) {
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4 pt-20">
          <div className="relative max-w-2xl w-full">
            <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-8 md:p-12">
              
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-teal-900 mb-2">
                  Hey {firstName}!
                </h1>
                <p className="text-xl text-teal-600">How would you like to build your package?</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Bundle option */}
                <button
                  onClick={() => {
                    setFlowType('bundle');
                    setCurrentStep(-0.5);
                  }}
                  className="p-6 bg-white border-3 border-teal-200 rounded-2xl text-left hover:border-teal-500 hover:shadow-[4px_4px_0px_0px_rgba(19,78,74,0.3)] transition-all group"
                >
                  <div className="text-3xl mb-3">📦</div>
                  <h3 className="font-bold text-teal-900 text-lg mb-1">Pick a Bundle</h3>
                  <p className="text-teal-600 text-sm">Pre-built packages at a discount. Quick and easy.</p>
                  <div className="mt-4 text-coral font-bold text-sm group-hover:translate-x-1 transition-transform">
                    See bundles →
                  </div>
                </button>
                
                {/* Custom option */}
                <button
                  onClick={() => {
                    setFlowType('custom');
                    setCurrentStep(0);
                  }}
                  className="p-6 bg-white border-3 border-teal-200 rounded-2xl text-left hover:border-teal-500 hover:shadow-[4px_4px_0px_0px_rgba(19,78,74,0.3)] transition-all group"
                >
                  <div className="text-3xl mb-3">🛠️</div>
                  <h3 className="font-bold text-teal-900 text-lg mb-1">Build Custom</h3>
                  <p className="text-teal-600 text-sm">Pick exactly what you need, skip what you don't.</p>
                  <div className="mt-4 text-coral font-bold text-sm group-hover:translate-x-1 transition-transform">
                    Start building →
                  </div>
                </button>
              </div>
              
              <p className="text-center text-teal-500 text-sm">
                Not sure? Bundles are a great starting point.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Pricing page - Bundle Selection (step -0.5)
  if (currentPage === 'pricing' && currentStep === -0.5) {
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 py-8">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Pick Your Bundle</h1>
              <p className="text-teal-100">Pre-built packages with built-in savings</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle.id)}
                  className={`
                    relative p-6 rounded-2xl border-3 cursor-pointer transition-all
                    ${selectedBundle === bundle.id
                      ? 'bg-teal-50 border-teal-800 shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white border-teal-200 hover:border-teal-400'
                    }
                  `}
                >
                  {bundle.popular && (
                    <div className="absolute -top-3 left-4">
                      <Sticker color="coral" rotate={-2}>Most Popular</Sticker>
                    </div>
                  )}
                  {bundle.savings && (
                    <div className="absolute -top-3 right-4">
                      <Sticker color="yellow" rotate={2}>Save ${bundle.savings}</Sticker>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-teal-900 text-xl">{bundle.name}</h3>
                      <p className="text-teal-600 text-sm mt-1">{bundle.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-teal-900">${bundle.price}</span>
                      <div className={`
                        w-6 h-6 rounded-full border-3 flex items-center justify-center transition-all flex-shrink-0
                        ${selectedBundle === bundle.id ? 'border-teal-800 bg-teal-500' : 'border-teal-300 bg-white'}
                      `}>
                        {selectedBundle === bundle.id && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 rounded-xl p-4 mb-3">
                    <p className="text-xs font-bold text-teal-500 uppercase mb-2">Includes:</p>
                    <ul className="space-y-1">
                      {bundle.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-teal-700">
                          <span className="text-coral">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-xs text-teal-500">
                    <span className="font-bold">Best for:</span> {bundle.best}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Or customize link */}
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setFlowType('custom');
                  setSelectedBundle(null);
                  setCurrentStep(0);
                }}
                className="text-teal-100 hover:text-white transition text-sm"
              >
                Want something different? Build a custom package →
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-cream border-t-4 border-teal-900 p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(-1)}
                className="px-6 py-3 font-bold text-teal-600 hover:text-teal-800 transition"
              >
                ← Back
              </button>
              
              <button
                disabled={!selectedBundle}
                onClick={() => {
                  if (selectedBundle) {
                    setCurrentStep(2); // Go to add-ons so they can add extras to their bundle
                  }
                }}
                className={`px-8 py-4 rounded-xl font-black text-lg border-3 transition-all ${
                  selectedBundle
                    ? 'bg-coral border-teal-900 text-white shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-teal-200 border-teal-300 text-teal-400 cursor-not-allowed'
                }`}
              >
                {selectedBundle 
                  ? `Continue with ${bundles.find(b => b.id === selectedBundle)?.name}`
                  : 'Select a bundle'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // UPDATED: Page wrapper with friendlier bottom bar showing breakdown
  const PageWrapper = ({ children, onBack, onNext, nextLabel, nextDisabled }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);
    
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-40">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {children}
          </div>
          
          {/* UPDATED: Friendlier bottom bar with expandable breakdown */}
          <div className="fixed bottom-0 left-0 right-0 bg-cream border-t-4 border-teal-900">
            {/* Expandable breakdown section */}
            {showBreakdown && items.length > 0 && (
              <div className="border-b-2 border-teal-200 p-4 max-w-3xl mx-auto">
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-teal-700">{item.name}</span>
                      <span className="font-bold text-teal-900">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-4">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="px-6 py-3 font-bold text-teal-600 hover:text-teal-800 transition"
                >
                  ← Back
                </button>
                
                {/* Friendlier total display */}
                <button 
                  onClick={() => items.length > 0 && setShowBreakdown(!showBreakdown)}
                  className="text-center group"
                >
                  {total > 0 ? (
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs text-teal-500 font-medium">
                          {items.length} item{items.length !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-xl font-bold text-teal-900">${total.toLocaleString()}</p>
                      </div>
                      <span className="text-teal-400 group-hover:text-teal-600 transition">
                        {showBreakdown ? '▼' : '▲'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-teal-400 text-sm">Nothing selected yet</p>
                  )}
                </button>
                
                <button
                  onClick={onNext}
                  disabled={nextDisabled}
                  className={`
                    px-8 py-3 rounded-xl font-bold border-3 transition-all
                    ${nextDisabled
                      ? 'bg-teal-100 border-teal-200 text-teal-300 cursor-not-allowed'
                      : 'bg-coral border-teal-900 text-white shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }
                  `}
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Step 0: Resume
  if (currentPage === 'pricing' && currentStep === 0) {
    return (
      <PageWrapper 
        onBack={() => setCurrentStep(-1)} 
        onNext={() => setCurrentStep(1)} 
        nextLabel="Next →"
        nextDisabled={resumeChoice === null}
      >
        <ProgressSteps currentStep={0} />
        
        <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📄</span>
            <h1 className="text-3xl font-black text-teal-900">Your resume</h1>
          </div>
          <p className="text-teal-600 mb-6">This is what employers see first. How's yours looking?</p>
          
          <Wingman 
            message="Be real with yourself here. If you've been applying and not hearing back, the resume might be the problem. If you're already getting interviews, you probably just need a light touch."
          />
          
          <div className="space-y-4">
            {resumeOptions.map((option) => (
              <SelectionCard
                key={option.id}
                title={option.title}
                price={option.price}
                subtitle={option.subtitle}
                benefits={option.benefits}
                selected={resumeChoice === option.id}
                onSelect={() => setResumeChoice(option.id)}
                recommended={option.recommended}
                tag={option.tag}
              />
            ))}
          </div>
          
          {resumeChoice && resumeChoice !== 'none' && (
            <div className="mt-6 bg-teal-50 border-3 border-teal-200 rounded-xl p-5">
              <h3 className="font-bold text-teal-900 mb-2">Applying for different types of roles?</h3>
              <p className="text-teal-600 text-sm mb-4">
                If you're targeting different job titles (like Product Manager AND Project Manager), you'll want a version tailored to each. Same experience, different framing.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-teal-700 font-medium">Extra versions:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExtraTitles(Math.max(0, extraTitles - 1))}
                    className="w-10 h-10 rounded-lg bg-white border-3 border-teal-300 text-teal-600 font-bold hover:border-teal-500"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-black text-teal-900 text-xl">{extraTitles}</span>
                  <button
                    onClick={() => setExtraTitles(extraTitles + 1)}
                    className="w-10 h-10 rounded-lg bg-white border-3 border-teal-300 text-teal-600 font-bold hover:border-teal-500"
                  >
                    +
                  </button>
                </div>
                <Sticker color="yellow">$99 each</Sticker>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  // Step 1: Applications
  if (currentPage === 'pricing' && currentStep === 1) {
    return (
      <PageWrapper 
        onBack={() => setCurrentStep(0)} 
        onNext={() => setCurrentStep(2)} 
        nextLabel="Next →"
        nextDisabled={!appMonths}
      >
        <ProgressSteps currentStep={1} />
        
        <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-3xl font-black text-teal-900">Applications</h1>
          </div>
          <p className="text-teal-600 mb-6">This is the core of what we do. We apply to jobs on your behalf while you focus on interviews and prep.</p>
          
          <Wingman 
            message="We apply to every job that matches your criteria — at least 400 in every 30 days. Most people start seeing interview requests within 2-4 weeks. I usually suggest at least 2 months since job searches take time, but it's up to you."
          />
          
          <div className="bg-white border-3 border-teal-200 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-black text-teal-900 text-xl">Application Service</h3>
                <p className="text-teal-500">400+ applications in 30 days</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-teal-900">$199</span>
                <span className="text-teal-400 font-medium">/month</span>
              </div>
            </div>
            
            <p className="text-teal-700 font-medium mb-3">How many months?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[1, 2, 3, 4].map((months) => (
                <MonthButton
                  key={months}
                  months={months}
                  selected={appMonths === months}
                  onClick={() => setAppMonths(months)}
                  popular={months === 2}
                />
              ))}
            </div>
            
            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
              <h4 className="font-bold text-teal-800 mb-3">What's included:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  '400+ applications in every 30 days',
                  'We apply daily on your behalf',
                  'Every job matching your criteria',
                  'Spreadsheet to track everything',
                  'Weekly progress updates',
                  'Dedicated team member'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-teal-700">
                    <span className="text-coral font-bold">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Step 2: Extras
  if (currentPage === 'pricing' && currentStep === 2) {
    return (
      <PageWrapper 
        onBack={() => setCurrentStep(1)} 
        onNext={() => setCurrentStep(3)} 
        nextLabel="Review →"
      >
        <ProgressSteps currentStep={2} />
        
        <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚡</span>
            <h1 className="text-3xl font-black text-teal-900">Optional extras</h1>
          </div>
          <p className="text-teal-600 mb-6">These are add-ons that can speed things up. Skip whatever doesn't apply to you.</p>
          
          <Wingman 
            message="Honestly, most people do fine with just the resume and applications. These are for folks who want to go harder or have specific companies they're targeting."
          />
          
          <div className="space-y-4">
            <AddOnCard
              title="🎯 Tailored Applications"
              subtitle="Got dream companies? Send us specific job postings and we'll customize your resume for each one."
              options={addOnOptions.tailored}
              selected={addOns.tailored.selected}
              onSelect={() => toggleAddOn('tailored')}
              selectedOption={addOns.tailored.option}
              onOptionSelect={(opt) => setAddOnOption('tailored', opt)}
            />
            
            {/* Post-apply recruiter outreach - COMING SOON */}
            <div className="p-5 rounded-2xl border-3 bg-gray-50 border-gray-200 opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-500">📬 Post-Apply Recruiter Outreach</h3>
                    <span className="bg-yellow-300 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-full border border-teal-800">Coming Soon</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    After every application we submit, we find the recruiter and reach out on your behalf. Warm intros that get you noticed.
                  </p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 rounded-full bg-gray-200 text-gray-400 border-gray-300">$199/mo</span>
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 rounded-xl text-sm font-bold border-3 bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed flex-shrink-0"
                >
                  + Add
                </button>
              </div>
            </div>
            
            {/* Referral Intros - COMING SOON */}
            <div className="p-5 rounded-2xl border-3 bg-gray-50 border-gray-200 opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-500">🤝 Referral Intros</h3>
                    <span className="bg-yellow-300 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-full border border-teal-800">Coming Soon</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    We help you connect with people at target companies who can refer you internally. Referrals are 4x more likely to get hired.
                  </p>
                </div>
                <button
                  disabled
                  className="px-4 py-2 rounded-xl text-sm font-bold border-3 bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed flex-shrink-0"
                >
                  + Add
                </button>
              </div>
            </div>
            
            <div className={`
              p-5 rounded-2xl border-3 transition-all
              ${addOns.interview.selected 
                ? 'bg-teal-50 border-teal-800 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]' 
                : 'bg-white border-teal-200'
              }
            `}>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-teal-900">🎤 Interview Prep Packets</h3>
                  <p className="text-teal-600 text-sm mt-1">
                    When you land an interview, we create a custom prep doc. Company background, likely questions, and how to position your answers. Unlimited packets during your application period.
                  </p>
                  <div className="mt-2">
                    <Sticker color="teal">$199 flat</Sticker>
                  </div>
                </div>
                <button
                  onClick={() => toggleAddOn('interview')}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold border-3 transition-all flex-shrink-0
                    ${addOns.interview.selected 
                      ? 'bg-coral border-teal-800 text-white shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]' 
                      : 'bg-cream border-teal-300 text-teal-700 hover:border-teal-500'
                    }
                  `}
                >
                  {addOns.interview.selected ? 'Added ✓' : '+ Add'}
                </button>
              </div>
            </div>
            
            <div className={`
              p-5 rounded-2xl border-3 transition-all
              ${addOns.portfolio.selected 
                ? 'bg-teal-50 border-teal-800 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]' 
                : 'bg-white border-teal-200'
              }
            `}>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-teal-900">✨ Portfolio Slides</h3>
                  <p className="text-teal-600 text-sm mt-1">
                    A visual presentation showcasing who you are and what you've done. Great to send after interviews or share with your network.
                  </p>
                  <div className="mt-2">
                    <Sticker color="teal">$199 one-time</Sticker>
                  </div>
                </div>
                <button
                  onClick={() => toggleAddOn('portfolio')}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold border-3 transition-all flex-shrink-0
                    ${addOns.portfolio.selected 
                      ? 'bg-coral border-teal-800 text-white shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]' 
                      : 'bg-cream border-teal-300 text-teal-700 hover:border-teal-500'
                    }
                  `}
                >
                  {addOns.portfolio.selected ? 'Added ✓' : '+ Add'}
                </button>
              </div>
            </div>
            
            {/* Cover Letters */}
            <AddOnCard
              title="✉️ Cover Letters"
              subtitle="Custom cover letters tailored to specific jobs. Pairs well with tailored applications."
              options={addOnOptions.coverLetters}
              selected={addOns.coverLetters.selected}
              onSelect={() => toggleAddOn('coverLetters')}
              selectedOption={addOns.coverLetters.option}
              onOptionSelect={(opt) => setAddOnOption('coverLetters', opt)}
            />
            
            {/* Network Wingman */}
            <div className={`
              p-5 rounded-2xl border-3 transition-all
              ${addOns.networkWingman.selected 
                ? 'bg-teal-50 border-teal-800 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]' 
                : 'bg-white border-teal-200'
              }
            `}>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-teal-900">🔗 Network Wingman</h3>
                  <p className="text-teal-600 text-sm mt-1">
                    We analyze your LinkedIn connections and tell you exactly who to reach out to — warm intros, hiring managers, and people who can refer you.
                  </p>
                  <div className="mt-2">
                    <Sticker color="teal">$99 one-time</Sticker>
                  </div>
                </div>
                <button
                  onClick={() => toggleAddOn('networkWingman')}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold border-3 transition-all flex-shrink-0
                    ${addOns.networkWingman.selected 
                      ? 'bg-coral border-teal-800 text-white shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]' 
                      : 'bg-cream border-teal-300 text-teal-700 hover:border-teal-500'
                    }
                  `}
                >
                  {addOns.networkWingman.selected ? 'Added ✓' : '+ Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Step 3: Review
  if (currentPage === 'pricing' && currentStep === 3 && !orderConfirmed && !showAgreement) {
    const selectedBundleData = flowType === 'bundle' && selectedBundle ? bundles.find(b => b.id === selectedBundle) : null;
    
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-32">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <ProgressSteps currentStep={3} />
            
            <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-6 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎯</span>
                <h1 className="text-3xl font-black text-teal-900">Your package</h1>
              </div>
              <p className="text-teal-600 mb-6">Here's everything you selected, {firstName}.</p>
              
              <Wingman 
                message="Take a sec to review. If something looks off, hit back and fix it. When you're ready, we'll get you started."
              />
              
              {/* Summary */}
              <div className="bg-white border-3 border-teal-200 rounded-2xl overflow-hidden mb-6">
                <div className="p-5">
                  {selectedBundleData ? (
                    <>
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-teal-200">
                        <div>
                          <h3 className="font-bold text-teal-900 text-lg">{selectedBundleData.name} Bundle</h3>
                          {selectedBundleData.savings && (
                            <span className="text-xs bg-yellow-300 text-teal-900 px-2 py-1 rounded-full font-bold">
                              Saving ${selectedBundleData.savings}
                            </span>
                          )}
                        </div>
                        <span className="font-black text-teal-900 text-2xl">${selectedBundleData.price}</span>
                      </div>
                      <p className="text-xs font-bold text-teal-500 uppercase mb-2">Includes:</p>
                      <ul className="space-y-2 mb-4">
                        {selectedBundleData.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-teal-700">
                            <span className="text-coral">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      {/* Show add-ons if any selected */}
                      {items.length > 1 && (
                        <>
                          <p className="text-xs font-bold text-teal-500 uppercase mb-2 pt-4 border-t border-teal-200">Add-ons:</p>
                          <div className="space-y-2">
                            {items.slice(1).map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-teal-700">{item.name}</span>
                                <span className="font-bold text-teal-900">+${item.price}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : items.length === 0 ? (
                    <p className="text-teal-500 text-center py-4">Nothing selected yet</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-teal-100 last:border-0">
                          <span className="font-medium text-teal-900">{item.name}</span>
                          <span className="font-black text-teal-900">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {total > 0 && (
                  <div className="bg-teal-500 p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-4xl font-black text-white">${total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment options */}
              {total > 0 && (
                <div className="bg-yellow-100 border-3 border-yellow-400 rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💳</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-teal-900 mb-3">How do you want to pay?</h4>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => setPaymentChoice('full')}
                          className={`w-full text-left rounded-xl p-4 border-3 transition-all ${
                            paymentChoice === 'full'
                              ? 'bg-teal-500 border-teal-800 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]'
                              : 'bg-white border-teal-200 hover:border-teal-400'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className={`font-bold ${paymentChoice === 'full' ? 'text-white' : 'text-teal-900'}`}>Pay in full</p>
                              <p className={`text-sm ${paymentChoice === 'full' ? 'text-teal-100' : 'text-teal-600'}`}>One payment, done</p>
                            </div>
                            <span className={`text-xl font-black ${paymentChoice === 'full' ? 'text-white' : 'text-teal-900'}`}>${total}</span>
                          </div>
                        </button>
                        
                        {paymentPlan.installments > 0 && (
                          <button
                            onClick={() => setPaymentChoice('plan')}
                            className={`w-full text-left rounded-xl p-4 border-3 transition-all ${
                              paymentChoice === 'plan'
                                ? 'bg-teal-500 border-teal-800 shadow-[4px_4px_0px_0px_rgba(19,78,74,1)]'
                                : 'bg-white border-teal-200 hover:border-teal-400'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className={`font-bold ${paymentChoice === 'plan' ? 'text-white' : 'text-teal-900'}`}>Payment plan</p>
                                <p className={`text-sm ${paymentChoice === 'plan' ? 'text-teal-100' : 'text-teal-600'}`}>
                                  ${paymentPlan.deposit} deposit, then {paymentPlan.installments} payments of ${paymentPlan.perInstallment}
                                </p>
                              </div>
                              <Sticker color={paymentChoice === 'plan' ? 'yellow' : 'coral'} rotate={-2}>Split it up</Sticker>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Next steps */}
              <div className="bg-teal-50 border-3 border-teal-200 rounded-2xl p-5">
                <h4 className="font-bold text-teal-900 mb-3">What happens next?</h4>
                <ol className="space-y-2 text-sm text-teal-700">
                  <li className="flex gap-2">
                    <span className="font-bold text-teal-500">1.</span>
                    Click the button below to confirm
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-teal-500">2.</span>
                    We'll send you an invoice and onboarding form
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-teal-500">3.</span>
                    Once payment is in, we'll schedule your kickoff and confirm your Monday start date
                  </li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-cream border-t-4 border-teal-900 p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={() => {
                  if (flowType === 'bundle') {
                    setCurrentStep(-0.5); // Go back to bundle selection
                  } else {
                    setCurrentStep(2); // Go back to add-ons
                  }
                }}
                className="px-6 py-3 font-bold text-teal-600 hover:text-teal-800 transition"
              >
                ← Back
              </button>
              
              <button
                disabled={total === 0}
                onClick={() => total > 0 && setShowAgreement(true)}
                className={`px-8 py-4 rounded-xl font-black text-lg border-3 transition-all ${
                  total > 0
                    ? 'bg-coral border-teal-900 text-white shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-teal-200 border-teal-300 text-teal-400 cursor-not-allowed'
                }`}
              >
                {total > 0 
                  ? paymentChoice === 'full' 
                    ? `Continue - $${total}` 
                    : `Continue - $${paymentPlan.deposit} deposit`
                  : 'Select something first'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Agreement Screen
  if (currentPage === 'pricing' && showAgreement && !orderConfirmed) {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 py-8">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cream border-4 border-teal-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] rotate-3 mx-auto">
                <span className="text-teal-900 font-black text-xl">📝</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-4">Review & Agree</h1>
              <p className="text-teal-100">Almost there, {firstName}! Review your package and terms.</p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-cream border-4 border-teal-900 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] mb-6">
              <h2 className="font-black text-teal-900 text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-300 border-2 border-teal-900 rounded-lg flex items-center justify-center">📋</span>
                Your Package
              </h2>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-teal-100 last:border-0">
                    <div>
                      <p className="font-bold text-teal-900">{item.name}</p>
                    </div>
                    <p className="font-black text-teal-900">${item.price}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-teal-200">
                <p className="text-xl font-black text-teal-900">Total</p>
                <p className="text-2xl font-black text-teal-900">${total}</p>
              </div>
              
              {paymentChoice === 'plan' && (
                <p className="text-sm text-teal-600 mt-2">
                  Payment plan: ${paymentPlan.deposit} deposit, then {paymentPlan.installments} payments of ${paymentPlan.perInstallment}
                </p>
              )}
            </div>

            {/* Service Agreement Card */}
            <div className="bg-cream border-4 border-teal-900 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] mb-6">
              <h2 className="font-black text-teal-900 text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-300 border-2 border-teal-900 rounded-lg flex items-center justify-center">✍️</span>
                Service Agreement
              </h2>

              {/* Collapsed Terms Preview */}
              <div 
                className="bg-white border-3 border-teal-200 rounded-xl p-4 mb-4 cursor-pointer hover:border-teal-400 transition-colors"
                onClick={() => setShowTerms(!showTerms)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold text-teal-900">Client Service Agreement</p>
                  <span className={`text-teal-500 transition-transform ${showTerms ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {showTerms && (
                  <div className="mt-4 pt-4 border-t border-teal-200 text-sm text-teal-700 space-y-3 max-h-64 overflow-y-auto">
                    {AGREEMENT_SECTIONS.map(([title, text]) => (
                      <p key={title}><strong>{title}</strong> {text}</p>
                    ))}
                    <p className="text-xs text-teal-500">Version {AGREEMENT_VERSION}</p>
                  </div>
                )}
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 border-3 rounded-lg transition-all ${
                    agreed 
                      ? 'bg-teal-500 border-teal-900' 
                      : 'bg-white border-teal-300 group-hover:border-teal-500'
                  }`}>
                    {agreed && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-teal-700 text-sm">
                  I have read and agree to the <button type="button" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-teal-600 underline font-bold hover:text-teal-800">Client Service Agreement</button> and the <a href={TERMS_OF_USE_URL} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-teal-600 underline font-bold hover:text-teal-800">Terms of Use</a>, and I acknowledge the <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-teal-600 underline font-bold hover:text-teal-800">Privacy Policy</a>. I understand that Job Wingman will apply to jobs on my behalf and that results are not guaranteed.
                </span>
              </label>
            </div>

            {/* Email & Confirm Card */}
            <div className="bg-cream border-4 border-teal-900 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(19,78,74,1)]">
              <h2 className="font-black text-teal-900 text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-300 border-2 border-teal-900 rounded-lg flex items-center justify-center">✉️</span>
                Your Email
              </h2>

              <p className="text-teal-600 text-sm mb-4">
                We'll send your agreement receipt and next steps here.
              </p>

              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-3 border-teal-200 rounded-xl text-teal-900 placeholder-teal-300 focus:outline-none focus:border-teal-500 transition-colors mb-4 bg-white"
              />

              {submitError && (
                <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3 mb-4 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <button
                onClick={() => handleOrderComplete(items, total, paymentPlan)}
                disabled={!agreed || !clientEmail.includes('@') || isSubmitting}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                  agreed && clientEmail.includes('@') && !isSubmitting
                    ? 'bg-coral border-4 border-teal-900 text-white shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[2px_2px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-1 active:translate-y-1'
                    : 'bg-teal-100 border-4 border-teal-200 text-teal-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm & Continue →'}
              </button>

              <p className="text-xs text-teal-400 text-center mt-3">
                By confirming, you agree to the terms above. Dated: {today}
              </p>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => setShowAgreement(false)}
              className="w-full mt-4 py-3 text-teal-100 font-bold hover:text-white transition-colors"
            >
              ← Back to edit selections
            </button>
          </div>
        </div>
      </>
    );
  }

  // Order Confirmed - Payment Screen
  if (currentPage === 'pricing' && orderConfirmed) {
    const amountDue = paymentChoice === 'full' ? total : paymentPlan.deposit;
    
    return (
      <>
        <style>{styles}</style>
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 py-8">
            
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-yellow-300 border-4 border-teal-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">You're almost there, {firstName}!</h1>
              <p className="text-teal-100">One last step: send your payment to lock in your spot.</p>
            </div>
            
            {/* Payment card */}
            <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-6 md:p-8 mb-6">
              
              {/* Amount due */}
              <div className="bg-teal-500 rounded-2xl p-6 mb-6 text-center">
                <p className="text-teal-100 text-sm uppercase tracking-wide font-bold mb-1">
                  {paymentChoice === 'full' ? 'Total Due' : 'Deposit Due Today'}
                </p>
                <p className="text-5xl font-black text-white">${amountDue}</p>
                {paymentChoice === 'plan' && (
                  <p className="text-teal-100 text-sm mt-2">
                    Then {paymentPlan.installments} payments of ${paymentPlan.perInstallment} after we start
                  </p>
                )}
              </div>
              
              {/* LemFi instructions: the main way to pay (added Oct 2026).
                  Money goes to Job Wingman LTD's Zenith Bank naira account; LemFi
                  converts the client's dollars. LemFi only supports UBA and Access
                  USD (domiciliary) accounts, so a Zenith account receives naira. */}
              <div className="bg-white border-3 border-teal-500 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-lg">L</span>
                  </div>
                  <div>
                    <h3 className="font-black text-teal-900">Pay with LemFi</h3>
                    <p className="text-teal-500 text-sm">No transfer fees · send from your US bank or debit card</p>
                  </div>
                </div>

                <a href={LEMFI_GUIDE_URL} target="_blank" rel="noopener noreferrer"
                  className="block text-center mb-4 px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-300 text-teal-800 font-bold hover:border-teal-500">
                  First time using LemFi? Open the full step-by-step guide →
                </a>
                <ol className="space-y-3 text-sm text-teal-800 mb-4">
                  <li className="flex gap-3"><span className="font-black text-teal-500">1.</span><span>Download <a href="https://lemfi.com/en-us" target="_blank" rel="noopener noreferrer" className="font-bold underline">LemFi</a> from the App Store or Google Play and create an account.</span></li>
                  <li className="flex gap-3"><span className="font-black text-teal-500">2.</span><span>Verify your identity in the app: a US photo ID, a selfie, and your Social Security Number or ITIN. This usually takes a few minutes.</span></li>
                  <li className="flex gap-3"><span className="font-black text-teal-500">3.</span><span>Tap <strong>Send money</strong>, choose <strong>US dollars → Nigerian naira</strong>, then <strong>Bank account</strong>. Pick <strong>Zenith Bank</strong>, enter the account number below, and check the name shows <strong>Job Wingman LTD</strong>.</span></li>
                  <li className="flex gap-3"><span className="font-black text-teal-500">4.</span><span>In <strong>You send</strong>, enter <strong>${amountDue}</strong> in US dollars. LemFi shows what arrives in naira; that's expected.</span></li>
                  <li className="flex gap-3"><span className="font-black text-teal-500">5.</span><span>Choose your US bank account or debit card, check the total (no transfer fee), and approve with your LemFi PIN. Screenshot the confirmation.</span></li>
                  <li className="flex gap-3"><span className="font-black text-teal-500">6.</span><span>Email the confirmation screenshot to <a href="mailto:wingman@thejobwingman.com" className="font-bold underline">wingman@thejobwingman.com</a> with your code below, so we can match it to you.</span></li>
                </ol>

                <div className="bg-teal-50 rounded-xl p-4 mb-4 space-y-2">
                  <p className="text-sm text-teal-600">Recipient:</p>
                  {[
                    ['Bank', 'Zenith Bank'],
                    ['Account name', 'Job Wingman LTD'],
                    ['Account number', '1312115776'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-teal-600">{label}</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(value)}
                        className="font-black text-teal-900 text-right hover:underline"
                        title="Tap to copy"
                      >
                        {value}
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-teal-500 pt-1">Tap any detail to copy it.</p>
                </div>

                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4">
                  <p className="text-sm font-bold text-teal-900 mb-1">Your code (put it in your email to us)</p>
                  <p className="font-mono bg-white px-3 py-2 rounded-lg text-teal-900 border border-yellow-400">
                    {accessCode ? accessCode.toUpperCase() : 'JW Deposit'}
                  </p>
                </div>
              </div>

              {/* Order summary */}
              <div className="border-t-2 border-teal-100 pt-6">
                <h4 className="font-bold text-teal-900 mb-3">Your Package</h4>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-teal-600">{item.name}</span>
                      <span className="font-bold text-teal-900">${item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-teal-100">
                    <span className="font-bold text-teal-900">Total</span>
                    <span className="font-black text-teal-900">${total}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* What happens next */}
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-4">What happens next?</h4>
              <ol className="space-y-3">
                <li className="flex gap-3 text-teal-100">
                  <span className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-teal-900 font-bold text-sm flex-shrink-0">1</span>
                  <span>Send your {paymentChoice === 'full' ? 'payment' : 'deposit'} using the info above</span>
                </li>
                <li className="flex gap-3 text-teal-100">
                  <span className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-teal-900 font-bold text-sm flex-shrink-0">2</span>
                  <span>Fill out the <strong>Intake Form</strong> — link is in your email</span>
                </li>
                <li className="flex gap-3 text-teal-100">
                  <span className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-teal-900 font-bold text-sm flex-shrink-0">3</span>
                  <span>Once payment clears, we'll send you a link to schedule your <strong>Kickoff Call</strong> (15 min)</span>
                </li>
                <li className="flex gap-3 text-teal-100">
                  <span className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-teal-900 font-bold text-sm flex-shrink-0">4</span>
                  <span>Applications start on a Monday once your resume is approved and your deposit is in, as long as both are done by Thursday 11:59 PM Eastern</span>
                </li>
              </ol>
            </div>
            
            {/* Email confirmation */}
            {clientEmail && (
              <div className="bg-white/10 rounded-2xl p-4 mt-4">
                <p className="text-teal-100 text-sm">
                  <span className="font-bold text-white">Agreement & next steps sent to:</span> {clientEmail}
                </p>
              </div>
            )}
            
            {/* Questions */}
            <div className="text-center mt-8">
              <p className="text-teal-100 mb-2">Questions? Text or email me</p>
              <p className="text-white font-bold">freda@thejobwingman.com</p>
            </div>
            
            {/* Back button */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setOrderConfirmed(false);
                  setShowAgreement(false);
                }}
                className="text-teal-200 hover:text-white transition text-sm"
              >
                ← Go back and edit my package
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
