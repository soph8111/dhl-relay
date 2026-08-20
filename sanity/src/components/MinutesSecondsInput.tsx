import {useState, useEffect, useCallback} from 'react'
import {set, unset} from 'sanity'
import type {NumberInputProps} from 'sanity'
import {TextInput} from '@sanity/ui'

function secondsToMMSS(totalSeconds?: number): string {
  if (totalSeconds == null) return ''
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function mmssToSeconds(value: string): number | undefined {
  const match = value.trim().match(/^(\d+):([0-5]?\d)$/)
  if (!match) return undefined
  return Number(match[1]) * 60 + Number(match[2])
}

export function MinutesSecondsInput(props: NumberInputProps) {
  const {value, onChange} = props
  const [text, setText] = useState(secondsToMMSS(value))

  useEffect(() => {
    setText(secondsToMMSS(value))
  }, [value])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value)
  }, [])

  // Convert only on blur, so the admin can type freely without interruption
  const handleBlur = useCallback(() => {
    const seconds = mmssToSeconds(text)
    onChange(seconds === undefined ? unset() : set(seconds))
  }, [text, onChange])

  return <TextInput value={text} onChange={handleChange} onBlur={handleBlur} placeholder="mm:ss" />
}
