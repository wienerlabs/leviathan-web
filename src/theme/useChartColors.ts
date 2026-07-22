import { useMemo } from 'react'
import { useTheme } from './ThemeProvider'

export function useChartColors() {
  const { isDark } = useTheme()

  return useMemo(() => {
    if (isDark) {
      return {
        ink: '#f2f1ec',
        paper: '#0b0b0b',
        grid: 'rgba(242,241,236,0.14)',
        tick: 'rgba(242,241,236,0.5)',
        tickMuted: 'rgba(242,241,236,0.38)',
        faint: '#3a3a3a',
        mid: '#8a8a8a',
        soft: '#5c5c5c',
        deep: '#cfcfcf',
        series: ['#f2f1ec', '#cfcfcf', '#8a8a8a', '#5c5c5c', '#3a3a3a'],
        allocation: [
          '#f2f1ec',
          '#d4d4d0',
          '#a8a8a4',
          '#7c7c78',
          '#50504c',
          '#2e2e2c',
        ],
        shadow: 'rgba(0,0,0,0.55)',
      }
    }
    return {
      ink: '#000000',
      paper: '#ffffff',
      grid: 'rgba(0,0,0,0.12)',
      tick: 'rgba(0,0,0,0.45)',
      tickMuted: 'rgba(0,0,0,0.35)',
      faint: '#d4d4d4',
      mid: '#737373',
      soft: '#b3b3b3',
      deep: '#404040',
      series: ['#000000', '#404040', '#737373', '#a3a3a3', '#d4d4d4'],
      allocation: [
        '#000000',
        '#404040',
        '#666666',
        '#8c8c8c',
        '#b3b3b3',
        '#d9d9d9',
      ],
      shadow: 'rgba(0,0,0,0.12)',
    }
  }, [isDark])
}
