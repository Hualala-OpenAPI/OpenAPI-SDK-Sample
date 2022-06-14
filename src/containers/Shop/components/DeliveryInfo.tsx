import React, { FC } from 'react'
import moment from 'moment'
import { IModuleConfig } from '../../../types/store/common'
import { IShopItem } from '../../../types/views/shop'
import '../css/DeliveryInfo.less'
type IProps = {
  moduleConfig: IModuleConfig
  shopInfo: IShopItem
}
const DeliveryInfo: FC<IProps> = props => {
  const { moduleConfig, shopInfo } = props

  return (
    <div className="delivery-info">
      <div className="title">配送信息</div>

      {moduleConfig.dineWay === 1 ? (
        <>
          <div className="delivery-item">
            <div className="label">自提时间</div>
            <div className="info">{moment(moduleConfig.orderTime).format('HH:mm')}</div>
          </div>
          <div className="delivery-item">
            <div className="label">取餐地址</div>
            <div className="info">{shopInfo.shopAddress}</div>
          </div>
        </>
      ) : (
        <>
          <div className="delivery-item">
            <div className="label">联系人</div>
            <div className="info">{moduleConfig.username}</div>
          </div>
          <div className="delivery-item">
            <div className="label">联系电话</div>
            <div className="info">{moduleConfig.telephone}</div>
          </div>
          <div className="delivery-item">
            <div className="label">收货地址</div>
            <div className="info">{moduleConfig.address}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default React.memo(DeliveryInfo)
