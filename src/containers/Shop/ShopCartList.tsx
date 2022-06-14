import React, { FC, useEffect } from 'react'
import { Modal } from 'antd-mobile-v5'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import ShopCardListItem from './components/ShopCartListItem'
import { addGoodsItem, clearGoods, subtractGoodsItem } from '../../store/actions/Shop'
import './css/ShopCartList.less'
import { IGoodsItem } from '../../types/goods'

const { confirm } = Modal

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = {
  onClose: () => void
} & MapStateToProps &
  MapDispatchToProps

const ShopCartList: FC<IProps> = props => {
  const { goodsList, goodsCount, onClose, clearGoods } = props

  useEffect(() => {
    if (goodsCount === 0) {
      onClose()
    }
  }, [goodsCount])

  const renderItem = () => {
    return goodsList.map((item: IGoodsItem) => {
      if (item.count) return <ShopCardListItem item={item} key={item.id} add={props.addGoodsItem} subtract={props.subtractGoodsItem} />
    })
  }
  return (
    <div className="shop-card-list">
      {goodsList.length ? (
        <>
          <div className="top-container">
            <div
              className="clear-btn"
              onClick={() =>
                confirm({
                  title: '确定要清空吗?',
                  confirmText: '确定',
                  getContainer: document.getElementById('mainContainer'),
                  onConfirm: clearGoods,
                  cancelText: '取消'
                })
              }
            >
              清空购物车
            </div>
          </div>
          <div className="content">{renderItem()}</div>
        </>
      ) : (
        <div className="no-goods">暂无商品</div>
      )}
    </div>
  )
}
const mapStateToProps = (state: any) => {
  return {
    goodsList: state.shop.get('goodsList').toJS(),
    goodsCount: state.shop.get('goodsCount')
  }
}
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearGoods() {
    dispatch(clearGoods())
  },
  addGoodsItem(item: IGoodsItem, num: number, type: string) {
    dispatch(addGoodsItem(item, num, type))
  },
  subtractGoodsItem(item: IGoodsItem) {
    dispatch(subtractGoodsItem(item))
  }
})
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(ShopCartList))
