import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 font-sans">
            <Head title="Log in" />

            {/* Left Side: Login Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 min-h-screen md:min-h-0 bg-white dark:bg-slate-900">
                {/* Brand Header */}
                <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-sky-50 dark:bg-slate-800 rounded-xl">
                        <ApplicationLogo className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                    </div>
                    <span className="font-black text-lg text-slate-900 dark:text-white tracking-wider uppercase">DAILY</span>
                </div>

                {/* Form Wrapper */}
                <div className="max-w-md w-full mx-auto my-auto py-10 md:py-0">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Welcome Back!
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Please enter log in details below
                    </p>

                    {status && (
                        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-semibold text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/35 dark:text-emerald-300">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Enter your mail"
                                className="w-full px-4 py-3 bg-[#f8fafc] border border-transparent rounded-2xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all text-slate-850 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                                autoComplete="username"
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    placeholder="Enter your password"
                                    className="w-full pl-4 pr-10 py-3 bg-[#f8fafc] border border-transparent rounded-2xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all text-slate-850 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                            <label className="flex items-center select-none cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-slate-600 dark:text-slate-400 font-semibold">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sky-600 hover:text-sky-750 font-bold dark:text-sky-400 transition"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-[#034458] hover:bg-[#0b4e63] active:bg-[#012d3d] text-white rounded-2xl font-bold transition duration-200 shadow-md text-sm tracking-wide mt-6 disabled:opacity-50"
                        >
                            Log in
                        </button>
                    </form>

                    {/* Or Divider */}
                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold tracking-wider">Or</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center space-x-2 py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center space-x-2 py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300"
                        >
                            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="text-sky-600 hover:text-sky-750 font-bold dark:text-sky-400 transition"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>

            {/* Right Side: Visual Mockup Showcase */}
            <div className="hidden md:flex md:w-1/2 bg-[#034458] flex-col justify-between p-16 text-white relative overflow-hidden">
                {/* Background Grid Pattern Decoration */}
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute top-10 right-10 w-24 h-24 bg-white/20 rounded-2xl blur-xl"></div>
                    <div className="absolute bottom-20 left-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}></div>
                </div>

                {/* Header branding on right */}
                <div className="z-10">
                    <h3 className="text-2xl font-extrabold tracking-wide uppercase">Inventory Management</h3>
                    <p className="text-sm text-slate-200 max-w-sm mt-3.5 leading-relaxed">
                        Join our platform to streamline your inventory processes, reduce costs, and enhance productivity.
                    </p>
                </div>

                {/* Tilted Dashboard Component Mockup */}
                <div className="relative mt-8 flex-1 flex items-center justify-center z-10">
                    {/* Shadow overlay card for depth */}
                    <div 
                        className="absolute bottom-[-15%] right-[-15%] w-[125%] aspect-video bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-6 border border-slate-100/10 flex flex-col gap-5 origin-bottom-right transition-transform duration-500 hover:scale-[1.02] cursor-default select-none"
                        style={{
                            transform: 'rotate(-10deg) skewX(-4deg) translateY(20px)',
                        }}
                    >
                        {/* Mock Title Bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-6.5 h-6.5 rounded-xl bg-sky-600/10 flex items-center justify-center border border-sky-600/25">
                                    <ApplicationLogo className="w-3.5 h-3.5 text-sky-600" />
                                </div>
                                <span className="font-extrabold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider">DAILY</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                <div className="w-6 h-6 rounded-full bg-slate-150 dark:bg-slate-800 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-700"></div>
                                </div>
                            </div>
                        </div>

                        {/* Split Sidebar & Content */}
                        <div className="flex-1 flex gap-5 min-h-0">
                            {/* Sidebar Mock */}
                            <div className="w-1/4 flex flex-col gap-2.5 border-r border-slate-100 dark:border-slate-800 pr-3.5">
                                <div className="h-5 bg-sky-500/10 rounded-xl"></div>
                                <div className="h-5 bg-slate-50 dark:bg-slate-800/35 rounded-xl"></div>
                                <div className="h-5 bg-slate-50 dark:bg-slate-800/35 rounded-xl"></div>
                                <div className="h-5 bg-slate-50 dark:bg-slate-800/35 rounded-xl"></div>
                            </div>
                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                                {/* Dashboard Cards */}
                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="bg-slate-50 dark:bg-slate-800/35 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                                        <div className="w-4 h-4 rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sky-600 mb-2 flex items-center justify-center text-[9px] font-bold">1</div>
                                        <div className="h-1.5 w-10 bg-slate-300 dark:bg-slate-700 rounded-full mb-1"></div>
                                        <div className="h-2 w-14 bg-slate-900 dark:bg-white rounded-full"></div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/35 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                                        <div className="w-4 h-4 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 mb-2 flex items-center justify-center text-[9px] font-bold">2</div>
                                        <div className="h-1.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full mb-1"></div>
                                        <div className="h-2 w-10 bg-slate-900 dark:bg-white rounded-full"></div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/35 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                                        <div className="w-4 h-4 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 mb-2 flex items-center justify-center text-[9px] font-bold">3</div>
                                        <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-700 rounded-full mb-1"></div>
                                        <div className="h-2 w-12 bg-slate-900 dark:bg-white rounded-full"></div>
                                    </div>
                                </div>
                                {/* Graph Visual Panel */}
                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/35 rounded-2xl border border-slate-100/50 dark:border-slate-800 p-3.5 flex flex-col justify-between">
                                    <span className="text-[9px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider block">Analytics</span>
                                    {/* Graph SVG mockup line */}
                                    <div className="h-16 relative flex items-end">
                                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                            <path d="M0 35 Q15 15 30 25 T60 10 T90 20 T100 5 L100 40 L0 40 Z" fill="url(#grad)" opacity="0.15" />
                                            <path d="M0 35 Q15 15 30 25 T60 10 T90 20 T100 5" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
                                            <defs>
                                                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#0284c7" />
                                                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex justify-between text-[7px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Corner shapes */}
                <div className="absolute bottom-4 left-4 flex gap-1 z-10 opacity-30">
                    <div className="w-3 h-3 bg-white/20 rounded-xs"></div>
                    <div className="w-3 h-3 bg-white/10 rounded-xs"></div>
                </div>
            </div>
        </div>
    );
}
