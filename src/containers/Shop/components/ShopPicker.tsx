import React, { FC, useRef, useState } from 'react'
import { Button } from 'antd-mobile'
import { List } from 'immutable'
import ShopUnitItem from './ShopUnitItem'
import GoodsController from '../../../controllers/GoodsController'
import ShopPickerHeader from './ShopPickerHeader'
import ShopCombo from './ShopCombo'
import ShopSideDish from '../ShopSideDish'
import GoodsPickerController from '../../../controllers/GoodsPickerController'
import ShopTaste from './ShopTaste'
import { showToast } from '../../../Utils'
import { IGoodsItem, IOriginGoodsItem, IOriginUnitItem } from '../../../types/goods'
import '../css/ShopPicker.less'

type IProps = {
  item: IOriginGoodsItem
  onFinished: () => void
  add: (item: IGoodsItem) => void
}
const ShopPicker: FC<IProps> = props => {
  const { item, add } = props
  const controller = useRef(new GoodsPickerController(item))
  const { units = [], batchingFoodJson, name, minOrderCount, tasteGroupList, makingMethodGroupList, setFoodDetailJson } = item
  const [curUnit, updateCurUnit] = useState<IOriginUnitItem | null>(controller.current.findFirstUnit())
  const [sideDish, updateSideDish] = useState<any[]>([])
  const [curCombo, updateCurCombo] = useState(null)
  const [count, updateCount] = useState(minOrderCount)
  const [tasteInfo, updateTasteInfo] = useState<any[]>([])
  const [makingMethod, updateMakingMethod] = useState<any[]>([])

  const handleOnOk = () => {
    if (!controller.current.verifyAdd(sideDish, curCombo, tasteInfo, makingMethod)) {
      return false
    }
    add(
      GoodsController.filterGoodsItem(item, {
        unit: curUnit,
        sideDish,
        combo: curCombo,
        taste: tasteInfo,
        make: makingMethod,
        count
      })
    )
    props.onFinished()
  }

  const subtract = () => {
    if (count <= minOrderCount) return false
    updateCount(count - minOrderCount)
  }

  const InfoSelectedFinished = (info: any, infoItem: any, subKey: any) => {
    const newInfo = List(info)
    const index = newInfo.findIndex((oldSideDishItem: any) => oldSideDishItem[subKey] === infoItem[subKey])
    if (index >= 0) {
      return newInfo.set(index, infoItem).toJS()
    }
    return newInfo.push(infoItem).toJS()
  }

  // todo 配菜选择完成
  const sideDishSelectedFinished = (sideDishItem: any) => {
    updateSideDish(prevSideDish => {
      return InfoSelectedFinished(prevSideDish, sideDishItem, 'batchingFoodTagID')
    })
  }

  const handleAdd = () => {
    if (count + minOrderCount > (curUnit?.total || 0)) {
      showToast({ content: '数量不足', icon: 'fail' })
      return false
    }
    updateCount(count + minOrderCount)
  }

  const tasteSelectedFinished = (type: string, tasteItem: any) => {
    if (type === 'taste') {
      updateTasteInfo(prevTasteInfo => {
        return InfoSelectedFinished(prevTasteInfo, tasteItem, 'groupName')
      })
    }
    if (type === 'make') {
      updateMakingMethod(prevTasteInfo => {
        return InfoSelectedFinished(prevTasteInfo, tasteItem, 'groupName')
      })
    }
  }

  return (
    <div className="shop-picker">
      <ShopPickerHeader
        name={name}
        price={GoodsController.getTotalPrice(curUnit, sideDish, curCombo, makingMethod)}
        count={count}
        subtract={subtract}
        add={handleAdd}
      />
      <div className="content-container">
        {setFoodDetailJson ? <ShopCombo setFoodDetailJson={setFoodDetailJson} onChange={updateCurCombo} /> : null}

        {units.length > 1 ? (
          <>
            <div className="sub-title">规格</div>
            <div className="tag-container">
              {units.map(unitItem => {
                return <ShopUnitItem item={unitItem} curId={curUnit?.id} key={unitItem.id} onSelected={updateCurUnit} />
              })}
            </div>
          </>
        ) : null}

        {Array.isArray(batchingFoodJson)
          ? batchingFoodJson.map(batchItem => {
              return <ShopSideDish key={batchItem.batchingFoodTagID} item={batchItem} onChange={sideDishSelectedFinished} />
            })
          : null}

        {tasteGroupList && tasteGroupList.length
          ? tasteGroupList.map((tasteItem: any, tasteIndex: number) => {
              return (
                <ShopTaste key={tasteIndex} item={tasteItem} onSelected={(tasteItem: any) => tasteSelectedFinished('taste', tasteItem)} />
              )
            })
          : null}

        {makingMethodGroupList && makingMethodGroupList.length
          ? makingMethodGroupList.map((tasteItem: any, tasteIndex: number) => {
              return <ShopTaste key={tasteIndex} item={tasteItem} onSelected={(makeItem: any) => tasteSelectedFinished('make', makeItem)} />
            })
          : null}
      </div>
      <Button className="btn" type="primary" onClick={handleOnOk}>
        加入购物车
      </Button>
    </div>
  )
}

export default React.memo(ShopPicker)
