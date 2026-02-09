
import React, { useState, useCallback, useEffect } from 'react';
import { DateParts, AgeResult, ValidationError } from './types';
import { isValidDate, partsToDate, calculatePreciseAge, getZodiacSign } from './utils/dateLogic';
import DateInputGroup from './components/DateInputGroup';
import Auth from './components/Auth';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<DateParts>({ day: '', month: '', year: '' });
  const [targetDate, setTargetDate] = useState<DateParts>({ day: '', month: '', year: '' });
  const [result, setResult] = useState<(AgeResult & { zodiac: string }) | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  // Handle Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize target date with today's date
  useEffect(() => {
    const today = new Date();
    setTargetDate({
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
    });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleBirthChange = (field: keyof DateParts, value: string) => {
    setBirthDate(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleTargetChange = (field: keyof DateParts, value: string) => {
    setTargetDate(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleClear = () => {
    setBirthDate({ day: '', month: '', year: '' });
    const today = new Date();
    setTargetDate({
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
    });
    setResult(null);
    setError(null);
  };

  const setToCurrentDate = () => {
    const today = new Date();
    setTargetDate({
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
    });
    setError(null);
  };

  const handleCalculate = useCallback(() => {
    const allFilled = (p: DateParts) => p.day && p.month && p.year;

    if (!allFilled(birthDate)) {
      setError({ field: 'birth', message: 'Por favor, preencha todos os campos da data de nascimento.' });
      return;
    }
    if (!allFilled(targetDate)) {
      setError({ field: 'target', message: 'Por favor, preencha todos os campos da data de cálculo.' });
      return;
    }

    if (!isValidDate(birthDate)) {
      setError({ field: 'birth', message: 'A data de nascimento informada é inválida (ex: 31/02).' });
      return;
    }
    if (!isValidDate(targetDate)) {
      setError({ field: 'target', message: 'A data de cálculo informada é inválida.' });
      return;
    }

    const birth = partsToDate(birthDate);
    const target = partsToDate(targetDate);

    if (target < birth) {
      setError({ message: 'A data de cálculo não pode ser anterior à data de nascimento.' });
      return;
    }

    const age = calculatePreciseAge(birth, target);
    const zodiac = getZodiacSign(birth.getDate(), birth.getMonth() + 1);

    setResult(null);
    setTimeout(() => {
      setResult({ ...age, zodiac });
      setError(null);
    }, 10);
  }, [birthDate, targetDate]);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all z-50 ${isDark ? 'bg-slate-800 text-yellow-400 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200'
          } hover:scale-110 active:scale-95`}
        title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      >
        <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
      </button>

      {/* Sign Out Button */}
      {session && (
        <button
          onClick={handleSignOut}
          className={`fixed top-6 left-6 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all z-50 font-bold text-sm ${isDark ? 'bg-slate-800 text-red-400 border border-slate-700' : 'bg-white text-red-600 border border-slate-200'
            } hover:scale-105 active:scale-95`}
          title="Sair da Conta"
        >
          <i className="fa-solid fa-sign-out-alt"></i>
          <span className="hidden sm:inline">Sair</span>
        </button>
      )}

      <SpeedInsights />
      
      {!session ? (
        <Auth isDark={isDark} />
      ) : (
        <div className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grad1)" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl mb-4 border border-white/30 shadow-inner">
                <i className="fa-solid fa-cake-candles text-white text-4xl"></i>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Calculadora de Idade</h1>
              <p className="text-blue-100 text-sm font-medium opacity-90 uppercase tracking-widest">Precisão de Tempo e Calendário</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-10 space-y-10">

            <DateInputGroup
              label="Sua Data de Nascimento"
              values={birthDate}
              onChange={handleBirthChange}
              icon="fa-solid fa-baby"
              isDark={isDark}
            />

            <div className="relative flex items-center">
              <div className={`flex-grow border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}></div>
              <span className={`flex-shrink mx-4 text-xs font-bold uppercase tracking-tighter italic ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>Cálculo para</span>
              <div className={`flex-grow border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}></div>
            </div>

            <div className="relative">
              <DateInputGroup
                label="Calcular Idade na Data:"
                values={targetDate}
                onChange={handleTargetChange}
                icon="fa-solid fa-calendar-day"
                isDark={isDark}
              />
              <button
                onClick={setToCurrentDate}
                className={`absolute right-0 top-0 text-[10px] px-3 py-1.5 rounded-full font-bold transition-all border active:scale-95 ${isDark
                  ? 'bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-300 border-indigo-800'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-100'
                  }`}
              >
                <i className="fa-solid fa-clock-rotate-left mr-1"></i>
                Hoje
              </button>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className={`flex items-center gap-4 p-5 border-l-4 rounded-xl animate-shake ${isDark ? 'bg-red-900/20 border-red-500 text-red-200' : 'bg-red-50 border-red-500 text-red-800'
                }`}>
                <div className="bg-red-500 rounded-full p-2">
                  <i className="fa-solid fa-xmark text-white text-xs"></i>
                </div>
                <p className="text-sm font-semibold">{error.message}</p>
              </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleClear}
                className={`font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border ${isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  }`}
              >
                <i className="fa-solid fa-eraser"></i>
                Limpar
              </button>
              <button
                onClick={handleCalculate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-play"></i>
                Calcular
              </button>
            </div>

            {/* Result Visualization */}
            {result && !error && (
              <div className="mt-8 space-y-4 animate-fade-in-up">
                <div className={`rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group ${isDark ? 'bg-slate-800' : 'bg-slate-900'
                  }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i className="fa-solid fa-star text-6xl"></i>
                  </div>

                  <div className="text-center relative z-10">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">Sua idade será</span>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-6xl font-black">{result.years}</span>
                      <span className="text-2xl font-bold text-slate-400">Anos</span>
                    </div>

                    {(result.months > 0 || result.days > 0) && (
                      <p className="text-slate-400 mt-2 font-medium">
                        {result.months > 0 && <span>{result.months} {result.months === 1 ? 'mês' : 'meses'}</span>}
                        {result.months > 0 && result.days > 0 && <span className="mx-2 opacity-50">&</span>}
                        {result.days > 0 && <span>{result.days} {result.days === 1 ? 'dia' : 'dias'}</span>}
                      </p>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                      <div className="text-left">
                        <span className={`block text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Signo</span>
                        <span className="font-bold text-indigo-300">{result.zodiac}</span>
                      </div>
                      <div className="text-right">
                        <span className={`block text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Status</span>
                        <span className="font-bold text-emerald-400">Calculado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl text-center border transition-colors ${isDark ? 'bg-indigo-900/20 border-indigo-900 text-indigo-200' : 'bg-indigo-50 border-indigo-100 text-indigo-900'
                  }`}>
                  <p className="text-sm leading-relaxed">
                    "Na data <span className="font-bold text-indigo-500">{result.targetDateFormatted}</span>,
                    a pessoa terá <span className="font-bold text-indigo-500 underline decoration-indigo-200 underline-offset-4">{result.years} anos</span> de idade."
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`px-10 py-6 text-center border-t transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
            <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Cálculo baseado no calendário civil padrão.<br />
              Desenvolvido para máxima precisão e usabilidade.
            </p>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;
