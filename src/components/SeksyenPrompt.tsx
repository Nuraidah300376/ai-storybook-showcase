import { AnimatePresence, motion } from 'motion/react'
import { MASTER_PROMPT, STATUS_PROMPT } from '../data/masterPrompt'
import { useSalin } from '../hooks/useSalin'
import { IkonSalin, IkonTanda } from './Ikon'
import { KepalaSeksyen } from './KepalaSeksyen'

export function SeksyenPrompt() {
  const { status, salin } = useSalin()
  const mesej = status === 'berjaya' ? 'Prompt disalin!' : status === 'gagal' ? 'Gagal menyalin' : 'Salin Prompt'

  return (
    <section id="prompt" aria-labelledby="tajuk-prompt" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <KepalaSeksyen
        id="tajuk-prompt"
        label="Kongsi Master Prompt"
        tajuk={
          <>
            Satu prompt di sebalik <span className="teks-emas">buku ini</span>
          </>
        }
        huraian="Salin master prompt dan cuba sendiri dengan alat AI pilihan anda."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl"
      >
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emas-400/50 via-white/5 to-zamrud-500/50" />
        <div className="relative overflow-hidden rounded-3xl bg-navy-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-3 rounded-full bg-emas-400/80" />
                <span className="size-3 rounded-full bg-zamrud-400/80" />
                <span className="size-3 rounded-full bg-white/30" />
              </span>
              <span className="text-sm font-semibold text-slate-300">master-prompt.txt</span>
              {STATUS_PROMPT === 'draf' && (
                <span className="rounded-full border border-emas-400/40 bg-emas-400/10 px-2 py-0.5 text-[0.7rem] text-emas-300">
                  Templat draf
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => salin(MASTER_PROMPT)}
              className={status === 'berjaya' ? 'butang-zamrud' : 'butang-emas'}
            >
              {status === 'berjaya' ? <IkonTanda /> : <IkonSalin />}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mesej}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {mesej}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <pre className="max-h-[28rem] overflow-auto p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-200 sm:p-7 sm:text-[0.95rem]">
            {MASTER_PROMPT}
          </pre>
          <p className="sr-only" aria-live="polite">
            {status === 'berjaya' ? 'Prompt telah disalin ke papan keratan.' : status === 'gagal' ? 'Prompt gagal disalin.' : ''}
          </p>
        </div>
      </motion.div>
    </section>
  )
}
