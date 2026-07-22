import React from 'react';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { 
  FileText, 
  Search, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  TrendingUp, 
  Zap 
} from 'lucide-react';

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Background radial highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 group-hover:opacity-90 transition-opacity">
              ResumeAces
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  Go to App
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Resume Analysis</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
            Get your resume past the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              ATS screening
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload or paste your resume and match it against any job description. Get instant, actionable feedback to fix gaps and boost your interview rate.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Scan Your Resume Now</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>View Pricing</span>
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 select-none">
            <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">Amazon</div>
            <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">Google</div>
            <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">Microsoft</div>
            <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">Netflix</div>
          </div>
        </div>

        {/* Dashboard Mockup Showcase */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60 mb-4 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="text-xs text-slate-500 ml-4 font-mono">resumeaces.com/dashboard</div>
          </div>
          <div className="bg-slate-950/80 rounded-xl p-8 text-left min-h-[300px] border border-slate-900/80 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-6 w-1/3 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-800/55 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-800/55 rounded animate-pulse" />
              <div className="h-28 w-full bg-slate-900/80 border border-slate-800/55 rounded-xl p-4 flex flex-col gap-2">
                <div className="h-3 w-1/4 bg-slate-800 rounded" />
                <div className="h-3 w-full bg-slate-800/40 rounded" />
                <div className="h-3 w-2/3 bg-slate-800/40 rounded" />
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0 border border-slate-800/80 rounded-xl p-6 bg-slate-900/30 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">84%</span>
              </div>
              <div className="h-4 w-1/2 bg-slate-800 rounded mb-2" />
              <div className="h-3 w-2/3 bg-slate-800/60 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-y border-slate-900/80 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Review resumes like a professional recruiter
            </h2>
            <p className="mt-4 text-slate-400">
              Our AI analyzes your experience against the exact specifications of the job posting to ensure you stand out.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800/60 p-8 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Match Score</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Get an instant compatibility percentage based on roles, achievements, skills, and formatting keywords.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800/60 p-8 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Keyword Extraction</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Automatically identify missing industry terms and core keywords that standard ATS filters look for.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800/60 p-8 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI-Powered Suggestions</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Receive paragraph-by-paragraph feedback on formatting, metric inclusion, and vocabulary strength.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Three simple steps to land more interviews
            </h2>
            <p className="mt-4 text-slate-400">
              Go from submission to refinement in less than 60 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Input Details</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Paste your current resume content and target job description in our easy-to-use editor.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg shadow-lg shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Run Analysis</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Our Gemini API scan runs matches, parses missing skills, and constructs detailed feedback cards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg shadow-lg shadow-indigo-600/30">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Refine & Apply</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Implement specific feedback recommendations and re-analyze to hit an optimal 80%+ score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-slate-900/80 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Pricing that grows with your search
            </h2>
            <p className="mt-4 text-slate-400">
              Analyze your first few resumes completely free. Upgrade to Pro for unlimited reviews and advanced analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-900/30 border border-slate-900 hover:border-slate-800/40 p-8 rounded-2xl flex flex-col justify-between transition-all">
              <div>
                <h3 className="text-lg font-semibold text-slate-300">Starter</h3>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-5xl font-extrabold tracking-tight">$0</span>
                  <span className="ml-1 text-xl font-semibold text-slate-500">/free</span>
                </div>
                <p className="mt-4 text-slate-400 text-sm">
                  Perfect for an occasional review to polish details.
                </p>
                <ul className="mt-8 space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>3 resume scans per day</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>AI match compatibility score</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Standard feedback summary</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 line-through">
                    <Check className="w-4 h-4 text-indigo-400/30 shrink-0" />
                    <span>Detailed keyword suggestions</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 line-through">
                    <Check className="w-4 h-4 text-indigo-400/30 shrink-0" />
                    <span>Scan history tracking</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href={user ? '/dashboard' : '/signup'}
                  className="w-full py-3 px-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-white font-semibold transition-all inline-block text-center text-sm"
                >
                  Start Scans Free
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900/60 border-2 border-indigo-500 p-8 rounded-2xl flex flex-col justify-between shadow-xl shadow-indigo-600/5 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>Pro Reviewer</span>
                  <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                </h3>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-5xl font-extrabold tracking-tight">$19</span>
                  <span className="ml-1 text-xl font-semibold text-slate-500">/month</span>
                </div>
                <p className="mt-4 text-slate-400 text-sm">
                  For active job hunters seeking multiple callbacks.
                </p>
                <ul className="mt-8 space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-white">Unlimited scans daily</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>AI match compatibility score</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Detailed feedback summary</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Detailed keyword suggestions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Persistent scan history log</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Priority AI model analysis</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href={user ? '/dashboard?upgrade=true' : '/signup?redirect=billing'}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all shadow-md shadow-indigo-600/10 inline-block text-center text-sm"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-sm text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} ResumeAces. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
