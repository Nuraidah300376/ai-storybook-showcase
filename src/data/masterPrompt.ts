/**
 * Master prompt yang dikongsi dalam aplikasi dan di halaman MASTER PROMPT PENUH.
 *
 * Kandungan dibaca daripada `kandungan/master-prompt.txt` (fail teks biasa,
 * jadi simbol seperti ` dan ${ tidak perlu di-escape). Tampal master prompt
 * asal yang lengkap di antara baris penanda dalam fail itu.
 *
 * Selagi ruang itu kosong, `PROMPT_TERSEDIA` bernilai false dan antara muka
 * memaparkan status "MASTER PROMPT BELUM DIMASUKKAN" — tiada teks draf dipaparkan.
 */
import mentah from '../../kandungan/master-prompt.txt?raw'
import { ekstrakPrompt } from '../lib/prompt'

export const TAJUK_PROMPT = 'MASTER PROMPT PREMIUM — BUKU CERITA BERGAMBAR BERHALAMAN'

export const MASTER_PROMPT = ekstrakPrompt(mentah)

export const PROMPT_TERSEDIA = MASTER_PROMPT.length > 0

/** Laluan fail untuk dipaparkan dalam arahan kepada pemilik. */
export const LOKASI_FAIL_PROMPT = 'kandungan/master-prompt.txt'
