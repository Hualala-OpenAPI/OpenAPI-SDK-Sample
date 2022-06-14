import React, { FC } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import MainHeader from '../../../containers/Main/components/MainHeader'
import GoodsList from '../../../containers/Shop/GoodsList'
import ShopInfo from '../../../containers/Shop/components/ShopInfo'
import { IShopItem } from '../../../types/views/shop'
import './index.less'

type IState = {
  item: IShopItem
}

const ShopDetail: FC<RouteComponentProps> = props => {
  const { state } = props.location
  const { item } = state as IState

  return (
    <div className="shop-detail">
      <MainHeader title="店铺详情" />
      <ShopInfo item={item} />
      <GoodsList />
    </div>
  )
}

export default React.memo(ShopDetail)
