import { Button } from 'antd-mobile-v5'
import React, { FC } from 'react'
import { IShopItem } from '../../../types/views/shop'
import '../css/ShopItem.less'

type IProps = {
  item: IShopItem
  handleOnOk?: () => void
}

const ShopItem: FC<IProps> = props => {
  const { item, handleOnOk } = props

  return (
    <div className="shop-item">
      <div className="left">
        <div className="title">
          {item.brandName}（{item.shopName}）
        </div>
        <div className="address">{item.shopAddress}</div>
        <div className="time">门店营业时间 {item.shopOpenTime}</div>
      </div>
      {handleOnOk ? (
        <Button className="btn" disabled={item.status !== '1'} color="primary" onClick={handleOnOk}>
          下单{item.status !== '1' ? '(暂停营业)' : null}
        </Button>
      ) : null}
    </div>
  )
}

export default React.memo(ShopItem)
