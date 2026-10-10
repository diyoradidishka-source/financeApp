import { useState, useEffect } from 'react';
import {
  Wallet, Moon, Sun, PieChart, ShieldCheck,
  CheckCircle2, Sparkles, RefreshCw,
  BookOpen, Target, Activity, Menu, X
} from 'lucide-react';
import StressTestSimulator from './components/StressTestSimulator';
import usePersisted from './usePersisted';

// Teen-sized defaults per currency: monthly pocket money, fixed costs
// (transport, school lunch, mobile data) and starting savings.
const currencyData = {
  UZS: { symbol: "so'm", defaultIncome: 600000, defaultExpense: 300000, defaultSavings: 1200000 },
  USD: { symbol: '$', defaultIncome: 50, defaultExpense: 25, defaultSavings: 100 },
  EUR: { symbol: '€', defaultIncome: 45, defaultExpense: 22, defaultSavings: 90 }
};

const defaultHabits = [
  { id: 1, text: "Bugungi barcha xarajatlarimni yozib bordim", done: false },
  { id: 2, text: "Impulsiv xariddan tiyildim (24 soat qoidasi)", done: false },
  { id: 3, text: "Cho'ntak pulimning bir qismini jamg'armaga qo'ydim", done: false },
  { id: 4, text: "Haftalik byudjetimni tekshirdim", done: false }
];

