
import React from 'react';
import { DateParts } from '../../types';

interface DateInputGroupProps {
  label: string;
  values: DateParts;
  onChange: (field: keyof DateParts, value: string) => void;
  icon: string;
  isDark?: boolean;
}

const DateInputGroup: React.FC<DateInputGroupProps> = ({ label, values, onChange, icon, isDark }) => {
  return (
    <div className="space-y-3">
      <label className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
        <i className={`${icon} ${isDark ? 'text-blue-400' : 'text-blue-500'}`}></i>
        {label}
      </label>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            placeholder="DD"
            value={values.day}
            onChange={(e) => onChange('day', e.target.value)}
            className={`w-full px-4 py-2 text-center rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all border ${isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300'
              }`}
            min="1"
            max="31"
          />
          <span className={`text-[10px] text-center font-medium uppercase tracking-wider transition-colors ${isDark ? 'text-slate-600' : 'text-slate-400'
            }`}>Dia</span>
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="number"
            placeholder="MM"
            value={values.month}
            onChange={(e) => onChange('month', e.target.value)}
            className={`w-full px-4 py-2 text-center rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all border ${isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300'
              }`}
            min="1"
            max="12"
          />
          <span className={`text-[10px] text-center font-medium uppercase tracking-wider transition-colors ${isDark ? 'text-slate-600' : 'text-slate-400'
            }`}>Mês</span>
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="number"
            placeholder="AAAA"
            value={values.year}
            onChange={(e) => onChange('year', e.target.value)}
            className={`w-full px-4 py-2 text-center rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all border ${isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300'
              }`}
            min="1"
          />
          <span className={`text-[10px] text-center font-medium uppercase tracking-wider transition-colors ${isDark ? 'text-slate-600' : 'text-slate-400'
            }`}>Ano</span>
        </div>
      </div>
    </div>
  );
};

export default DateInputGroup;
