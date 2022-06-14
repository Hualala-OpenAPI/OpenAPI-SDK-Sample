import React, { FC } from 'react'
import { IShopItem } from '../../../types/views/shop'
import '../css/DeliveryInfo.less'

type IProps = {
  item: IShopItem
}
const ShopInfo: FC<IProps> = props => {
  const { item } = props

  return (
    <div className="delivery-info">
      <div className="title">店铺信息</div>
      <div className="delivery-item">
        <div className="label">店铺名称</div>
        <div className="info">
          {item.brandName}({item.shopName})
        </div>
      </div>
      <div className="delivery-item">
        <div className="label">店铺地址</div>
        <div className="info">{item.shopAddress}</div>
      </div>
      <div className="delivery-item">
        <div className="label">营业时间</div>
        <div className="info">{item.shopOpenTime}</div>
      </div>
    </div>
  )
}

export default React.memo(ShopInfo)
