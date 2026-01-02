import React, { useState } from 'react';

// CONFIGURE CLIENT PASSWORDS HERE
const CLIENT_PASSWORDS = {
  'demo2025': true,
  'sarah123': true,
  'james456': true,
};

// Navigation component
const TopNav = ({ currentPage, setCurrentPage, showNav }) => {
  if (!showNav) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-cream border-b-4 border-teal-900 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-300 border-3 border-teal-900 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]">
            <span className="text-xl">🦅</span>
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
      <div className="absolute -top-4 -left-2 w-10 h-10 bg-yellow-300 border-3 border-teal-800 rounded-full flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(19,78,74,1)]">
        🦅
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
      <div className="text-right flex-shrink-0">
        <span className="text-2xl font-black text-teal-900">${price}</span>
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
    
    <div className={`
      absolute top-4 right-4 w-6 h-6 rounded-full border-3 flex items-center justify-center transition-all
      ${selected ? 'border-teal-800 bg-teal-500' : 'border-teal-300 bg-white'}
    `}>
      {selected && (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
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
  
  // Name collection state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameCollected, setNameCollected] = useState(false);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('results');
  
  // Pricing flow state
  const [currentStep, setCurrentStep] = useState(-1);
  const [resumeChoice, setResumeChoice] = useState(null);
  const [appMonths, setAppMonths] = useState(null);
  const [extraTitles, setExtraTitles] = useState(0);
  const [paymentChoice, setPaymentChoice] = useState('full');
  
  // Results page state
  const [showAllStories, setShowAllStories] = useState(false);
  
  // Add-ons state
  const [addOns, setAddOns] = useState({
    tailored: { selected: false, option: 0 },
    recruiter: { selected: false, option: 0 },
    informational: { selected: false, option: 0 },
    interview: { selected: false },
    portfolio: { selected: false }
  });

  const handleLogin = () => {
    if (CLIENT_PASSWORDS[password.toLowerCase().trim()]) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('That code doesn\'t look right. Check your email for your access link!');
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

  // Pricing data
  const resumeOptions = [
    {
      id: 'none',
      title: 'My resume is ready to go',
      price: 0,
      subtitle: 'You\'re getting interviews already, or you just had it professionally done.',
      benefits: ['We start applying right away', 'No changes to your current resume']
    },
    {
      id: 'refine',
      title: 'Quick Polish',
      price: 149,
      subtitle: 'Your resume is solid but could hit harder. We clean it up and add punch.',
      benefits: [
        'Fix formatting so it passes applicant tracking systems',
        'Rewrite weak bullets to show real impact',
        'Remove phrases that scream "AI wrote this"',
        'Done in 3-5 business days'
      ]
    },
    {
      id: 'rewrite-self',
      title: 'Full Rebuild',
      price: 399,
      subtitle: 'Start fresh. We dig into your experience and build something that actually represents what you\'ve done.',
      benefits: [
        'Fill out a questionnaire about your work history',
        'We pull out achievements you forgot about',
        'Brand new resume built from scratch',
        '3-5 rounds of revisions until you love it'
      ],
      recommended: true
    },
    {
      id: 'rewrite-call',
      title: 'Full Rebuild + Strategy Call',
      price: 549,
      subtitle: 'Same as above, but we do the digging together on a call. Best for people who hate writing about themselves.',
      benefits: [
        '45-minute call to talk through your experience',
        'We ask the questions, you just talk',
        'Great for complex career paths or job hoppers',
        'Includes positioning advice for your target roles'
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
    recruiter: [
      { volume: '50 intros', price: 149 },
      { volume: '100 intros', price: 249 },
      { volume: '200 intros', price: 399 }
    ],
    informational: [
      { volume: '10 intros', price: 99 },
      { volume: '20 intros', price: 149 },
      { volume: '40 intros', price: 249 }
    ]
  };

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
    
    if (addOns.tailored.selected) {
      const opt = addOnOptions.tailored[addOns.tailored.option];
      total += opt.price;
      items.push({ name: `Tailored apps (${opt.volume})`, price: opt.price });
    }
    if (addOns.recruiter.selected) {
      const opt = addOnOptions.recruiter[addOns.recruiter.option];
      total += opt.price;
      items.push({ name: `Recruiter outreach (${opt.volume})`, price: opt.price });
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

  // Show nav only after name collection
  const showNav = authenticated && nameCollected;

  // Password screen
  if (!authenticated) {
    return (
      <>
        
        <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full" />
            <div className="absolute top-40 right-20 w-16 h-16 border-4 border-white rotate-45" />
            <div className="absolute bottom-20 left-1/4 w-24 h-24 border-4 border-white rounded-full" />
          </div>
          
          <div className="relative bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-yellow-300 border-4 border-teal-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] rotate-3 mx-auto">
                <span className="text-4xl">🦅</span>
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
                className="w-full bg-teal-500 hover:bg-teal-600 text-white border-3 border-teal-900 py-4 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Continue
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

  // Pricing page - Welcome
  if (currentPage === 'pricing' && currentStep === -1) {
    return (
      <>
        
        <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
        
        <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4 pt-20">
          <div className="relative max-w-2xl w-full">
            <div className="bg-cream border-4 border-teal-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(19,78,74,1)] p-8 md:p-12">
              
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-teal-900 mb-2">
                  Hey {firstName}!
                </h1>
                <p className="text-xl text-teal-600">Let's build your package</p>
              </div>
              
              <Wingman 
                message={`This takes about 3 minutes. Pick what you need, skip what you don't. You'll see your total at the bottom as you go.`}
              />
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { num: 1, text: 'Resume situation', icon: '📄' },
                  { num: 2, text: 'Application volume', icon: '🚀' },
                  { num: 3, text: 'Optional add-ons', icon: '⚡' },
                  { num: 4, text: 'Review your package', icon: '🎯' }
                ].map((step) => (
                  <div 
                    key={step.num}
                    className="flex items-center gap-3 bg-white border-3 border-teal-200 rounded-xl p-4"
                  >
                    <div className="w-10 h-10 bg-teal-100 border-2 border-teal-300 rounded-full flex items-center justify-center font-black text-teal-600">
                      {step.num}
                    </div>
                    <span className="font-medium text-teal-800">{step.text}</span>
                    <span className="ml-auto text-xl">{step.icon}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentStep(0)}
                className="w-full bg-coral hover:bg-red-400 text-white border-3 border-teal-900 py-4 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Page wrapper for pricing steps
  const PageWrapper = ({ children, onBack, onNext, nextLabel, nextDisabled }) => (
    <>
      
      <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} showNav={showNav} />
      
      <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 pt-20 pb-32">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-cream border-t-4 border-teal-900 p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 font-bold text-teal-600 hover:text-teal-800 transition"
            >
              ← Back
            </button>
            
            <div className="text-center">
              <p className="text-xs text-teal-500 uppercase tracking-wide font-bold">Your Total</p>
              <p className="text-3xl font-black text-teal-900">{total > 0 ? `$${total.toLocaleString()}` : '$0'}</p>
            </div>
            
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
    </>
  );

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
            message="We submit 400 targeted applications per month. That's 20 per business day. Most people start seeing interview requests within 2-4 weeks. I usually suggest at least 2 months since job searches take time, but it's up to you."
          />
          
          <div className="bg-white border-3 border-teal-200 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-black text-teal-900 text-xl">Application Service</h3>
                <p className="text-teal-500">400 applications per month</p>
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
                  '400 applications per month',
                  'We apply daily on your behalf',
                  'Jobs matched to your criteria',
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
            
            <AddOnCard
              title="📬 Recruiter Outreach"
              subtitle="We reach out to recruiters at your target companies before you even apply. Gets you on their radar."
              options={addOnOptions.recruiter}
              selected={addOns.recruiter.selected}
              onSelect={() => toggleAddOn('recruiter')}
              selectedOption={addOns.recruiter.option}
              onOptionSelect={(opt) => setAddOnOption('recruiter', opt)}
            />
            
            <AddOnCard
              title="🤝 Referral Intros"
              subtitle="We help you connect with people at target companies who can refer you internally. Referrals are 4x more likely to get hired."
              options={addOnOptions.informational}
              selected={addOns.informational.selected}
              onSelect={() => toggleAddOn('informational')}
              selectedOption={addOns.informational.option}
              onOptionSelect={(opt) => setAddOnOption('informational', opt)}
            />
            
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
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Step 3: Review
  if (currentPage === 'pricing' && currentStep === 3) {
    return (
      <>
        
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
                  {items.length === 0 ? (
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
                    Once payment is in, we get started within 48 hours
                  </li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-cream border-t-4 border-teal-900 p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 font-bold text-teal-600 hover:text-teal-800 transition"
              >
                ← Back
              </button>
              
              <button
                disabled={total === 0}
                className={`px-8 py-4 rounded-xl font-black text-lg border-3 transition-all ${
                  total > 0
                    ? 'bg-coral border-teal-900 text-white shadow-[4px_4px_0px_0px_rgba(19,78,74,1)] hover:shadow-[6px_6px_0px_0px_rgba(19,78,74,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-teal-200 border-teal-300 text-teal-400 cursor-not-allowed'
                }`}
              >
                {total > 0 
                  ? paymentChoice === 'full' 
                    ? `Confirm - $${total}` 
                    : `Confirm - $${paymentPlan.deposit} today`
                  : 'Select something first'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
