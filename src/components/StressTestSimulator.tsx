import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Sparkles,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Scissors,
  Calendar,
  Zap,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
export type CurrencyType = 'USD' | 'UZS' | 'EUR';

export interface StressTestProps {
  income: number;
  expenses: number;       // fixed monthly costs (transport, lunch, mobile data)
  wants: number;          // the 30% "fun money" part of the budget
  defaultSavings: number;
  saved: StressData | null;                         // persisted by App; null = use defaults
  onSavedChange: (data: StressData | null) => void;
  currency: CurrencyType;
  formatAmount: (amount: number) => string;
  darkMode: boolean;
}

interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  incomeDrop: number;
  expenseSpike: number;
  shock: number;
  badge: string;
  badgeColor: string;
}

// Everything the user can change in the simulator, saved as one object.
export interface StressData {
  savings: number;
  incomeDropPct: number;   // 0..100
  expenseSpikePct: number; // 0..50
  shockExpense: number;
  freezeWants: boolean;
  preset: string;
}

// Teen-sized one-off shocks. Index 2 (broken phone screen) is reused by scenario C.
const shockPresetsByCurrency: Record<CurrencyType, { label: string; val: number; tag: string }[]> = {
  UZS: [
    { label: "0 so'm", val: 0, tag: "Zarbasiz" },
    { label: "300 ming", val: 300000, tag: "Quloqchin buzildi" },
    { label: "800 ming", val: 800000, tag: "Telefon ekrani sindi" },
    { label: "2,5 mln", val: 2500000, tag: "Telefon yo'qoldi" },
  ],
  USD: [
    { label: "$0", val: 0, tag: "Zarbasiz" },
    { label: "+$25", val: 25, tag: "Quloqchin buzildi" },
    { label: "+$60", val: 60, tag: "Telefon ekrani sindi" },
    { label: "+$200", val: 200, tag: "Telefon yo'qoldi" },
  ],
  EUR: [
    { label: "0 €", val: 0, tag: "Zarbasiz" },
    { label: "+25 €", val: 25, tag: "Quloqchin buzildi" },
    { label: "+55 €", val: 55, tag: "Telefon ekrani sindi" },
    { label: "+180 €", val: 180, tag: "Telefon yo'qoldi" },
  ],
};

const uzbekMonths = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

