import { Toast } from 'antd-mobile-v5'
import { ReactNode } from 'react'

export function parseJson(data: any) {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data)
    }
    return data
  } catch (e) {
    console.error('parseJson error', data)
    return data
  }
}

type IToastOptions = {
  content: string | ReactNode
  icon?: string
  duration?: number
}
export function showToast({ content, icon = 'loading', duration = 1500 }: IToastOptions) {
  Toast.show({
    content,
    icon,
    getContainer: document.getElementById('mainContainer'),
    duration
  })
}

// todo 消除js价格计算精度的问题 保留两位小数
export function filterAmount(price: number) {
  return Math.round(price * 100) / 100
}
