import { styler, SetEnvironment } from 'https://deno.land/x/suf_log@2.5.3.3/deno/mod.ts'
SetEnvironment('node')

export const action = (...text: string[]) => console.log(`${styler('[Status]', { color: '#0f6', "font-weight": 'bold' })}${styler(':', '#aaa')} ${styler(text.join(' '), '#f26')}`)
export const error = (...text: string[]) => console.log(`${styler('[Error ]', { color: '#f22', "font-weight": 'bold' })}${styler(':', '#aaa')} ${styler(text.join(' '), '#f26')}`)
