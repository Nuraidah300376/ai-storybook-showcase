import { describe, expect, it } from 'vitest'
import { sahkanUrlAwam } from './urlAwam'

describe('sahkanUrlAwam', () => {
  it('menerima URL https awam', () => {
    expect(sahkanUrlAwam('https://contoh.github.io/ai-storybook-showcase/prompt/')).toEqual({
      sah: true,
      url: 'https://contoh.github.io/ai-storybook-showcase/prompt/',
    })
    expect(sahkanUrlAwam('  https://contoh.my/p  ')).toMatchObject({ sah: true, url: 'https://contoh.my/p' })
  })

  it.each([
    [''],
    ['   '],
    ['contoh.github.io/prompt'],
    ['http://contoh.github.io/prompt/'],
    ['ftp://contoh.com/a'],
    ['file:///C:/prompt.html'],
    ['https://localhost:5173/prompt/'],
    ['https://127.0.0.1/prompt/'],
    ['https://192.168.1.10/prompt/'],
    ['https://10.0.0.2/'],
    ['https://172.20.1.1/'],
    ['https://[::1]/'],
    ['https://pelayan.local/'],
    ['https://intranet/'],
    ['https://user:rahsia@contoh.com/'],
    ['https://contoh.com/ada ruang'],
  ])('menolak %j', (url) => {
    expect(sahkanUrlAwam(url).sah).toBe(false)
  })
})
