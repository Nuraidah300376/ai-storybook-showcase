import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MASTER_PROMPT, TAJUK_PROMPT, URL_PROMPT } from './masterPrompt'

describe('master prompt', () => {
  it('sama dengan fail asal dalam prompts/', () => {
    const fail = readFileSync(new URL('../../prompts/MASTER-PROMPT-BUKU-CERITA.md', import.meta.url), 'utf8')
    expect(MASTER_PROMPT).toBe(fail.trim())
  })

  it('bukan templat draf', () => {
    expect(MASTER_PROMPT).not.toContain('Gantikan templat ini')
    expect(TAJUK_PROMPT).toBe('MASTER PROMPT PREMIUM — BUKU CERITA BERGAMBAR BERHALAMAN')
  })

  it('pautan awam menghala ke fail prompt dalam cabang main', () => {
    expect(URL_PROMPT).toBe(
      'https://github.com/Nuraidah300376/ai-storybook-showcase/blob/main/prompts/MASTER-PROMPT-BUKU-CERITA.md',
    )
  })
})
