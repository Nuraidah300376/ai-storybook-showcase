/**
 * Jam maya untuk pemaparan bingkai demi bingkai yang deterministik.
 *
 * Fungsi ini disuntik ke dalam halaman (Playwright `addInitScript`) SEBELUM
 * kod aplikasi dimuat. Ia menggantikan sumber masa pelayar supaya masa hanya
 * bergerak apabila skrip pemapar memintanya:
 *
 * - `performance.now`, `Date.now`, `new Date()`;
 * - `setTimeout`, `setInterval`, `requestAnimationFrame` (dan pembatalnya);
 * - `Element.prototype.animate` dibuang, jadi Motion menggunakan animasi
 *   JavaScript (dipacu oleh requestAnimationFrame + performance.now) dan
 *   bukannya Web Animations yang berjalan pada jam sebenar;
 * - peralihan/animasi CSS (contohnya bar kemajuan) dijeda dan dicari
 *   (`currentTime`) mengikut jam maya pada setiap bingkai.
 *
 * Hasilnya: bingkai ke-n sentiasa menunjukkan keadaan tepat pada n / fps saat,
 * walau berapa lama pun pelayar mengambil masa untuk melukisnya.
 */
export function pasangJamMaya() {
  const asal = {
    setTimeout: window.setTimeout.bind(window),
    dateNow: Date.now.bind(Date),
    Date: window.Date,
  }
  const epoch = asal.dateNow()
  let kini = 0
  let idSeterusnya = 1
  /** id → { masa, fn, args, selang } */
  const pemasa = new Map()
  let rafQ = new Map()
  const lahir = new WeakMap()

  performance.now = () => kini
  Date.now = () => epoch + Math.floor(kini)
  class DateMaya extends asal.Date {
    constructor(...a) {
      if (a.length === 0) super(epoch + Math.floor(kini))
      else super(...a)
    }
    static now() {
      return epoch + Math.floor(kini)
    }
  }
  window.Date = DateMaya

  const daftar = (fn, ms, args, ulang) => {
    const id = idSeterusnya++
    const tunda = Math.max(0, Number(ms) || 0)
    pemasa.set(id, { masa: kini + tunda, fn, args, selang: ulang ? Math.max(1, tunda) : 0 })
    return id
  }
  window.setTimeout = (fn, ms, ...args) => daftar(fn, ms, args, false)
  window.setInterval = (fn, ms, ...args) => daftar(fn, ms, args, true)
  window.clearTimeout = (id) => void pemasa.delete(id)
  window.clearInterval = (id) => void pemasa.delete(id)
  window.requestAnimationFrame = (fn) => {
    const id = idSeterusnya++
    rafQ.set(id, fn)
    return id
  }
  window.cancelAnimationFrame = (id) => void rafQ.delete(id)
  delete Element.prototype.animate

  const panggil = (fn, args) => {
    try {
      if (typeof fn === 'function') fn(...args)
    } catch (e) {
      console.error(e)
    }
  }

  /** Beri peluang React/Motion menyelesaikan kerja tertunda (MessageChannel + mikrotugas). */
  const tenang = async (pusingan = 3) => {
    for (let i = 0; i < pusingan; i++) {
      await new Promise((r) => {
        const ch = new MessageChannel()
        ch.port1.onmessage = () => r()
        ch.port2.postMessage(null)
      })
    }
  }

  /** Gerakkan masa ke `sasaran`, menjalankan pemasa yang tamat mengikut urutan. */
  const majuKe = async (sasaran) => {
    for (;;) {
      let pilih = null
      for (const [id, p] of pemasa) {
        if (p.masa <= sasaran && (!pilih || p.masa < pilih[1].masa)) pilih = [id, p]
      }
      if (!pilih) break
      const [id, p] = pilih
      kini = Math.max(kini, p.masa)
      if (p.selang) p.masa += p.selang
      else pemasa.delete(id)
      panggil(p.fn, p.args)
      await tenang(1)
    }
    kini = Math.max(kini, sasaran)
  }

  /** Satu detik paparan: maju ke `sasaran`, kemudian jalankan panggilan requestAnimationFrame. */
  const detik = async (sasaran) => {
    await majuKe(sasaran)
    const q = rafQ
    rafQ = new Map()
    for (const fn of q.values()) panggil(fn, [kini])
    await tenang()
  }

  /** Selaraskan peralihan/animasi CSS dengan jam maya. */
  const selarasCss = () => {
    for (const a of document.getAnimations()) {
      let t0 = lahir.get(a)
      if (t0 === undefined) {
        t0 = kini
        lahir.set(a, t0)
      }
      if (a.playState === 'finished') continue
      a.pause()
      const t = kini - t0
      const akhir = a.effect?.getComputedTiming().endTime
      if (typeof akhir === 'number' && Number.isFinite(akhir) && t >= akhir) a.finish()
      else a.currentTime = t
    }
  }

  window.__jamMaya = {
    get kini() {
      return kini
    },
    detik,
    /**
     * Sediakan bingkai pada masa `sasaran` (ms): dua detik 60 Hz bagi setiap
     * bingkai 30 fps supaya animasi Motion yang bermula di tengah bingkai
     * berkembang seperti dalam pelayar sebenar.
     */
    async bingkai(sasaran, subdetik = 2) {
      const mula = kini
      for (let i = 1; i <= subdetik; i++) await detik(mula + ((sasaran - mula) * i) / subdetik)
      selarasCss()
      await tenang()
      selarasCss()
    },
    /** Untuk penyediaan (imej, fon): gerakkan jam sedikit tanpa menjejaskan garis masa. */
    async rehat(ms = 16) {
      await detik(kini + ms)
    },
  }
}
