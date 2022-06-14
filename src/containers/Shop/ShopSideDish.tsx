import React, { FC, useEffect, useState } from 'react'
import ShopTagItem from './components/ShopTagItem'
import GoodsController from '../../controllers/GoodsController'
import OriginGoodsController from '../../controllers/OriginGoodsController'

type IProps = {
  item: any
  prefixTitle?: string
  onChange: (item: any) => void
}
const ShopSideDish: FC<IProps> = props => {
  const { item, prefixTitle, onChange } = props
  const { batchingFoodTagID, batchingFoodTagName = '配料' } = item
  const [subGoodsList, updateSubGoodsList] = useState<any[]>([])
  const [selectedSubGoodsList, updateSelectedSubGoodsList] = useState<any[]>([])
  useEffect(() => {
    const defaultSelectedList = GoodsController.findDefaultSideDish(item)
    if (defaultSelectedList.length) {
      updateSelectedSubGoodsList(defaultSelectedList)
    }
  }, [])
  // todo 拿到属于当前主菜的配菜
  useEffect(() => {
    if (batchingFoodTagID > 1) {
      updateSubGoodsList(OriginGoodsController.getSideDishByFoodTagId(batchingFoodTagID))
    }
  }, [batchingFoodTagID])

  useEffect(() => {
    onChange({ ...item, items: selectedSubGoodsList })
  }, [selectedSubGoodsList])

  const subGoodsSelected = (sideDishItem: any, unitItem: any) => {
    updateSelectedSubGoodsList(prevList => {
      const newItem = GoodsController.filterGoodsItem(sideDishItem, {
        unit: unitItem
      })
      const curChildrenIndex = prevList.findIndex((cSubGoodsItem: any) => cSubGoodsItem?.unit?.id === newItem.unit.id)

      const newItems = GoodsController.subGoodsSelected({
        parentItem: item,
        childrenItems: prevList,
        curChildrenItem: newItem,
        curChildrenIndex,
        tipName: item.batchingFoodTagName,
        noRepeatableSelect: item.noRepeatableSelect
      })
      if (newItems) return newItems
      return prevList
    })
  }

  return (
    <div>
      <div className="sub-title">
        {prefixTitle || ''}
        {batchingFoodTagName}
        <span className="tips">{GoodsController.renderSubtitleTips(item)}</span>
      </div>
      <div className="tag-container">
        {subGoodsList.map((subGoodsItem: any) => {
          return subGoodsItem?.units?.map((subUnitItem: any) => {
            return (
              <ShopTagItem
                name={subGoodsItem.name}
                unit={subUnitItem.name}
                price={subUnitItem.price}
                isActive={selectedSubGoodsList.some((selectItem: any) => selectItem?.unit?.id === subUnitItem.id)}
                key={subUnitItem.id}
                onSelected={() => subGoodsSelected(subGoodsItem, subUnitItem)}
              />
            )
          })
        })}
      </div>
    </div>
  )
}

export default React.memo(ShopSideDish)
