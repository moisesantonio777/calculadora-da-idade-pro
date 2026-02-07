
import React from 'react';
import { supabase } from '../.vscode/lib/supabaseClient';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

interface AuthProps {
    isDark: boolean;
}

const Auth: React.FC<AuthProps> = ({ isDark }) => {
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
            <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <i className="fa-solid fa-cake-candles text-white text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold">Calculadora Pro</h2>
                    <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Faça login para continuar
                    </p>
                </div>

                <SupabaseAuth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#2563eb',
                                    brandAccent: '#1d4ed8',
                                    inputText: isDark ? '#ffffff' : '#000000',
                                    inputBackground: isDark ? '#1e293b' : '#ffffff',
                                    inputBorder: isDark ? '#334155' : '#e2e8f0',
                                    inputPlaceholder: isDark ? '#64748b' : '#94a3b8',
                                },
                            },
                        },
                        className: {
                            container: 'w-full',
                            button: 'rounded-xl font-bold py-3 transition-all active:scale-95',
                            input: 'rounded-xl px-4 py-3 transition-all',
                            label: 'text-xs font-bold uppercase tracking-wider mb-1 opacity-70',
                            anchor: 'text-blue-500 font-semibold hover:text-blue-400 transition-colors',
                        }
                    }}
                    providers={[]}
                    theme={isDark ? 'dark' : 'default'}
                    localization={{
                        variables: {
                            sign_in: {
                                email_label: 'E-mail',
                                password_label: 'Senha',
                                button_label: 'Entrar',
                                loading_button_label: 'Entrando...',
                                email_input_placeholder: 'seu@email.com',
                                password_input_placeholder: 'Sua senha',
                                link_text: 'Já tem uma conta? Entre aqui',
                            },
                            sign_up: {
                                email_label: 'E-mail',
                                password_label: 'Senha',
                                button_label: 'Cadastrar',
                                loading_button_label: 'Cadastrando...',
                                email_input_placeholder: 'seu@email.com',
                                password_input_placeholder: 'Sua senha',
                                link_text: 'Não tem conta? Cadastre-se',
                            },
                            forgotten_password: {
                                email_label: 'E-mail',
                                button_label: 'Recuperar Senha',
                                link_text: 'Esqueceu sua senha?',
                            },
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Auth;

