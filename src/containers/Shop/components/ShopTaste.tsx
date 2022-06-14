import React, { FC, useEffect, useState } from 'react'
import ShopTagItem from './ShopTagItem'
import GoodsController from '../../../controllers/GoodsController'

type IProps = {
  item: {
    groupName: string
    detailList: any[]
  }
  onSelected: (item: any) => void
  prefixTitle?: string
}
const ShopTaste: FC<IProps> = props => {
  const { item, prefixTitle, onSelected } = props
  const { groupName, detailList } = item
  const [selectedItems, updateSelectedItems] = useState<any[]>([])

  useEffect(() => {
    const initSelected = () => {
      const arr: any[] = []
      item.detailList.map(subItem => {
        if (subItem.isDefault === '1') arr.push(subItem)
      })
      updateSelectedItems(arr)
    }
    initSelected()
  }, [])

  useEffect(() => {
    onSelected({ ...item, items: selectedItems })
  }, [selectedItems])

  const handleOnSelected = (detailItem: any) => {
    updateSelectedItems(prevList => {
      const curChildrenIndex = prevList.findIndex(childrenItem => childrenItem?.notesName === detailItem?.notesName)

      const newList = GoodsController.subGoodsSelected({
        parentItem: item,
        childrenItems: prevList,
        curChildrenItem: detailItem,
        curChildrenIndex,
        tipName: item.groupName
      })
      if (newList) return newList
      return prevList
    })
  }
  return (
    <>
      <div className="sub-title">
        {prefixTitle || ''}
        {groupName}
        <span className="tips">{GoodsController.renderSubtitleTips(item)}</span>
      </div>
      <div className="tag-container">
        {detailList?.map((detailItem, detailIndex) => {
          return (
            <ShopTagItem
              key={detailIndex}
              name={detailItem.notesName}
              price={detailItem.addPriceValue}
              isActive={selectedItems.some(subSelectedItem => subSelectedItem?.notesName === detailItem.notesName)}
              desc={detailItem.isRecommend === '1' ? '(推荐)' : ''}
              onSelected={() => handleOnSelected(detailItem)}
            />
          )
        })}
      </div>
    </>
  )
}

export default React.memo(ShopTaste)
