/**
 * Master prompt sebenar yang digunakan untuk menghasilkan buku ini.
 *
 * Kandungan dibaca terus daripada `prompts/MASTER-PROMPT-BUKU-CERITA.md`
 * semasa binaan, supaya aplikasi sentiasa memaparkan versi asal repositori.
 */
import teksPrompt from '../../prompts/MASTER-PROMPT-BUKU-CERITA.md?raw'

export const MASTER_PROMPT = teksPrompt.trim()

/** Baris pertama fail: tajuk rasmi master prompt. */
export const TAJUK_PROMPT = MASTER_PROMPT.split('\n')[0].trim()

/** Pautan awam master prompt di GitHub (dikodkan dalam kod QR). */
export const URL_PROMPT =
  'https://github.com/Nuraidah300376/ai-storybook-showcase/blob/main/prompts/MASTER-PROMPT-BUKU-CERITA.md'
