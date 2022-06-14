import React, { FC, Fragment } from 'react'
import { Button } from 'antd-mobile'
import { nanoid } from 'nanoid'
import { filterAmount, showToast } from '../../../Utils'
import { IGoodsItem } from '../../../types/goods'
import '../css/ShopCartListItem.less'

type IProps = {
  item: IGoodsItem
  add?: (item: IGoodsItem, num: number, type: string) => void
  subtract?: (item: IGoodsItem) => void
}
const ShopCartListItem: FC<IProps> = props => {
  const { item, add, subtract } = props

  const renderItem = (itemData: any, key: string | number = nanoid()) => {
    const { name, count, unit, price, isSub, taste, make, sideDish, extraMake, combo, isSelfCount = false, isMake = false } = itemData
    const newCount = isSelfCount ? count : item.count
    return (
      <div key={key} className={`item ${isSub ? 'sub-item' : ''}`}>
        <div className="row">
          <div className="name">
            {isMake ? '[做法]' : ''}
            {name}
          </div>
          <div className="right-row">
            <div className="count">
              x{newCount}/{unit}
            </div>
            <div className="price">{Number(price) ? `￥${filterAmount(newCount * price)}` : null}</div>
          </div>
        </div>
        <div className="remark">
          {taste ? renderTaste('口味', taste) : null}
          {make ? renderTaste('做法', make) : null}
        </div>
        {combo ? renderCombo(combo) : null}
        {sideDish ? renderSideDish(sideDish) : null}
        {extraMake ? renderExtraMake(extraMake) : null}
      </div>
    )
  }

  const renderCombo = (data: any) => {
    return (
      <>
        {data.items.map((comboItem: any, comboIndex: number) => {
          const { foodName, addPrice, number, unit, sideDish, taste, make, extraMake } = comboItem
          return (
            <Fragment key={comboIndex}>
              {renderItem({
                name: foodName,
                price: addPrice,
                count: number,
                unit,
                isSub: true,
                taste,
                make,
                sideDish,
                extraMake
              })}
            </Fragment>
          )
        })}
      </>
    )
  }
  const renderSideDish = (data: any[]) => {
    return data?.map(sideDishItem => {
      return sideDishItem.items?.map((subSideDishItem: any, subSideDishIndex: number) => {
        const { name, price, count, unit } = subSideDishItem
        return renderItem({ name, price, count, unit: unit?.name, isSub: true }, subSideDishIndex)
      })
    })
  }
  // 口味
  const renderTaste = (text: string, tasteData: any[]) => {
    if (!tasteData.length) return null
    if (!tasteData.some(tasteItem => tasteItem.items.length)) return null
    return (
      <div>
        {text}:
        {tasteData.map(tasteItem => {
          if (!tasteItem.items.length) return null
          return tasteItem.items.map((tasteSubItem: any, tasteSubIndex: number) => {
            return <span key={tasteSubIndex}>{tasteSubItem.notesName},</span>
          })
        })}
      </div>
    )
  }
  const renderExtraMake = (data: any[]) => {
    return data?.map((extraMakeItem, extraMakeIndex) => {
      const { name, price, count, unit, addPriceType } = extraMakeItem
      return renderItem(
        {
          name,
          price,
          count,
          unit,
          isSelfCount: addPriceType !== 2,
          isMake: true,
          isSub: true
        },
        extraMakeIndex
      )
    })
  }
  const handleAdd = () => {
    const { unit, count, minOrderCount } = item
    if ('total' in unit && count + minOrderCount > unit.total) {
      showToast({ content: '数量不足', icon: 'fail' })
      return false
    }
    if (add) add(item, 1, 'cart')
  }

  return (
    <div className="shop-card-list-item">
      <div className="left-container">
        {renderItem({
          name: item.name,
          count: item.count,
          unit: item.unit?.name,
          price: item.unit?.price,
          taste: item.taste,
          make: item.make,
          sideDish: item.sideDish,
          extraMake: item.extraMake,
          combo: item.combo
        })}
      </div>
      {add || subtract ? (
        <div className="right-operation">
          {subtract ? (
            <Button className="btn" type="warning" onClick={() => subtract(item)}>
              -
            </Button>
          ) : null}

          <span className="count">{item.count}个</span>
          {add ? (
            <Button className="btn" type="primary" onClick={handleAdd}>
              +
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(ShopCartListItem)
