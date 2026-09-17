import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { resendOtp, verifyOtp } from '../../api/auth.api';
import { useAuth } from '../../Context/AuthContext';
// import { toast } from 'react-hot-toast';

const VerifyOtp = () => {
  const OTP_EXPIRY_SECONDS = 5 * 60;
  const { theme, toggleTheme } = useTheme();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState(OTP_EXPIRY_SECONDS);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const email = params.get('email') || 'your email address';
  const {otpId} = useAuth();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!expiresIn) return undefined;
    const timer = window.setInterval(() => {
      setExpiresIn((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresIn]);

  const formattedExpiry = `${String(Math.floor(expiresIn / 60)).padStart(2, '0')}:${String(expiresIn % 60).padStart(2, '0')}`;

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    setError('');

    if (digit && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedCode = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pastedCode) return;
    event.preventDefault();
    const nextCode = pastedCode.split('').concat(['', '', '', '']).slice(0, 4);
    setCode(nextCode);
    inputRefs.current[Math.min(pastedCode.length, 4) - 1]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!expiresIn) {
      setError('This code has expired. Request a new code to continue.');
      return;
    }

    const otp = code.join('');
    const verify = await verifyOtp(otp, otpId);
    console.log(verify)
    if (verify?.success) {
      navigate('/login?verified=true', { replace: true });
      return;
    }
    setError(verify?.error || verify?.message || 'Invalid OTP');
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setError('');
    setResendMessage('');

    const response = await resendOtp(otpId);
    setResending(false);

    if (response?.success === false) {
      setError(response.message || 'Unable to resend the code. Please try again.');
      return;
    }

    setCode(['', '', '', '']);
    setExpiresIn(OTP_EXPIRY_SECONDS);
    setResendMessage('A new code has been sent.');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#EEEEF3] dark:bg-cyber-dark text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-cyber-dark border-b border-slate-200/80 dark:border-slate-800 py-3 px-6 md:px-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple flex items-center justify-center shadow-md shadow-purple-500/20">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">InvoiceFlow</span>
        </Link>
        <button onClick={toggleTheme} className="flex items-center justify-center p-2 rounded-lg border bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900/60 dark:border-slate-700 dark:text-neon-cyan transition-all" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-5 md:p-8 relative overflow-hidden">
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-violet-300/20 dark:bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-indigo-300/20 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white dark:bg-cyber-card rounded-3xl shadow-xl shadow-slate-300/40 dark:shadow-black/40 border border-slate-200/60 dark:border-slate-800 overflow-hidden relative">
          <div className="h-1.5 bg-gradient-to-r from-[#7F22FE] via-[#6f1ee8] to-[#5248cc]" />
          <div className="p-8 md:p-10 text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-[#7F22FE] to-[#5248cc] flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 10V8a4 4 0 00-8 0v2m-2 0h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14v2" />
              </svg>
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#7F22FE] dark:text-violet-300 mb-2">One last step</p>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Verify your email</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">We sent a four-digit code to <span className="font-bold text-slate-700 dark:text-slate-200">{email}</span>.</p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { inputRefs.current[index] = element; }}
                    value={digit}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Verification digit ${index + 1}`}
                    className="h-14 w-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 text-center text-2xl font-extrabold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#7F22FE] dark:focus:border-neon-cyan focus:ring-4 focus:ring-[#7F22FE]/10 dark:focus:ring-neon-cyan/15 transition-all"
                  />
                ))}
              </div>

              {error && <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
              {resendMessage && <p className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{resendMessage}</p>}
              <p className={`mt-4 text-sm font-semibold ${expiresIn ? 'text-slate-500 dark:text-slate-400' : 'text-red-600 dark:text-red-400'}`}>
                {expiresIn ? `Code expires in ${formattedExpiry}` : 'This code has expired.'}
              </p>

              <button type="submit" disabled={!expiresIn} className="mt-7 w-full py-3 rounded-xl font-bold text-sm bg-[#7F22FE] hover:bg-[#6b1fd8] text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">Verify email</button>
            </form>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Didn&apos;t receive it?{' '}
              <button type="button" onClick={handleResend} disabled={resending} className="font-bold text-[#7F22FE] dark:text-violet-300 disabled:text-slate-400 disabled:cursor-not-allowed">{resending ? 'Sending...' : 'Resend code'}</button>
            </p>
            <Link to="/register" className="mt-5 inline-block text-xs font-bold text-slate-500 hover:text-[#7F22FE] dark:text-slate-400 dark:hover:text-violet-300">Back to registration</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;