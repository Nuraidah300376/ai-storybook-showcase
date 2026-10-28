import { describe, expect, it } from 'vitest'
import { SUDUT_TUNGGAL, sudutPutaran, susunMuka } from './selak'

describe('susunMuka — hamparan', () => {
  it('tanpa selakan memaparkan ilustrasi kiri dan teks kanan', () => {
    expect(susunMuka('hamparan', 3, null)).toEqual({
      statik: [
        { sisi: 'kiri', indeks: 3 },
        { sisi: 'kanan', indeks: 3 },
      ],
      daun: null,
    })
  })

  it('selak ke hadapan: helaian kanan membawa ilustrasi baharu di belakangnya', () => {
    const s = susunMuka('hamparan', 3, { dari: 3, ke: 4 })
    expect(s.statik).toEqual([
      { sisi: 'kiri', indeks: 3 },
      { sisi: 'kanan', indeks: 4 },
    ])
    expect(s.daun).toMatchObject({ pada: 'kanan', depan: { sisi: 'kanan', indeks: 3 }, belakang: { sisi: 'kiri', indeks: 4 } })
  })

  it('selak ke belakang: helaian kiri membawa teks lama di belakangnya', () => {
    const s = susunMuka('hamparan', 4, { dari: 4, ke: 3 })
    expect(s.statik).toEqual([
      { sisi: 'kiri', indeks: 3 },
      { sisi: 'kanan', indeks: 4 },
    ])
    expect(s.daun).toMatchObject({ pada: 'kiri', depan: { sisi: 'kiri', indeks: 4 }, belakang: { sisi: 'kanan', indeks: 3 } })
  })

  it('muka akhir helaian sepadan dengan halaman statik selepas selakan (tiada lompatan)', () => {
    const maju = susunMuka('hamparan', 3, { dari: 3, ke: 4 })
    expect(maju.daun!.belakang).toEqual(susunMuka('hamparan', 4, null).statik[0])
    const undur = susunMuka('hamparan', 4, { dari: 4, ke: 3 })
    expect(undur.daun!.belakang).toEqual(susunMuka('hamparan', 3, null).statik[1])
  })

  it('menyokong lompatan terus dari halaman judul (-1)', () => {
    const s = susunMuka('hamparan', -1, { dari: -1, ke: 0 })
    expect(s.daun).toMatchObject({ depan: { sisi: 'kanan', indeks: -1 }, belakang: { sisi: 'kiri', indeks: 0 } })
  })
})

describe('susunMuka — tunggal', () => {
  it('selak ke hadapan mendedahkan halaman baharu di bawah', () => {
    const s = susunMuka('tunggal', 2, { dari: 2, ke: 3 })
    expect(s.statik).toEqual([{ sisi: 'penuh', indeks: 3 }])
    expect(s.daun).toMatchObject({ depan: { sisi: 'penuh', indeks: 2 }, masuk: false })
  })

  it('selak ke belakang membawa halaman lama masuk menutup', () => {
    const s = susunMuka('tunggal', 3, { dari: 3, ke: 2 })
    expect(s.statik).toEqual([{ sisi: 'penuh', indeks: 3 }])
    expect(s.daun).toMatchObject({ depan: { sisi: 'penuh', indeks: 2 }, masuk: true })
  })
})

describe('sudutPutaran', () => {
  it('hamparan: kanan berpusing ke -180, kiri ke +180', () => {
    const maju = susunMuka('hamparan', 0, { dari: 0, ke: 1 }).daun!
    const undur = susunMuka('hamparan', 1, { dari: 1, ke: 0 }).daun!
    expect(sudutPutaran('hamparan', maju, 180)).toBe(-180)
    expect(sudutPutaran('hamparan', undur, 180)).toBe(180)
  })

  it('tunggal: helaian masuk bermula tegak dan berakhir rata', () => {
    const masuk = susunMuka('tunggal', 1, { dari: 1, ke: 0 }).daun!
    expect(sudutPutaran('tunggal', masuk, 0)).toBe(-SUDUT_TUNGGAL)
    expect(sudutPutaran('tunggal', masuk, SUDUT_TUNGGAL) + 0).toBe(0)
  })
})
