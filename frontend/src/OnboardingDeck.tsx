import { useState, type MouseEvent } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'motion/react'

type Provider = 'google' | 'github'

type Step = {
    id: number
    title: string
    provider: Provider
    cta: string
    colors: { from: string; to: string; light: string }
}

/** SignalX Brand Design System — onboarding tokens */
const STEPS: Step[] = [
    {
        id: 1,
        title: 'Connect Google',
        provider: 'google',
        cta: 'Connect Google',
        colors: { from: '#2563EB', to: '#1E40AF', light: '#93C5FD' },
    },
    {
        id: 2,
        title: 'Connect GitHub',
        provider: 'github',
        cta: 'Connect GitHub',
        colors: { from: '#8036CB', to: '#5B21B6', light: '#E9D5FF' },
    },
]

const SWIPE_THRESHOLD = 120

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.415 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z" />
        <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z" />
        <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z" />
    </svg>
)

const GitHubIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
)

const OnboardingDeck = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [exitDir, setExitDir] = useState(1)
    const [completed, setCompleted] = useState(false)
    const [connected, setConnected] = useState<Record<Provider, boolean>>({
        google: false,
        github: false,
    })

    const step = STEPS[currentStep]
    const nextStep = STEPS[currentStep + 1]
    const isLast = currentStep >= STEPS.length - 1

    const advance = (dir = 1) => {
        setExitDir(dir)
        if (isLast) {
            setCompleted(true)
            return
        }
        setCurrentStep((prev) => prev + 1)
    }

    const goBack = () => {
        if (completed) {
            setCompleted(false)
            setCurrentStep(STEPS.length - 1)
            return
        }
        if (currentStep === 0) return
        setExitDir(-1)
        setCurrentStep((prev) => prev - 1)
    }

    const handleConnect = (provider: Provider, e?: MouseEvent) => {
        e?.stopPropagation()
        setConnected((prev) => ({ ...prev, [provider]: true }))
        setTimeout(() => advance(1), 400)
    }

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > 600) {
            advance(info.offset.x > 0 ? 1 : -1)
        }
    }

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] bg-[#FAFAFA] justify-center items-center overflow-hidden gap-8 px-4">
            <div className="relative w-full max-w-[400px] h-[520px]" style={{ perspective: 1400 }}>
                <AnimatePresence mode="wait">
                    {completed ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                            className="absolute inset-0 rounded-2xl bg-white shadow-2xl border border-[#D9D9D9] flex flex-col items-center justify-center text-center p-10"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">You&apos;re in</h2>

                            <div className="flex flex-col gap-3 w-full max-w-[280px] mb-4">
                                {connected.google && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                                        className="flex items-center gap-3 rounded-[8px] border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-3 text-left"
                                    >
                                        <span className="text-3xl" aria-hidden>
                                            😊
                                        </span>
                                        <div>
                                            <p className="text-[14px] font-semibold text-gray-900">Google connected</p>
                                            <p className="text-[12px] text-gray-500">Outbound identity ready</p>
                                        </div>
                                    </motion.div>
                                )}
                                {connected.github && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.12 }}
                                        className="flex items-center gap-3 rounded-[8px] border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-3 text-left"
                                    >
                                        <span className="text-3xl" aria-hidden>
                                            ❤️
                                        </span>
                                        <div>
                                            <p className="text-[14px] font-semibold text-gray-900">GitHub connected</p>
                                            <p className="text-[12px] text-gray-500">Contributor signals unlocked</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <p className="text-gray-500 text-sm max-w-[260px]">
                                SignalX can start pulling contributor signals.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.hash = '#/scan'
                                }}
                                className="mt-8 px-5 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #2563EB, #8036CB)' }}
                            >
                                Open Contributors
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {nextStep && (
                                <div
                                    className="absolute inset-0 rounded-2xl scale-[0.96] translate-y-3 opacity-90 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(135deg, ${nextStep.colors.from}, ${nextStep.colors.to})`,
                                        zIndex: 0,
                                    }}
                                    aria-hidden
                                />
                            )}

                            <motion.div
                                key={step.id}
                                className="absolute inset-0 z-10"
                                initial={{ opacity: 0, x: exitDir > 0 ? 56 : -56, rotate: exitDir > 0 ? 4 : -4 }}
                                animate={{ opacity: 1, x: 0, rotate: 0 }}
                                exit={{
                                    opacity: 0,
                                    x: exitDir > 0 ? 280 : -280,
                                    rotate: exitDir > 0 ? 18 : -18,
                                    transition: { duration: 0.35 },
                                }}
                                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.85}
                                dragMomentum={false}
                                onDragEnd={onDragEnd}
                            >
                                <div
                                    className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-between p-8 text-white text-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${step.colors.from}, ${step.colors.to})`,
                                        boxShadow: `0 25px 50px -12px ${step.colors.from}66`,
                                    }}
                                >
                                    <div className="flex flex-col items-center pt-10">
                                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                            <span className="text-2xl font-bold">{step.id}</span>
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight">{step.title}</h2>
                                    </div>

                                    {/* Login-style OAuth CTA */}
                                    <div className="w-full pb-2">
                                        {step.provider === 'google' ? (
                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.98 }}
                                                whileHover={{ y: -1 }}
                                                onClick={(e) => handleConnect('google', e)}
                                                className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium text-[15px] py-3 px-4 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition"
                                            >
                                                <GoogleIcon />
                                                {connected.google ? 'Connected…' : step.cta}
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.98 }}
                                                whileHover={{ y: -1 }}
                                                onClick={(e) => handleConnect('github', e)}
                                                className="w-full flex items-center justify-center gap-3 font-medium text-[15px] py-3 px-4 rounded-lg shadow-md border transition hover:opacity-95"
                                                style={{
                                                    backgroundColor: '#24292F',
                                                    color: '#ffffff',
                                                    borderColor: 'rgba(255,255,255,0.12)',
                                                }}
                                            >
                                                <GitHubIcon />
                                                {connected.github ? 'Connected…' : step.cta}
                                            </motion.button>
                                        )}
                                        <p className="mt-4 text-xs tracking-wide uppercase" style={{ color: step.colors.light }}>
                                            Or swipe for next
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {!completed && (
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className="w-10 h-10 rounded-lg border border-[#D9D9D9] bg-white flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                        aria-label="Previous"
                    >
                        ←
                    </button>

                    <div className="flex items-center gap-2">
                        {STEPS.map((s, i) => (
                            <div
                                key={s.id}
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                    width: i === currentStep ? 28 : 8,
                                    backgroundColor:
                                        i === currentStep
                                            ? step.colors.from
                                            : i < currentStep
                                              ? '#8036CB'
                                              : '#D9D9D9',
                                }}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => handleConnect(step.provider)}
                        className="w-10 h-10 rounded-lg border border-[#D9D9D9] bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50"
                        aria-label="Next"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    )
}

export default OnboardingDeck
