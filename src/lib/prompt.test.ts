import { describe, expect, it } from 'vitest'
import mentah from '../../kandungan/master-prompt.txt?raw'
import { PENANDA_MULA, PENANDA_TAMAT, ekstrakPrompt, statistikPrompt } from './prompt'

const fail = (isi: string) => `Arahan pemilik\n\n${PENANDA_MULA}\n${isi}\n${PENANDA_TAMAT}\nNota akhir`

describe('ekstrakPrompt', () => {
  it('mengambil hanya teks di antara penanda, tepat seperti ditampal', () => {
    const isi = 'BAHAGIAN 1\n  - inden dikekalkan\n\nSimbol: ` ${x} "petikan" →'
    expect(ekstrakPrompt(fail(`\n\n${isi}\n\n`))).toBe(isi)
  })

  it('menyokong hujung baris Windows', () => {
    expect(ekstrakPrompt(fail('baris 1\nbaris 2').replace(/\n/g, '\r\n'))).toBe('baris 1\nbaris 2')
  })

  it('kosong jika penanda tiada atau ruang kosong', () => {
    expect(ekstrakPrompt('tiada penanda')).toBe('')
    expect(ekstrakPrompt(`${PENANDA_MULA}\nbelum tamat`)).toBe('')
    expect(ekstrakPrompt(fail('   \n\n'))).toBe('')
  })

  it('fail kandungan/master-prompt.txt mempunyai kedua-dua penanda', () => {
    expect(mentah).toContain(PENANDA_MULA)
    expect(mentah).toContain(PENANDA_TAMAT)
    expect(mentah.indexOf(PENANDA_MULA)).toBeLessThan(mentah.indexOf(PENANDA_TAMAT))
  })

  it('tidak mengandungi templat draf lama', () => {
    expect(ekstrakPrompt(mentah)).not.toContain('Gantikan templat ini')
  })
})

describe('statistikPrompt', () => {
  it('mengira perkataan, baris dan masa membaca', () => {
    expect(statistikPrompt('')).toEqual({ aksara: 0, perkataan: 0, baris: 0, minitBaca: 0 })
    expect(statistikPrompt('satu dua\ntiga')).toMatchObject({ perkataan: 3, baris: 2, minitBaca: 1 })
  })
})
