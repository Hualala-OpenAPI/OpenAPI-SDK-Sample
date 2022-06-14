import React, { FC, useEffect, useRef, useState, MutableRefObject } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import GoodsCatalog from './GoodsCatalog'
import CommonListview from '../Main/components/CommonListview'
import ShopCart from './ShopCart'
import GoodsItem from './components/GoodsItem'
import { getGoodsList } from '../../store/actions/Common'
import { addGoodsItem } from '../../store/actions/Shop'
import './css/GoodsList.less'
import { IGoodsItem, IOriginGoodsItem } from '../../types/goods'

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = MapStateToProps & MapDispatchToProps

const GoodsList: FC<IProps> = props => {
  const { goodsCatalog, originGoodsList } = props
  const [listData, updateListData] = useState([])
  const listviewRef: MutableRefObject<any> = useRef(null)

  const catalogOnChange = (id: string) => {
    getCatalogByData(id)
    if (listviewRef?.current) {
      listviewRef.current.scrollTo(0)
    }
  }

  useEffect(() => {
    props.getGoodsList()
  }, [])

  const getCatalogByData = (id: string) => {
    const currentItems = originGoodsList.filter((item: IOriginGoodsItem) => item?.catalogId === id)
    updateListData(currentItems)
  }

  const renderListItem = (item: IOriginGoodsItem, sectionID: string | number, rowID: string | number) => {
    return item.isActive && item.isOpen ? <GoodsItem key={rowID} item={item} add={props.addGoodsItem} /> : null
  }

  return (
    <div className="goods-list" style={{ height: 'calc(100% - 45px - 176px)' }}>
      {goodsCatalog && goodsCatalog.length ? <GoodsCatalog onChange={catalogOnChange} /> : null}
      <div className="list-view-box">
        <CommonListview ref={listviewRef} listData={listData} listRow={renderListItem} />
      </div>
      <ShopCart />
    </div>
  )
}
const mapStateToProps = (state: any) => {
  return {
    goodsCatalog: state.common.get('goodsCatalog').toJS(),
    originGoodsList: state.common.get('originGoodsList').toJS()
  }
}
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  getGoodsList() {
    dispatch(getGoodsList())
  },
  addGoodsItem(item: IGoodsItem) {
    dispatch(addGoodsItem(item))
  }
})

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(GoodsList))
