import { 
  TrendingUp, 
  Zap, 
  Bell, 
  PieChart, 
  Shield, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { NewsletterForm } from '@/components/NewsletterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Stock Watcher — Quality stock tracking for patient investors',
  description: 'Stop drowning in noise. Track quality stocks with G.R.O.W. scores, get alerted when they hit buy zones, and invest with confidence.',
};

function GrowBadge({ letter, word, description }: { letter: string; word: string; description: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
          {letter}
        </span>
        <span className="text-white font-semibold">{word}</span>
      </div>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="p-6">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  cta, 
  highlighted = false 
}: { 
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`
      rounded-2xl p-8 relative
      ${highlighted 
        ? 'bg-gradient-to-b from-emerald-500/10 to-zinc-900/50 border-2 border-emerald-500/50' 
        : 'bg-zinc-900/50 border border-zinc-800'
      }
    `}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
          Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-1">{name}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        {period && <span className="text-zinc-400 text-sm">/{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <button className={`
        w-full py-3 rounded-lg font-medium transition-colors
        ${highlighted 
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
        }
      `}>
        {cta}
      </button>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Stock Watcher</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#grow" className="text-zinc-400 hover:text-white text-sm transition-colors">G.R.O.W.</a>
            <a href="#pricing" className="text-zinc-400 hover:text-white text-sm transition-colors">Pricing</a>
          </div>
          <a 
            href="#waitlist"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
          >
            Join waitlist
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            Launching soon
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stock watching for
            <br />
            <span className="text-emerald-400">patient investors</span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop drowning in noise. Track quality stocks with G.R.O.W. scores, 
            get alerted when they hit buy zones, and invest with confidence.
          </p>

          <div className="max-w-md mx-auto" id="waitlist">
            <NewsletterForm variant="inline" source="hero" />
          </div>
          
          <p className="text-zinc-500 text-sm mt-4">
            Join 0 investors on the waitlist
          </p>
        </div>
      </section>

      {/* Screenshot placeholder */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl aspect-video flex items-center justify-center">
            <p className="text-zinc-500">Product screenshot coming soon</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Too much noise.<br />
            <span className="text-zinc-400">Not enough signal.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            You're not a day trader. You don't have hours to research. 
            But you know good companies exist — you just can't cut through the chaos to find them.
          </p>
          <p className="text-zinc-400 text-lg leading-relaxed mt-4">
            Traditional tools give you everything. Data dumps. Endless charts. Forum opinions.
            What you need is simple: <span className="text-white">"Is this stock worth watching? Should I buy now?"</span>
          </p>
        </div>
      </section>

      {/* G.R.O.W. Methodology */}
      <section className="py-20 px-4 border-t border-zinc-800/50" id="grow">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One score. Four pillars. Zero noise.
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              The G.R.O.W. methodology scores every stock on what actually matters:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GrowBadge 
              letter="G" 
              word="Growth Moat" 
              description="Does it have lasting competitive advantage?" 
            />
            <GrowBadge 
              letter="R" 
              word="Revenue Quality" 
              description="Is the income predictable and growing?" 
            />
            <GrowBadge 
              letter="O" 
              word="Owner-Operator" 
              description="Is management aligned with shareholders?" 
            />
            <GrowBadge 
              letter="W" 
              word="Valuation Wisdom" 
              description="Is the price reasonable for the quality?" 
            />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-zinc-400">
              Every stock gets a score from 0-100.
              <br />
              Above 70? <span className="text-white">Worth your attention.</span>
              <br />
              Above 85? <span className="text-emerald-400">Probably worth your money.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-zinc-800/50" id="features">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What you get</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={BarChart3}
              title="Curated Watchlist"
              description="Track the stocks that matter. Not 10,000 tickers — just your carefully chosen few, scored and monitored."
            />
            <FeatureCard 
              icon={Zap}
              title="AI Suggestions"
              description="Based on your watchlist style, we surface stocks you might be missing. Quality begets quality."
            />
            <FeatureCard 
              icon={Bell}
              title="Buy Zone Alerts"
              description="Get notified when a stock hits your price target AND has a strong G.R.O.W. score. Not just 'it dropped' — 'it's time.'"
            />
            <FeatureCard 
              icon={PieChart}
              title="Portfolio Tracker"
              description="See your holdings through the G.R.O.W. lens. Know the quality of what you own."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 border-t border-zinc-800/50" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing. No surprises.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              description="For the curious"
              features={[
                "Watch up to 5 stocks",
                "Basic G.R.O.W. scores",
                "Daily market overview",
              ]}
              cta="Start free"
            />
            <PricingCard
              name="Pro"
              price="$8"
              period="month"
              description="For the serious"
              features={[
                "Unlimited watchlist",
                "AI suggestions",
                "Buy zone alerts",
                "Full G.R.O.W. breakdowns",
              ]}
              cta="Upgrade to Pro"
              highlighted
            />
            <PricingCard
              name="Early Adopter"
              price="$59"
              period="year"
              description="Limited offer"
              features={[
                "Everything in Pro",
                "Locked at $59/year forever",
                "First 100 users only",
                "Priority support",
              ]}
              cta="Claim early access"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Is this financial advice?",
                a: "No. Stock Watcher provides information and scoring methodology, not advice. You make your own decisions."
              },
              {
                q: "What data do you use?",
                a: "Financial Modeling Prep API for fundamentals. We process it into G.R.O.W. scores using our transparent methodology."
              },
              {
                q: "Can I track international stocks?",
                a: "Currently US markets only. International coming based on demand."
              },
              {
                q: "How is G.R.O.W. calculated?",
                a: "Fully transparent scoring based on growth moat, revenue quality, owner-operator alignment, and valuation wisdom."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Monthly cancels immediately. Annual is prorated if you cancel within 30 days."
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-zinc-800/50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to watch smarter?
          </h2>
          <p className="text-zinc-400 mb-8">
            Join patient investors who cut the noise and focus on quality.
          </p>
          <NewsletterForm variant="card" source="footer" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Stock Watcher</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 Stock Watcher. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
