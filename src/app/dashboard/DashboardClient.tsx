'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Sparkles, 
  History, 
  CreditCard, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Search, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  Info,
  Calendar,
  XCircle
} from 'lucide-react';

interface DashboardClientProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
  usageCount: number;
  initialReviews: any[];
}

export default function DashboardClient({ user, usageCount: initialUsage, initialReviews }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'billing'>('scan');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [usageCount, setUsageCount] = useState(initialUsage);
  const [activeReview, setActiveReview] = useState<any | null>(null);

  // Billing states
  const [billingLoading, setBillingLoading] = useState(false);

  // Handle URL redirect query parameters (e.g. ?upgrade=true or ?tab=billing)
  useEffect(() => {
    const upgrade = searchParams.get('upgrade');
    const tab = searchParams.get('tab');
    if (upgrade === 'true') {
      setActiveTab('billing');
    } else if (tab === 'billing') {
      setActiveTab('billing');
    } else if (tab === 'history') {
      setActiveTab('history');
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || !jobDescription) return;

    setLoading(true);
    setError(null);
    setActiveReview(null);

    // Simulated step transitions for loading effect
    const steps = [
      'Parsing resume syntax...',
      'Matching core job description keywords...',
      'Running compatibility algorithms...',
      'Formulating actionable improvement reports...'
    ];

    let currentStep = 0;
    setLoadingStep(steps[currentStep]);

    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setLoadingStep(steps[currentStep]);
      }
    }, 2500);

    try {
      const response = await fetch('/api/reviews/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await response.json();

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      // Add to reviews list
      const newReview = data.review;
      setReviews(prev => [newReview, ...prev]);
      setUsageCount(prev => prev + 1);
      setActiveReview(newReview);
      setResumeText('');
      setJobDescription('');
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleDeleteReview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this scan report?')) return;

    try {
      const response = await fetch('/api/reviews/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId: id }),
      });

      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        if (activeReview?.id === id) {
          setActiveReview(null);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete report.');
      }
    } catch (err) {
      console.error('Delete review failed:', err);
    }
  };

  const handleUpgrade = async () => {
    setBillingLoading(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Could not create checkout session');
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setBillingLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const response = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Could not launch customer portal');
      }
    } catch (err: any) {
      // Fallback: direct cancellation API
      if (confirm('Manage Portal is not available. Would you like to immediately cancel your active subscription?')) {
        try {
          const cancelRes = await fetch('/api/billing/cancel', { method: 'POST' });
          const cancelData = await cancelRes.json();
          if (cancelData.success) {
            alert('Your subscription was successfully canceled.');
            router.refresh();
            window.location.reload();
          } else {
            alert(cancelData.error || 'Cancellation failed.');
          }
        } catch (cErr) {
          console.error(cErr);
          alert('Failed to process cancellation.');
        }
      }
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              ResumeAces
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-slate-400">Signed in as:</span>
              <span className="text-slate-200 font-medium">{user.email}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 z-10">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-slate-900 pb-4 md:pb-0 md:pr-6 h-fit">
          <button
            onClick={() => { setActiveTab('scan'); setActiveReview(null); setError(null); }}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'scan' && !activeReview
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Scan Resume</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('history'); setActiveReview(null); setError(null); }}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'history' && !activeReview
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Past Reports</span>
            {reviews.length > 0 && (
              <span className="ml-auto bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {reviews.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('billing'); setActiveReview(null); setError(null); }}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'billing' && !activeReview
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Plan & Billing</span>
            {user.role === 'pro' && (
              <span className="ml-auto bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-amber-500/20">
                Pro
              </span>
            )}
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Active scanned review details display */}
          {activeReview ? (
            <div className="space-y-6">
              <button
                onClick={() => setActiveReview(null)}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to List</span>
              </button>

              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur-xl">
                {/* Header score block */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-900">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Scanned on {new Date(activeReview.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{activeReview.matchScore}%</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Match Score</div>
                      <div className="text-sm font-semibold text-indigo-400">
                        {activeReview.matchScore >= 80 ? 'Excellent Match!' : activeReview.matchScore >= 60 ? 'Moderate Alignment' : 'Needs Significant Refinement'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-indigo-400" />
                    <span>Summary Analysis</span>
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/45 p-4 rounded-xl border border-slate-900">
                    {activeReview.feedback.summary}
                  </p>
                </div>

                {/* Grid for Strengths & Gaps */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Strengths & Matches</span>
                    </h3>
                    <ul className="space-y-2 bg-green-950/10 border border-green-900/20 p-4 rounded-xl">
                      {activeReview.feedback.strengths?.map((str: string, i: number) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-1 shrink-0">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critical Gaps</span>
                    </h3>
                    <ul className="space-y-2 bg-amber-950/10 border border-amber-900/20 p-4 rounded-xl">
                      {activeReview.feedback.gaps?.map((gap: string, i: number) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-amber-500 mt-1 shrink-0">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Keywords comparison */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-400" />
                    <span>Keyword Analysis</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                      <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Matching Keywords</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeReview.feedback.keywords?.matching?.length > 0 ? (
                          activeReview.feedback.keywords.matching.map((kw: string, i: number) => (
                            <span key={i} className="text-xs bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-1 rounded">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">No keywords detected</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Missing Keywords</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeReview.feedback.keywords?.missing?.length > 0 ? (
                          activeReview.feedback.keywords.missing.map((kw: string, i: number) => (
                            <span key={i} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">None missing</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    <span>Actionable Improvements</span>
                  </h3>
                  <ul className="space-y-3 bg-violet-950/5 border border-violet-900/15 p-4 rounded-xl">
                    {activeReview.feedback.improvements?.map((imp: string, i: number) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs text-violet-300 shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Scan Tab */}
              {activeTab === 'scan' && (
                <div className="space-y-6">
                  {/* Gate Warnings / Upgrade Box */}
                  {user.role === 'free' ? (
                    <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-slate-900/20 border border-indigo-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                          <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                          <span>Free Account Status</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          You have used <span className="text-white font-bold">{usageCount} of 3</span> daily scans.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('billing')}
                        className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow shadow-indigo-600/20 transition-all inline-flex items-center gap-1 shrink-0"
                      >
                        <span>Upgrade to Pro</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400" />
                      <p className="text-slate-300 text-sm">
                        <span className="text-white font-bold">Pro Access Active:</span> You have unlimited daily scans. Thank you for subscribing!
                      </p>
                    </div>
                  )}

                  {/* Input Form */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-6">New Resume Analysis</h2>
                    
                    <form onSubmit={handleRunAnalysis} className="space-y-6">
                      {error && (
                        <div className="p-4 bg-red-950/40 border border-red-950 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                          <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Resume Text */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Resume Content
                          </label>
                          <textarea
                            required
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your plain text resume here... Include contact info, work experiences, skills, and education."
                            rows={12}
                            disabled={loading || (user.role === 'free' && usageCount >= 3)}
                            className="block w-full p-4 bg-slate-950/50 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 transition-all outline-none resize-none text-sm"
                          />
                        </div>

                        {/* Job Description */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Job Description
                          </label>
                          <textarea
                            required
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description here... Include job summary, core duties, requirements, and tech stack."
                            rows={12}
                            disabled={loading || (user.role === 'free' && usageCount >= 3)}
                            className="block w-full p-4 bg-slate-950/50 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 transition-all outline-none resize-none text-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        {user.role === 'free' && usageCount >= 3 ? (
                          <div className="w-full p-4 bg-amber-950/30 border border-amber-800/40 rounded-xl text-center text-sm text-amber-300">
                            You have reached your free daily limit of 3 scans. Please upgrade to Pro in the <strong>Plan & Billing</strong> tab to continue scanning.
                          </div>
                        ) : (
                          <button
                            type="submit"
                            disabled={loading || !resumeText || !jobDescription}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none"
                          >
                            {loading ? (
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{loadingStep}</span>
                              </div>
                            ) : (
                              <>
                                <span>Analyze Resume compatibility</span>
                                <Sparkles className="w-4 h-4 fill-white" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Scan Reports History</h2>

                  {reviews.length === 0 ? (
                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-12 text-center text-slate-400 space-y-4">
                      <FileText className="w-12 h-12 mx-auto text-slate-600" />
                      <p className="text-sm">You haven&apos;t run any resume reviews yet.</p>
                      <button
                        onClick={() => setActiveTab('scan')}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm underline"
                      >
                        Analyze your first resume now
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          onClick={() => setActiveReview(rev)}
                          className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800/80 p-5 rounded-xl flex items-center justify-between gap-6 transition-all cursor-pointer group"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="text-sm font-semibold text-slate-200 truncate pr-4">
                              Target Job: {rev.jobDescription.slice(0, 80)}...
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(rev.createdAt).toLocaleDateString()} at {new Date(rev.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Score:</span>
                              <span className="text-sm font-bold text-white bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                                {rev.matchScore}%
                              </span>
                            </div>

                            <button
                              onClick={(e) => handleDeleteReview(rev.id, e)}
                              className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-slate-950"
                              title="Delete report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Plan & Billing</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Active Subscription Details */}
                    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-6">
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Plan</div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <span>{user.role === 'pro' ? 'Pro Reviewer' : 'Free Starter'}</span>
                          {user.role === 'pro' && <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {user.role === 'pro' 
                            ? 'You have complete access to unlimited daily resume scans and detailed breakdowns.' 
                            : 'You are on the free starter plan with a cap of 3 scans per day.'}
                        </p>
                      </div>

                      <div className="border-t border-slate-900 pt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Monthly Cost</span>
                          <span className="font-bold text-white">{user.role === 'pro' ? '$19.00' : '$0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Scans Status</span>
                          <span className="font-bold text-indigo-400">
                            {user.role === 'pro' ? 'Unlimited Scans' : `${usageCount} / 3 Scans used today`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4">
                        {user.role === 'pro' ? (
                          <button
                            onClick={handleManageBilling}
                            disabled={billingLoading}
                            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-sm font-semibold rounded-xl active:scale-[0.99] transition-all disabled:opacity-50"
                          >
                            {billingLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                              'Manage Subscription / Cancel'
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={handleUpgrade}
                            disabled={billingLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold rounded-xl shadow shadow-indigo-600/10 active:scale-[0.99] transition-all disabled:opacity-50"
                          >
                            {billingLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                              'Upgrade to Pro ($19/mo)'
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Features checklist comparison */}
                    <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-6">
                      <h4 className="text-sm font-bold text-slate-300">Plan Comparison</h4>
                      <ul className="space-y-4 text-xs text-slate-400">
                        <li className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span><strong>Free Plan:</strong> limited to 3 scans/day. Standard feedback reports only.</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span><strong>Pro Plan:</strong> unlimited scans, keyword gap analysis, detailed formatting reports, prioritised LLM context.</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span><strong>Stripe Billing:</strong> Secure checkout handling. Subscription status updates automatically on checkout completion.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
