import React, { FC } from 'react'
import '../css/ShopTagItem.less'

type IProps = {
  name: string
  onSelected: () => void
  unit?: string
  price?: number
  isActive?: boolean
  desc?: string
}
const ShopTagItem: FC<IProps> = props => {
  const { name, unit, price, isActive, desc, onSelected } = props

  return (
    <div className={`tag-item ${isActive ? 'tag-item-active' : ''}`} onClick={onSelected}>
      {name}
      <div className="sub-info">
        {Number(price) ? <span>￥{price}</span> : null}
        {price && unit ? '/' : null}
        {unit ? <span>{unit}</span> : null}
        {desc || null}
      </div>
    </div>
  )
}

export default React.memo(ShopTagItem)
