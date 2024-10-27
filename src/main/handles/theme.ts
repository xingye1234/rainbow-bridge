import { nativeTheme } from 'electron'
import { defineHandle } from '../libs/define'
import { set } from '../libs/store'

export const setTheme = defineHandle(async (newTheme: 'light' | 'dark' | 'system') => {
  nativeTheme.themeSource = newTheme
  return await set('theme', newTheme)
})