import {
  Receipt, Printer, Calculator, FileText, Zap, Shield, Download,
  UtensilsCrossed, ArrowRight, Check, Sparkles,
} from 'lucide-react';

const features = [
  { icon: Receipt, title: 'Three Invoice Templates', desc: 'Classic, Modern, and Compact Thermal — switch instantly without losing data.' },
  { icon: Printer, title: 'A4 + Thermal Printing', desc: 'Print to A4 paper, 80mm or 58mm thermal rolls. Clean output with no app UI.' },
  { icon: Calculator, title: 'GST & Tax Calculations', desc: 'CGST/SGST or IGST, item-level and bill-level discounts, service charge, rounding.' },
  { icon: Zap, title: 'Real-Time Preview', desc: 'See your invoice update live as you type. What you see is exactly what prints.' },
  { icon: Download, title: 'PDF Export', desc: "Download clean PDF invoices via your browser's print-to-PDF. No subscriptions." },
  { icon: Shield, title: 'Private & Offline', desc: 'All data stays in your browser. No accounts, no servers, no tracking.' },
];

const steps = [
  { num: '01', title: 'Enter restaurant details', desc: 'Add your logo, address, GSTIN, FSSAI — saved for future bills.' },
  { num: '02', title: 'Add items & charges', desc: 'Type menu items, set rates, apply discounts and tax. Calculations happen automatically.' },
  { num: '03', title: 'Print or download', desc: 'Choose a template and paper size, then print or save as PDF. Done.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-lg text-gray-900">BillBite</span>
          </div>
          <a href="/generator" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
            Create Bill
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 mb-6">
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
            Built for Indian restaurants
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Professional restaurant invoices,<br />in seconds.
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Generate GST-ready bills, thermal receipts, and A4 invoices with real-time preview.
            No sign-up, no subscriptions — just clean, printable invoices.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/generator" className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-base font-semibold text-white hover:bg-orange-700 transition shadow-lg shadow-orange-600/20">
              Create Bill <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/generator" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition">
              <Sparkles className="w-4 h-4" /> Try Sample Bill
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-x-6 gap-y-1 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-500" /> No account needed</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-500" /> Works offline</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-500" /> Free forever</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to bill</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">A complete billing toolkit designed for the way Indian restaurants actually work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Three steps to a printed bill</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <span className="text-5xl font-bold text-orange-100">{s.num}</span>
                <h3 className="mt-2 font-semibold text-lg text-gray-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && <ArrowRight className="hidden md:block absolute top-3 -right-4 w-5 h-5 text-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold">Three templates, three paper sizes</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">Classic serif for formal dining, Modern for upscale restaurants, and Compact Thermal for POS receipts.</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FileText, name: 'Classic', desc: 'Traditional serif invoice on A4' },
              { icon: Receipt, name: 'Modern', desc: 'Clean sans-serif with dark header' },
              { icon: Printer, name: 'Compact Thermal', desc: '80mm / 58mm POS receipt roll' },
            ].map((t, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
                <t.icon className="w-7 h-7 text-orange-400 mx-auto" />
                <h3 className="mt-3 font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to generate your first bill?</h2>
          <p className="mt-3 text-gray-600">No sign-up. No payment. Just open the generator and start typing.</p>
          <a href="/generator" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-base font-semibold text-white hover:bg-orange-700 transition shadow-lg shadow-orange-600/20">
            Create Bill Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-semibold text-gray-800 text-sm">BillBite</span>
          </div>
          <p className="text-xs text-gray-400 text-center">GST fields are configurable invoice entries — this tool does not verify GSTIN or ensure legal GST compliance.</p>
        </div>
      </footer>
    </div>
  );
}
