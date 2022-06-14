import React, { FC } from 'react'
import { Popup } from 'antd-mobile-v5'

type IProps = {
  visible: boolean
  onMaskClick?: () => void
  children?: any
}
const CommonPopup: FC<IProps> = props => {
  const { visible, children, onMaskClick } = props

  return (
    <Popup
      visible={visible}
      destroyOnClose
      position="top"
      bodyStyle={{
        background: 'none',
        height: '100%'
      }}
      getContainer={document.getElementById('mainContainer')}
      onMaskClick={onMaskClick}
    >
      {children}
    </Popup>
  )
}

export default React.memo(CommonPopup)
