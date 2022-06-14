import React, { FC } from 'react'
import '../css/NoData.less'

type IProps = {
  customStyle?: any
  children?: any
}

const NoData: FC<IProps> = props => {
  const { children, customStyle } = props
  return (
    <div className="no-data" style={customStyle}>
      {children || '暂无数据'}
    </div>
  )
}

export default React.memo(NoData)
