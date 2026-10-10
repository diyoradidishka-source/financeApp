import React, { useState, useEffect } from 'react';
import {
  Wallet, Moon, Sun, DollarSign, PieChart, ShieldCheck,
  CheckCircle2, Circle, ArrowUpRight, TrendingUp, Sparkles, RefreshCw,
  Calculator, BookOpen, Calendar, HelpCircle, Target, Percent
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [income, setIncome] = useState(2500);
  const [expenses, setExpenses] = useState(1200);
  const [months, setMonths] = useState(6);

  // Currency configurations with default pre-filled baseline amounts
  const currencyData = {
    USD: { symbol: '$', rate: 1, defaultIncome: 2500, defaultExpense: 1200, label: 'USD ($)' },
    UZS: { symbol: "so'm", rate: 12800, defaultIncome: 15000000, defaultExpense: 8000000, label: "UZS (SO'M)" },
    EUR: { symbol: '€', rate: 0.92, defaultIncome: 2200, defaultExpense: 1000, label: 'EUR (€)' }
  };

  // Interactive daily habits tracker state
  const [habits, setHabits] = useState([
    { id: 1, text: "Bugungi barcha xarajatlarni aniq yozib bordim", done: true },
    { id: 2, text: "Impulsiv xariddan tiyildim (24 soat kashfiyot qoidasi)", done: false },
    { id: 3, text: "Sarmoya yoki jamg'arma hisobiga rejadagidek pul o'tkazdim", done: true },
    { id: 4, text: "Haftalik byudjet va kredit limitlarini tekshirdim", done: false }
  ]);

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    setIncome(currencyData[newCurr].defaultIncome);
    setExpenses(currencyData[newCurr].defaultExpense);
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
    <div className={`min-h-screen font-sans transition-colors duration-300 relative selection:bg-emerald-200 selection:text-emerald-900 ${darkMode
        ? 'bg-slate-950 text-slate-100'
        : 'bg-[#f7faf8] text-slate-800'
      }`}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-60 transition-all duration-700 ${darkMode ? 'bg-emerald-950/40' : 'bg-emerald-100/80'
          }`} />
        <div className={`absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-60 transition-all duration-700 ${darkMode ? 'bg-amber-950/30' : 'bg-amber-100/70'
          }`} />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${darkMode
          ? 'bg-slate-900/85 border-slate-800'
          : 'bg-white/85 border-emerald-100/80'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo and Menu Links with balanced horizontal spacing */}
          <div className="flex items-center gap-8 lg:gap-10">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-300 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 dark:from-emerald-400 dark:to-amber-300 bg-clip-text text-transparent">
                  BudgetCraft
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 -mt-1">
                  Mint & Cream
                </span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <a href="#kalkulyator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kalkulyator</a>
              <a href="#yastiqcha" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Xavfsizlik Yastiqchasi</a>
              <a href="#qoidalar" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Qoidalar</a>
              <a href="#odatlar" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Odatlar</a>
            </nav>
          </div>

          {/* Controls: Currency switcher and Theme toggle */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center p-1 rounded-2xl border text-xs font-bold transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50/80 border-emerald-200/80'
              }`}>
              {['USD', 'UZS', 'EUR'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${currency === curr
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-extrabold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                >
                  {currencyData[curr].label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-2xl border transition-all ${darkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-amber-50 border-amber-200/80 text-amber-700 hover:bg-amber-100'
                }`}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-[150px] pb-24 space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Mint & Cream Soft Finance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Shaxsiy Moliya va Tejash Qoidalari
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Pullaringizni aqlli taqsimlang va kelajak uchun mustahkam poydevor yarating. Excel va murakkab formulalarsiz bir zumda hisoblang.
          </p>
        </section>

        <section id="kalkulyator" className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 space-y-8 shadow-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-100/90 shadow-emerald-500/5'
          }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-2xl">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">50 / 30 / 20 Byudjet Kalkulyatori</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Oylik daromadingizni ehtiyoj, istak va jamg'armaga avtomatik ajrating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input and Range Slider */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Oylik Sof Daromadingiz:
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                  className={`w-full px-4 py-3.5 rounded-2xl border text-xl font-bold outline-none transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 focus:border-emerald-500 text-slate-100'
                      : 'bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 text-slate-800'
                    }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                  {currency}
                </span>
              </div>

              <input
                type="range"
                min={currency === 'UZS' ? 1000000 : 100}
                max={currency === 'UZS' ? 100000000 : 15000}
                step={currency === 'UZS' ? 500000 : 100}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              {/* Visual Breakdown Bar */}
              <div className="pt-2">
                <div className="text-xs font-semibold mb-2 flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Taqsimot Nisbati</span>
                  <span>100% Sof Daromad</span>
                </div>
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                  <div style={{ width: '50%' }} className="bg-emerald-500 h-full rounded-l-full" title="50% Ehtiyojlar" />
                  <div style={{ width: '30%' }} className="bg-amber-400 h-full" title="30% Istaklar" />
                  <div style={{ width: '20%' }} className="bg-teal-600 h-full rounded-r-full" title="20% Jamg'arma" />
                </div>
              </div>
            </div>

            {/* Splitter Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-emerald-50/60 border-emerald-200/80'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">50% Ehtiyojlar</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatAmount(needs)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kommunal, ijara, oziq-ovqat va majburiyatlar</p>
              </div>

              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-amber-50/80 border-amber-200/80'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">30% Istaklar</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatAmount(wants)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Restoranlar, xobbi, ko'ngilochar va sayohat</p>
              </div>

              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-teal-50/60 border-teal-200/80'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">20% Jamg'arma</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatAmount(savings)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zahira jamg'armasi va investitsiya poydevori</p>
              </div>
            </div>
          </div>
        </section>

        <section id="yastiqcha" className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 space-y-6 shadow-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-100/90 shadow-emerald-500/5'
          }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Xavfsizlik Yostig'i Kalkulyatori</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kutilmagan vaziyatlar uchun zarur bo'lgan zaxira kapitalini hisoblang</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Oylik Majburiy Xarajatlaringiz:
                </label>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
                  className={`w-full px-4 py-3 rounded-2xl border text-lg font-bold outline-none transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 focus:border-amber-400 text-slate-100'
                      : 'bg-amber-50/40 border-amber-200 focus:border-amber-400 text-slate-800'
                    }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Necha oylik xavfsizlik yostiqchasi yaratmoqchisiz?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${months === m
                          ? 'border-transparent bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                            : 'bg-white border-emerald-200/80 text-slate-700 hover:bg-emerald-50'
                        }`}
                    >
                      {m} Oylik
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border flex flex-col justify-center items-center text-center shadow-inner ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-gradient-to-br from-amber-50/80 via-emerald-50/50 to-white border-amber-200/60'
              }`}>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300 mb-2">Tavsiya Etilgan Jamg'arma Maqsadi</span>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 my-2">{formatAmount(emergencyTarget)}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
                Kutilmagan xarajatlar yoki vaqtinchalik daromad to'xtaganda {months} oy davomida moliyaviy erkin yashash imkonini beradi.
              </p>
            </div>
          </div>
        </section>

        <section id="qoidalar" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Aqlli Tejash Qoidalari</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Sinovdan o'tgan moliyaviy strategiyalar va intizom vositalari</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "24 Soat Qoidasi",
                badge: "Nazorat",
                badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                icon: <RefreshCw className="w-5 h-5 text-emerald-600" />,
                desc: "Rejalashtirilmagan yirik xaridlardan oldin kamida 24 soat kuting. Bu impulsiv his-tuyg'ularni sovitadi."
              },
              {
                title: "50/30/20 Qoidasi",
                badge: "Taqsimot",
                badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                icon: <PieChart className="w-5 h-5 text-amber-600" />,
                desc: "Daromadni 50% ehtiyoj, 30% xohish va 20% jamg'armaga avtomatik bo'lib chiqing."
              },
              {
                title: "Inflyatsiya Qalg'oni",
                badge: "Himoya",
                badgeBg: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                desc: "Bo'sh pulni oddiy naqd saqlamang, investitsiya yoki valyuta aktivlariga yo'naltiring."
              },
              {
                title: "10% Oltin Qoida",
                badge: "Avtomatizatsiya",
                badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                icon: <Target className="w-5 h-5 text-emerald-600" />,
                desc: "Daromad tushishi bilan birinchi navbatda 10% qismini o'zingizga jamg'arma sifatida o'tkazib qo'ying."
              }
            ].map((rule, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-sm flex flex-col justify-between space-y-4 ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-100/80 hover:border-emerald-300'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-2xl">
                      {rule.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${rule.badgeBg}`}>
                      {rule.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{rule.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="odatlar" className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 space-y-6 shadow-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-100/90 shadow-emerald-500/5'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Kunlik Moliyaviy Odatlar</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Doimiy moliyaviy intizom shakllantirish checklisti</p>
              </div>
            </div>

            <div className="w-full sm:w-56">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-300">
                <span>Bajarildi</span>
                <span>{habitPercentage}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${habitPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${habit.done
                    ? darkMode ? 'bg-emerald-950/30 border-emerald-800/40 opacity-80' : 'bg-emerald-50/70 border-emerald-200/80 opacity-90'
                    : darkMode ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500' : 'bg-white border-slate-200/80 hover:border-emerald-300'
                  }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${habit.done
                    ? 'bg-emerald-500 border-transparent text-white'
                    : 'border-slate-300 dark:border-slate-600'
                  }`}>
                  {habit.done && <span className="text-xs font-bold">✓</span>}
                </div>
                <span className={`text-sm font-semibold ${habit.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                  {habit.text}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100/60 dark:border-slate-800 py-6 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 BudgetCraft - Modern Mint & Cream Finance App.</p>
        </div>
      </footer>

    </div>
  );
}