export const StressTestSimulator: React.FC<StressTestProps> = ({
  income,
  expenses,
  wants,
  defaultSavings,
  saved,
  onSavedChange,
  currency,
  formatAmount,
  darkMode,
}) => {
  const baselineIncome = Math.max(0, income);
  const baselineExpenses = Math.max(0, expenses);
  const shockPresets = shockPresetsByCurrency[currency];

  // App persists this object and clears it (null) when the currency changes.
  const defaults: StressData = {
    savings: defaultSavings,
    incomeDropPct: 0,
    expenseSpikePct: 0,
    shockExpense: 0,
    freezeWants: false,
    preset: 'calm',
  };
  const data: StressData = saved ?? defaults;
  const {
    savings: savingsInput,
    incomeDropPct,
    expenseSpikePct,
    shockExpense,
    freezeWants,
    preset: selectedPreset,
  } = data;

  const update = (patch: Partial<StressData>) => onSavedChange({ ...data, ...patch });
  // A manual change to any input switches out of the ready-made scenario.
  const tweak = (patch: Partial<StressData>) => update({ ...patch, preset: 'custom' });

  // Scenario presets (A, B, C from the slider labels below, plus a calm baseline)
  const scenarioPresets: ScenarioPreset[] = [
    {
      id: 'calm',
      title: "Barqaror / Xotirjam",
      subtitle: "Kutilmagan zarbalarsiz odatiy oy",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      incomeDrop: 0,
      expenseSpike: 0,
      shock: 0,
      badge: "Normal",
      badgeColor: "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    },
    {
      id: 'allowance_cut',
      title: "Cho'ntak puli qisqardi",
      subtitle: "Ota-onam cho'ntak pulini 50% ga qisqartirdi",
      icon: <TrendingDown className="w-4 h-4 text-rose-700 dark:text-rose-400" />,
      incomeDrop: 50,
      expenseSpike: 0,
      shock: 0,
      badge: "Kritik",
      badgeColor: "bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    },
    {
      id: 'inflation',
      title: "Narxlar oshdi",
      subtitle: "Inflyatsiya: transport va tushlik +20% qimmatladi",
      icon: <TrendingUp className="w-4 h-4 text-amber-700 dark:text-amber-400" />,
      incomeDrop: 0,
      expenseSpike: 20,
      shock: 0,
      badge: "O'rtacha",
      badgeColor: "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    },
    {
      id: 'broken_phone',
      title: "Telefon ekrani sindi",
      subtitle: "Kutilmagan bir martalik xarajat",
      icon: <Smartphone className="w-4 h-4 text-purple-700 dark:text-purple-400" />,
      incomeDrop: 0,
      expenseSpike: 0,
      shock: shockPresets[2].val,
      badge: "Zarba",
      badgeColor: "bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    },
  ];

  const applyPreset = (preset: ScenarioPreset) =>
    update({
      preset: preset.id,
      incomeDropPct: preset.incomeDrop,
      expenseSpikePct: preset.expenseSpike,
      shockExpense: preset.shock,
    });

  const resetToBaseline = () => onSavedChange(null);

  // RUNWAY MATH: every line is one step you can explain on a whiteboard.
  const calculations = (() => {
    // Income after the allowance cut.
    const stressedIncome = baselineIncome * (1 - incomeDropPct / 100);

    // Monthly spending = fixed costs + wants (30% fun money), both raised by inflation.
    const inflation = 1 + expenseSpikePct / 100;
    const fixedSpending = baselineExpenses * inflation;
    const wantsSpending = Math.max(0, wants) * inflation;
    const spendingNoFreeze = fixedSpending + wantsSpending;
    const effectiveMonthlyExpenses = freezeWants ? fixedSpending : spendingNoFreeze;

    // A one-off shock (broken phone) is paid from savings right away.
    const postShockSavings = Math.max(0, savingsInput - shockExpense);

    // Runway (months) = savings ÷ monthly shortfall.
    // No shortfall means savings never shrink, so runway is Infinity.
    const runwayFor = (spending: number) => {
      const shortfall = spending - stressedIncome;
      return shortfall > 0 ? postShockSavings / shortfall : Infinity;
    };
    const runwayNoFreeze = runwayFor(spendingNoFreeze);
    const runwayWithFreeze = runwayFor(fixedSpending);
    const runwayMonths = freezeWants ? runwayWithFreeze : runwayNoFreeze;
    const isInfinite = runwayMonths === Infinity;

    // Extra months from freezing wants = runway with freeze − runway without.
    // 0 when you're already stable; Infinity when the freeze removes the shortfall.
    const monthsGainedFromFreeze = runwayNoFreeze === Infinity ? 0 : runwayWithFreeze - runwayNoFreeze;

    const netMonthlyCashflow = stressedIncome - effectiveMonthlyExpenses;
    const isDeficit = netMonthlyCashflow < 0;
    const monthlyBurnRate = Math.max(0, -netMonthlyCashflow);

    // Risk level uses the common 3- and 6-month emergency fund guidelines.
    let riskLevel: 'safe' | 'moderate' | 'danger';
    let riskLabel: string;
    let riskDesc: string;

    if (isInfinite || runwayMonths >= 6) {
      riskLevel = 'safe';
      riskLabel = "Mustahkam Yastiq";
      riskDesc = isInfinite
        ? "Oylik pul oqimi profitsitda: zaxirangiz kamaymaydi, to'liq xavfsizsiz!"
        : "Zaxirangiz 6 oydan ortiq xavfsizlik vaqtini ta'minlaydi. Bosimni oson yengasiz.";
    } else if (runwayMonths >= 3) {
      riskLevel = 'moderate';
      riskLabel = "O'rtacha Xavf";
      riskDesc = "Zaxira 3 dan 6 oygacha chidaydi. Kutilmagan zarbalarga qarshi byudjetni optimallashtirish tavsiya etiladi.";
    } else {
      riskLevel = 'danger';
      riskLabel = "Yuqori Xavf";
      riskDesc = "Kritik holat! Zaxirangiz 3 oydan kam muddatga yetadi. Zudlik bilan xarajatlarni qisqartirish talab etiladi.";
    }

    // The month the savings run out: today + whole months of runway.
    let projectedDateStr: string;
    if (isInfinite) {
      projectedDateStr = "Barqaror / Tugamaydi";
    } else if (runwayMonths === 0) {
      projectedDateStr = "Darhol (Zaxira tugagan)";
    } else if (runwayMonths >= 120) {
      projectedDateStr = "10 yildan ortiq";
    } else {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + Math.floor(runwayMonths));
      projectedDateStr = `${targetDate.getFullYear()}-yil ${uzbekMonths[targetDate.getMonth()]}`;
    }

    return {
      stressedIncome,
      fixedSpending,
      wantsSpending,
      effectiveMonthlyExpenses,
      postShockSavings,
      netMonthlyCashflow,
      isDeficit,
      monthlyBurnRate,
      runwayMonths,
      runwayNoFreeze,
      isInfinite,
      monthsGainedFromFreeze,
      riskLevel,
      riskLabel,
      riskDesc,
      projectedDateStr,
    };
  })();

  // HIGH-CONTRAST RISK THEMES (WCAG AA Compliant in both Light and Dark modes)
  const riskThemes = {
    safe: {
      cardBg: darkMode ? 'bg-emerald-950/40' : 'bg-emerald-50/90',
      border: darkMode ? 'border-emerald-700/80' : 'border-emerald-300',
      badge: 'bg-emerald-700 text-white font-black',
      badgeSoft: darkMode
        ? 'bg-emerald-950 text-emerald-200 border-emerald-700 font-bold'
        : 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold',
      titleText: darkMode ? 'text-emerald-200' : 'text-emerald-950',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    },
    moderate: {
      cardBg: darkMode ? 'bg-amber-950/40' : 'bg-amber-50/90',
      border: darkMode ? 'border-amber-700/80' : 'border-amber-300',
      badge: 'bg-amber-600 text-white font-black',
      badgeSoft: darkMode
        ? 'bg-amber-950 text-amber-200 border-amber-700 font-bold'
        : 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold',
      titleText: darkMode ? 'text-amber-200' : 'text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    },
    danger: {
      cardBg: darkMode ? 'bg-rose-950/40' : 'bg-rose-50/90',
      border: darkMode ? 'border-rose-700/80' : 'border-rose-300',
      badge: 'bg-rose-600 text-white font-black',
      badgeSoft: darkMode
        ? 'bg-rose-950 text-rose-200 border-rose-700 font-bold'
        : 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold',
      titleText: darkMode ? 'text-rose-200' : 'text-rose-950',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
    }
  };

  const currentTheme = riskThemes[calculations.riskLevel];

  // Gauge is full at 12 months (the "12+ oy" end of the bar). Infinity → full.
  const gaugePercent = Math.min(100, Math.round((calculations.runwayMonths / 12) * 100));

  return (
    <section
      id="stresstest"
      aria-labelledby="stresstest-heading"
      className="relative p-6 sm:p-9 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm transition-all duration-300 space-y-8"
    >
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 -z-10 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-sm shrink-0">
            <Activity className="w-6 h-6 text-emerald-700 dark:text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Likvidlik & Xavfsizlik
              </span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 hidden sm:inline">
                • Stress-Test Simulyatori
              </span>
            </div>
            <h2 id="stresstest-heading" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">
              Moliyaviy Stress-Test va Runway Simulyatori
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
              Daromad uzilishi, inflyatsiya va kutilmagan favqulodda xarajatlar sharoitida jamg'armangiz necha oyga yetishini hisoblang.
            </p>
          </div>
        </div>

        {/* Reset Action */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={resetToBaseline}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-sm transition-all"
            title="Barcha ko'rsatkichlarni dastlabki holatga qaytarish"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
            <span>Qayta o'rnatish</span>
          </button>
        </div>
      </div>

      {/* QUICK CRISIS SCENARIO PRESETS BAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-slate-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Tezkor Inqiroz Stsenariylari (1-Click Stress Test):
          </span>
          <span className="text-[11px] text-slate-700 dark:text-slate-400 font-semibold">
            {selectedPreset === 'custom' ? 'Moslashtirilgan rejim' : 'Tayyor shablon faol'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarioPresets.map((preset) => {
            const isActive = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-50/90 border-2 border-emerald-600 dark:bg-emerald-950/50 dark:border-emerald-500 shadow-sm'
                    : 'bg-slate-50/80 border border-slate-200 hover:border-slate-300 dark:bg-slate-800/60 dark:border-slate-700 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {preset.icon}
                    <span className="text-xs font-black text-slate-900 dark:text-slate-50 leading-snug">
                      {preset.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                  {preset.subtitle}
                </p>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 dark:bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: INTERACTIVE CONTROLS (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Cash Cushion Input */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label
                  htmlFor="savings-reserve-input"
                  className="block text-sm font-black text-slate-900 dark:text-slate-50"
                >
                  Mavjud Jamg'arma / Xavfsizlik Zaxirasi
                </label>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium mt-0.5">
                  Kerak bo'lganda darhol ishlata oladigan jamg'armangiz
                </p>
              </div>

              {/* Quick preset chips */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    tweak({ savings: baselineExpenses * 3 });
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    savingsInput === baselineExpenses * 3
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'
                  }`}
                >
                  3 oylik
                </button>
                <button
                  type="button"
                  onClick={() => {
                    tweak({ savings: baselineExpenses * 6 });
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    savingsInput === baselineExpenses * 6
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'
                  }`}
                >
                  6 oylik (Tavsiya)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    tweak({ savings: baselineExpenses * 12 });
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    savingsInput === baselineExpenses * 12
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'
                  }`}
                >
                  12 oylik
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                id="savings-reserve-input"
                type="number"
                min="0"
                step={currency === 'UZS' ? 50000 : 5}
                value={savingsInput}
                onChange={(e) => {
                  tweak({ savings: Math.max(0, Number(e.target.value) || 0) });
                }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-xl font-black outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600">
                {currency}
              </span>
            </div>
          </div>

          {/* 2. Scenario Sliders Container */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 space-y-6 shadow-sm">

            {/* Slider A: Income Drop */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shrink-0">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <label htmlFor="income-drop-slider" className="font-black text-slate-900 dark:text-slate-50 block">
                      Stsenariy A: Cho'ntak Puli Qisqarishi
                    </label>
                    <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                      Ota-onam cho'ntak pulini qisqartirsa yoki yozgi ishim tugasa
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl text-sm font-black border transition-all ${
                      incomeDropPct === 0
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        : incomeDropPct > 50
                        ? 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                    }`}
                  >
                    -{incomeDropPct}%
                  </span>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    Qolgan: {formatAmount(calculations.stressedIncome)}/oy
                  </div>
                </div>
              </div>

              <div className="relative pt-1">
                <input
                  id="income-drop-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={incomeDropPct}
                  onChange={(e) => {
                    tweak({ incomeDropPct: Number(e.target.value) });
                  }}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-400 mt-1.5">
                  <span>0% (Barqaror)</span>
                  <span>25%</span>
                  <span>50% (Yarim daromad)</span>
                  <span>75%</span>
                  <span className="text-rose-700 dark:text-rose-400 font-black">100% (Pul yo'q)</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            {/* Slider B: Expense Spike / Inflation */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <label htmlFor="expense-spike-slider" className="font-black text-slate-900 dark:text-slate-50 block">
                      Stsenariy B: Inflyatsiya va Narxlar Oshishi
                    </label>
                    <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                      Transport, maktab tushligi va mobil internet narxi oshishi
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl text-sm font-black border transition-all ${
                      expenseSpikePct === 0
                        ? 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
                        : expenseSpikePct > 25
                        ? 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                    }`}
                  >
                    +{expenseSpikePct}%
                  </span>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    Xarajat: {formatAmount(calculations.effectiveMonthlyExpenses)}/oy
                  </div>
                </div>
              </div>

              <div className="relative pt-1">
                <input
                  id="expense-spike-slider"
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={expenseSpikePct}
                  onChange={(e) => {
                    tweak({ expenseSpikePct: Number(e.target.value) });
                  }}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-400 mt-1.5">
                  <span>+0% (Muntazam)</span>
                  <span>+15% (O'rtacha)</span>
                  <span>+30% (Yuqori)</span>
                  <span className="text-amber-700 dark:text-amber-400 font-black">+50% (Maksimal)</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            {/* Input C: One-Off Shock Expense */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <label htmlFor="shock-expense-input" className="font-black text-slate-900 dark:text-slate-50 text-sm block">
                    Stsenariy C: Kutilmagan Xarajat (masalan: telefon ekrani sindi)
                  </label>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                    Singan telefon, yo'qolgan quloqchin yoki shoshilinch xarid
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-6 relative">
                  <input
                    id="shock-expense-input"
                    type="number"
                    min="0"
                    step={currency === 'UZS' ? 50000 : 5}
                    value={shockExpense}
                    onChange={(e) => {
                      tweak({ shockExpense: Math.max(0, Number(e.target.value) || 0) });
                    }}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-base font-black outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-purple-900 dark:text-purple-300">
                    {currency}
                  </span>
                </div>

                {/* Quick suggestion chips */}
                <div className="sm:col-span-6 flex flex-wrap gap-1.5">
                  {shockPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        tweak({ shockExpense: preset.val });
                      }}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                        shockExpense === preset.val
                          ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                          : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-purple-50 hover:border-purple-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'
                      }`}
                      title={preset.tag}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle: Freeze Discretionary Spending */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer select-none ${
                freezeWants
                  ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/60 dark:border-emerald-600'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400 dark:bg-slate-800/60 dark:border-slate-700'
              }`}
              onClick={() => update({ freezeWants: !freezeWants })}
              role="switch"
              aria-checked={freezeWants}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  update({ freezeWants: !freezeWants });
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors shrink-0 ${
                    freezeWants
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-slate-50">
                      Inqiroz Chorasi: 30% Istaklarni darhol muzlatish
                    </span>
                    {freezeWants ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                        Faol
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        O'chirilgan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                    Kafe, o'yinlar va kino kabi ixtiyoriy xarajatlarni to'xtatib, qo'shimcha muddat yutish
                  </p>
                </div>
              </div>

              {/* Toggle switch visual */}
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                  freezeWants ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC VISUAL OUTPUT & RUNWAY GAUGE (5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-6">

          {/* MAIN RUNWAY METER CARD */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden space-y-6 ${
              currentTheme.cardBg
            } ${currentTheme.border} shadow-md`}
          >
            {/* Risk Badge Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${currentTheme.badge}`}>
                  {currentTheme.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 block">
                    Xavf Darajasi
                  </span>
                  <span className={`text-base font-black ${currentTheme.titleText}`}>
                    {calculations.riskLabel}
                  </span>
                </div>
              </div>

              <span className={`text-xs px-3 py-1 rounded-full border ${currentTheme.badgeSoft}`}>
                {calculations.isInfinite
                  ? "BARQAROR OQIM"
                  : calculations.runwayMonths >= 6
                  ? "XAVFSIZLIK ZONASI"
                  : calculations.runwayMonths >= 3
                  ? "EHTIYOTKORLIK"
                  : "KRITIK BOSIM"}
              </span>
            </div>

            {/* Hero Number Display */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Moliyaviy Chidamlilik (Runway)
              </span>

              <div className="flex items-baseline justify-center gap-2">
                {calculations.isInfinite ? (
                  <span className="text-4xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-400">
                    Cheksiz
                  </span>
                ) : (
                  <>
                    <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                      {calculations.runwayMonths.toFixed(1)}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200">
                      Oy
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                {calculations.riskDesc}
              </p>
            </div>

            {/* Visual Multi-Segment Runway Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-black text-slate-700 dark:text-slate-300">
                <span>0 oy (Tugash)</span>
                <span>3 oy (Xavf)</span>
                <span>6 oy (Tavsiya)</span>
                <span>12+ oy (Mustahkam)</span>
              </div>

              <div className="h-4 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 p-0.5 border-2 border-slate-300 dark:border-slate-700 relative">
                {/* Visual danger & safe zones background */}
                <div className="absolute inset-0 flex opacity-30 pointer-events-none">
                  <div className="w-[25%] bg-rose-500 border-r border-rose-700" title="Kritik: 0-3 oy" />
                  <div className="w-[25%] bg-amber-500 border-r border-amber-700" title="O'rtacha: 3-6 oy" />
                  <div className="w-[50%] bg-emerald-500" title="Mustahkam: 6+ oy" />
                </div>

                {/* Progress bar fill */}
                <div
                  className={`h-full rounded-full transition-all duration-500 relative z-10 ${
                    calculations.isInfinite
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                      : calculations.riskLevel === 'safe'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                      : calculations.riskLevel === 'moderate'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                      : 'bg-gradient-to-r from-rose-600 to-rose-500'
                  }`}
                  style={{ width: `${calculations.isInfinite ? 100 : Math.max(5, gaugePercent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
                  Zaxiraning yetish sanasi:
                </span>
                <span className="font-black text-slate-900 dark:text-slate-50">
                  {calculations.projectedDateStr}
                </span>
              </div>
            </div>

            {/* Cash Flow Summary Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-400 block">
                  Stressli Daromad
                </span>
                <span className="text-base font-black text-slate-900 dark:text-slate-50 block mt-0.5">
                  {formatAmount(calculations.stressedIncome)}
                </span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">
                  {incomeDropPct > 0 ? `-${incomeDropPct}% yo'qotish` : 'To\'liq daromad'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-400 block">
                  Stressli Xarajat
                </span>
                <span className="text-base font-black text-slate-900 dark:text-slate-50 block mt-0.5">
                  {formatAmount(calculations.effectiveMonthlyExpenses)}
                </span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">
                  {freezeWants ? "Istaklar tejaldi" : `+${expenseSpikePct}% inflyatsiya`}
                </span>
              </div>
            </div>

            {/* Monthly Burn Rate / Deficit Banner */}
            <div
              className={`p-3.5 rounded-2xl border-2 text-xs flex items-center justify-between ${
                calculations.isDeficit
                  ? 'bg-rose-100/90 border-rose-300 text-rose-950 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200'
                  : 'bg-emerald-100/90 border-emerald-300 text-emerald-950 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 shrink-0 ${calculations.isDeficit ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span className="font-black">
                  {calculations.isDeficit ? "Oylik Kamomad (Burn Rate):" : "Oylik Sof Profitsit:"}
                </span>
              </div>
              <span className="font-black text-sm">
                {calculations.isDeficit
                  ? `-${formatAmount(calculations.monthlyBurnRate)}/oy`
                  : `+${formatAmount(calculations.netMonthlyCashflow)}/oy`}
              </span>
            </div>

          </div>

          {/* ACTIONABLE BREAKDOWN & TACTICAL RECOMMENDATIONS */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                Inqirozga Qarshi Harakatlar Rejasi
              </h3>
            </div>

            <div className="space-y-3">
              {/* 1. Discretionary Spending Freeze Insight */}
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                  freezeWants
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                    : 'bg-amber-50/90 border-amber-300 text-amber-950 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-black">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    30% Istaklarni muzlatish effekti:
                  </span>
                  {/* Real value from the runway math, never a placeholder */}
                  <span className="font-black text-emerald-700 dark:text-emerald-300">
                    {calculations.monthsGainedFromFreeze === Infinity
                      ? "Kamomad yo'qoladi"
                      : calculations.monthsGainedFromFreeze > 0
                      ? `+${calculations.monthsGainedFromFreeze.toFixed(1)} Oy yutug'i`
                      : "0 Oy"}
                  </span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed">
                  {calculations.runwayNoFreeze === Infinity
                    ? "Hozir daromadingiz xarajatlarni qoplaydi — istaklarni muzlatish shart emas."
                    : freezeWants
                    ? `Siz har oy ${formatAmount(calculations.wantsSpending)} tejab, zaxirangiz umrini uzaytirdingiz.`
                    : "Kafe, o'yin va ko'ngilochar xarajatlarni to'xtatib, zaxira muddatini uzaytirish mumkin."}
                </p>
              </div>

              {/* 2. Shock Absorption Remaining Card */}
              {shockExpense > 0 && (
                <div className="p-3.5 rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/90 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-black">
                    <span>Kutilmagan zarbadan so'ng qolgan zaxira:</span>
                    <span className="font-black text-purple-900 dark:text-purple-300">{formatAmount(calculations.postShockSavings)}</span>
                  </div>
                  <p className="text-[11px] font-medium">
                    Dastlabki {formatAmount(savingsInput)} zaxiradan {formatAmount(shockExpense)} kutilmagan to'lovga sarflandi.
                  </p>
                </div>
              )}

              {/* 3. Essential Needs Baseline */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between font-black text-slate-900 dark:text-slate-100">
                  <span>Majburiy Xarajat (muzlatib bo'lmaydi):</span>
                  <span className="font-black">{formatAmount(calculations.fixedSpending)}/oy</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">
                  Transport, maktab tushligi va mobil internet — bu eng so'nggi daxlsiz chiziq.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER TIP */}
      <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-xs text-emerald-950 dark:text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <p className="leading-relaxed font-medium">
            <strong className="font-black">Maslahat:</strong> Kamida{' '}
            <span className="font-black underline decoration-emerald-500">3–6 oylik xarajatingizga teng</span> jamg'arma
            kutilmagan holatda ota-onangizdan yoki do'stlaringizdan qarz so'ramaslikka yordam beradi.
          </p>
        </div>

        <a
          href="#yastiqcha"
          className="inline-flex items-center gap-1 font-black text-emerald-800 dark:text-emerald-300 hover:underline shrink-0"
        >
          <span>Yostiqchani to'ldirish</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};

export default StressTestSimulator;