const navLinks = [
  { href: '#kalkulyator', label: 'Kalkulyator' },
  { href: '#yastiqcha', label: 'Xavfsizlik Yastiqchasi' },
  { href: '#stresstest', label: 'Stress-Test (Runway)' },
  { href: '#qoidalar', label: 'Qoidalar' },
  { href: '#odatlar', label: 'Odatlar' }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = usePersisted('budgetcraft_currency', 'UZS');
  const [income, setIncome] = usePersisted('budgetcraft_income', currencyData.UZS.defaultIncome);
  const [expenses, setExpenses] = usePersisted('budgetcraft_expenses', currencyData.UZS.defaultExpense);
  const [months, setMonths] = usePersisted('budgetcraft_months', 6);

  // Sync darkMode with root HTML document element for complete Tailwind dark: variant support
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [habits, setHabits] = usePersisted('budgetcraft_habits', defaultHabits);
  // Stress-test inputs; null means "use the defaults for the current currency"
  const [stressData, setStressData] = usePersisted('budgetcraft_stresstest_data', null);

  // Amounts don't convert between currencies, so a switch resets them all to that currency's defaults
  const handleCurrencyChange = (newCurr) => {
    if (newCurr === currency) return; // re-clicking the active currency must not wipe inputs
    setCurrency(newCurr);
    setIncome(currencyData[newCurr].defaultIncome);
    setExpenses(currencyData[newCurr].defaultExpense);
    setStressData(null);
  };

  const formatAmount = (val) => {
    const rounded = Math.round(val);
    if (currency === 'UZS') {
      return rounded.toLocaleString('uz-UZ') + " so'm";
    }
    return currencyData[currency].symbol + rounded.toLocaleString('en-US');
  };

  // 50/30/20 Calculations
  const needs = Math.round(income * 0.5);
  const wants = Math.round(income * 0.3);
  const savings = Math.round(income * 0.2);

  // Emergency Fund Target
  const emergencyTarget = expenses * months;

  // Habits Progress
  const completedHabits = habits.filter(h => h.done).length;
  const habitPercentage = Math.round((completedHabits / habits.length) * 100);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 relative selection:bg-emerald-200 selection:text-emerald-950 ${
        darkMode
          ? 'dark bg-slate-950 text-slate-50'
          : 'bg-[#f4fbf7] text-slate-900'
      }`}
    >
      {/* Ambient background blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-60 transition-all duration-700 ${
            darkMode ? 'bg-emerald-950/30' : 'bg-emerald-100/70'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-60 transition-all duration-700 ${
            darkMode ? 'bg-amber-950/20' : 'bg-amber-100/60'
          }`}
        />
      </div>

      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white/95 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo and Menu Links */}
          <div className="flex items-center gap-8 lg:gap-10">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-slate-950" />
              </div>
              {/* Brand text hidden on very small phones so the controls fit */}
              <div className="hidden sm:block">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 dark:from-emerald-400 dark:to-amber-300 bg-clip-text text-transparent">
                  BudgetCraft
                </span>
                <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 -mt-0.5">
                  O'quvchilar uchun
                </span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300">
              {navLinks.map((link) =>
                link.href === '#stresstest' ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold bg-emerald-100/90 dark:bg-emerald-950/70 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>{link.label}</span>
                  </a>
                ) : (
                  <a key={link.href} href={link.href} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Controls: Currency switcher, Theme toggle, Mobile menu button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`flex items-center p-1 rounded-2xl border text-xs font-bold transition-colors ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
              }`}
            >
              {Object.keys(currencyData).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleCurrencyChange(curr)}
                  aria-pressed={currency === curr}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                    currency === curr
                      ? 'bg-emerald-700 text-white shadow-sm font-black'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-2xl border transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
              }`}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu toggle: replaces the desktop nav below the md breakpoint */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              aria-label="Menyu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-[140px] pb-24 space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> O'quvchilar uchun moliya
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Cho'ntak Pulingizni Boshqarishni O'rganing
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            Cho'ntak pulingizni aqlli taqsimlang, maqsadlaringiz uchun jamg'aring va kutilmagan xarajatlarga tayyor bo'ling.
          </p>
        </section>

        {/* 1. 50/30/20 Kalkulyatori */}
        <section
          id="kalkulyator"
          className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm space-y-8 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 rounded-2xl border border-emerald-300 dark:border-emerald-800">
              <PieChart className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">50 / 30 / 20 Byudjet Kalkulyatori</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-medium mt-0.5">
                Oylik daromadingizni ehtiyoj, istak va jamg'armaga avtomatik ajrating
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input and Range Slider */}
            <div className="lg:col-span-5 space-y-4">
              <label htmlFor="income-input" className="block text-sm font-black text-slate-900 dark:text-slate-100">
                Oylik Cho'ntak Pulingiz / Daromadingiz:
              </label>
              <div className="relative">
                <input
                  id="income-input"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-xl font-black outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600">
                  {currency}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={currency === 'UZS' ? 5000000 : 500}
                step={currency === 'UZS' ? 50000 : 5}
                aria-label="Oylik daromad"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              {/* Visual Breakdown Bar */}
              <div className="pt-2">
                <div className="text-xs font-black mb-2 flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Taqsimot Nisbati</span>
                  <span>100% Sof Daromad</span>
                </div>
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 p-0.5 border border-slate-300 dark:border-slate-700">
                  <div style={{ width: '50%' }} className="bg-emerald-600 h-full rounded-l-full" title="50% Ehtiyojlar" />
                  <div style={{ width: '30%' }} className="bg-amber-500 h-full" title="30% Istaklar" />
                  <div style={{ width: '20%' }} className="bg-teal-600 h-full rounded-r-full" title="20% Jamg'arma" />
                </div>
              </div>
            </div>

            {/* Splitter Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border-2 border-emerald-300/90 dark:border-slate-700 bg-emerald-50/80 dark:bg-slate-800/80 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-300">
                    50% Ehtiyojlar
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{formatAmount(needs)}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">Transport, maktab tushligi, mobil internet</p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-amber-300/90 dark:border-slate-700 bg-amber-50/80 dark:bg-slate-800/80 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-300">
                    30% Istaklar
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{formatAmount(wants)}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">Kafe, o'yinlar, kino va xobbi</p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-teal-300/90 dark:border-slate-700 bg-teal-50/80 dark:bg-slate-800/80 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-950 dark:text-teal-300">
                    20% Jamg'arma
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{formatAmount(savings)}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">Telefon, noutbuk yoki boshqa katta maqsadlar uchun</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Xavfsizlik Yostig'i Kalkulyatori */}
        <section
          id="yastiqcha"
          className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm space-y-6 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-300 rounded-2xl border border-amber-300 dark:border-amber-800">
              <ShieldCheck className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Xavfsizlik Yostig'i Kalkulyatori</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-medium mt-0.5">
                Kutilmagan vaziyatlar uchun zarur bo'lgan zaxira kapitalini hisoblang
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label htmlFor="expenses-input" className="block text-sm font-black text-slate-900 dark:text-slate-100 mb-1.5">
                  Oylik Majburiy Xarajatlaringiz:
                </label>
                <input
                  id="expenses-input"
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-lg font-black outline-none focus:border-amber-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 dark:text-slate-100 mb-2">
                  Necha oylik xavfsizlik yostiqchasi yaratmoqchisiz?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      className={`py-3 rounded-xl text-sm font-black border transition-all ${
                        months === m
                          ? 'border-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {m} Oylik
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border-2 border-amber-300/80 dark:border-slate-700 bg-amber-50/80 dark:bg-slate-800/80 flex flex-col justify-center items-center text-center shadow-inner">
              <span className="text-xs font-black uppercase tracking-widest text-amber-950 dark:text-amber-300 mb-2">
                Tavsiya Etilgan Jamg'arma Maqsadi
              </span>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 my-2">
                {formatAmount(emergencyTarget)}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium max-w-sm leading-relaxed">
                Kutilmagan xarajatlar yoki vaqtinchalik daromad to'xtaganda {months} oy davomida moliyaviy erkin yashash imkonini beradi.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Moliyaviy Stress-Test va Runway Simulyatori */}
        <StressTestSimulator
          income={income}
          expenses={expenses}
          wants={wants}
          defaultSavings={currencyData[currency].defaultSavings}
          saved={stressData}
          onSavedChange={setStressData}
          currency={currency}
          formatAmount={formatAmount}
          darkMode={darkMode}
        />

        {/* 4. Aqlli Tejash Qoidalari */}
        <section id="qoidalar" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 rounded-2xl border border-emerald-300 dark:border-emerald-800">
              <BookOpen className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Aqlli Tejash Qoidalari</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-medium mt-0.5">
                Sinovdan o'tgan moliyaviy strategiyalar va intizom vositalari
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "24 Soat Qoidasi",
                badge: "Nazorat",
                badgeBg: "bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
                icon: <RefreshCw className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
                desc: "Rejalashtirilmagan yirik xaridlardan oldin kamida 24 soat kuting. Bu impulsiv his-tuyg'ularni sovitadi."
              },
              {
                title: "50/30/20 Qoidasi",
                badge: "Taqsimot",
                badgeBg: "bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
                icon: <PieChart className="w-5 h-5 text-amber-700 dark:text-amber-400" />,
                desc: "Cho'ntak pulingizni 50% ehtiyoj, 30% xohish va 20% jamg'armaga bo'lib chiqing."
              },
              {
                title: "Inflyatsiya Qalqoni",
                badge: "Himoya",
                badgeBg: "bg-teal-100 text-teal-950 border border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
                icon: <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" />,
                desc: "Narxlar har yili oshadi. Jamg'armani uyda naqd saqlamay, ota-onangiz bilan bank kartasi yoki omonat ochishni muhokama qiling."
              },
              {
                title: "10% Oltin Qoida",
                badge: "Avtomatizatsiya",
                badgeBg: "bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
                icon: <Target className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
                desc: "Cho'ntak pul olishingiz bilan, sarflashdan oldin, uning 10% qismini jamg'armaga ajratib qo'ying."
              }
            ].map((rule, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                      {rule.icon}
                    </div>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${rule.badgeBg}`}>
                      {rule.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">{rule.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Kunlik Moliyaviy Odatlar */}
        <section
          id="odatlar"
          className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm space-y-6 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 rounded-2xl border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Kunlik Moliyaviy Odatlar</h2>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-medium mt-0.5">
                  Doimiy moliyaviy intizom shakllantirish checklisti
                </p>
              </div>
            </div>

            <div className="w-full sm:w-56">
              <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800 dark:text-slate-200">
                <span>Bajarildi</span>
                <span>{habitPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 transition-all duration-500 rounded-full"
                  style={{ width: `${habitPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <button
                type="button"
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                aria-pressed={habit.done}
                className={`w-full text-left flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  habit.done
                    ? 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                    : 'bg-slate-50 border-slate-300 hover:border-emerald-500 dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${
                    habit.done
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700'
                  }`}
                >
                  {habit.done && <span className="text-xs font-black">✓</span>}
                </div>
                <span
                  className={`text-sm font-bold ${
                    habit.done
                      ? 'line-through text-slate-700 dark:text-slate-400'
                      : 'text-slate-900 dark:text-slate-50'
                  }`}
                >
                  {habit.text}
                </span>
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
          <p>© 2026 BudgetCraft — o'quvchilar uchun moliyaviy savodxonlik.</p>
        </div>
      </footer>

    </div>
  );
}