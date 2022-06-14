import React, { FC } from 'react'

type IProps = {
  name: string
  price: number
  count: number
  subtract: () => void
  add: () => void
}
const ShopPickerHeader: FC<IProps> = props => {
  const { name, price, count, subtract, add } = props

  return (
    <>
      <div className="row">
        <div className="name">{name}</div>
        <span className="price">￥{price}</span>
      </div>
      <div className="row">
        <div className="sub-title">数量</div>
        <div className="operation">
          <div onClick={subtract}>-</div>
          <div className="count">{count}</div>
          <div onClick={add}>+</div>
        </div>
      </div>
    </>
  )
}

export default React.memo(ShopPickerHeader)
