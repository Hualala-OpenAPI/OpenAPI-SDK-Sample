import React, { FC, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import CommonListview from '../../containers/Main/components/CommonListview'
import ShopItem from '../../containers/Shop/components/ShopItem'
import MainHeader from '../../containers/Main/components/MainHeader'
import { setShopInfo } from '../../store/actions/Common'
import { IShopItem } from '../../types/views/shop'
import ShopService from '../../services/shop/ShopService'
import Config from '../../Config'
import './index.less'

type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = MapDispatchToProps & RouteComponentProps

const ShopIndex: FC<IProps> = props => {
  const [listData, updateListData] = useState<IShopItem[]>([])

  useEffect(() => {
    getItems()
  }, [])

  const getItems = () => {
    ShopService.index({ groupID: Config.info.groupId }).then(res => {
      const { code, data } = res
      if (code !== '000') return false
      const myselfShop = data.shopInfoList.find((item: IShopItem) => item.shopID === '76900948')
      const targetShop = data.shopInfoList.find((item: IShopItem) => item.shopID === '76312057')
      const arr: IShopItem[] = [].concat(data.shopInfoList)
      arr.unshift(myselfShop)
      arr.unshift(targetShop)
      updateListData(arr)
    })
  }

  const pushToPage = (item: IShopItem) => {
    const { history } = props
    props.setShopInfo(item)
    history.push(`/shop/${item.shopID}`, { item })
  }

  const renderListItem = (item: IShopItem, sectionID: string | number, rowID: string | number) => {
    return <ShopItem key={rowID} item={item} handleOnOk={() => pushToPage(item)} />
  }

  return (
    <div className="shop-index" id="shopIndex">
      <MainHeader title="店铺列表" />
      <CommonListview listData={listData} listRow={renderListItem} />
    </div>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setShopInfo(info: IShopItem) {
    dispatch(setShopInfo(info))
  }
})
export default React.memo(connect(null, mapDispatchToProps)(withRouter(ShopIndex)))
