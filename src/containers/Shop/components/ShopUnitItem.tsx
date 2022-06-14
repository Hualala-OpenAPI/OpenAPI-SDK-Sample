import React, { FC } from 'react'
import '../css/ShopTagItem.less'
import { IOriginUnitItem } from '../../../types/goods'

type IProps = {
  item: IOriginUnitItem
  curId: number | string | undefined
  onSelected: (item: any) => void
}
const ShopUnitItem: FC<IProps> = props => {
  const { item, curId, onSelected } = props
  const { id, name, price, total } = item

  const renderRemainTotal = () => {
    if (typeof total === 'number' && total <= 0) {
      return <span> (售罄)</span>
    }
    if (typeof total === 'number' && total <= 10) {
      return <span> (剩余{total})</span>
    }
    return null
  }
  const handleOnClick = () => {
    if (typeof total === 'number' && total <= 0) return false
    onSelected(item)
  }
  return (
    <div
      className={`tag-item ${curId === id ? 'tag-item-active' : ''} ${typeof total === 'number' && total <= 0 ? 'tag-item-disabled' : ''}`}
      onClick={handleOnClick}
    >
      {name}
      {price ? <>￥{price}</> : null}
      {renderRemainTotal()}
    </div>
  )
}

export default React.memo(ShopUnitItem)
