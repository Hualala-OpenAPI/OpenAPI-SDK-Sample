import React, { FC, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IOriginCatalogItem } from '../../types/goods'
import './css/GoodsCatalog.less'

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type IProps = {
  onChange: (id: string) => void
} & MapStateToProps
const GoodsCatalog: FC<IProps> = props => {
  const { goodsCatalog, onChange } = props
  const [curCatalogId, updateCurCatalogId] = useState<string | null>(null)

  useEffect(() => {
    if (goodsCatalog) updateCurCatalogId(goodsCatalog[0]?.id)
  }, [])

  useEffect(() => {
    if (curCatalogId) onChange(curCatalogId)
  }, [curCatalogId])

  return (
    <div className="goods-catalog">
      <div className="goods-catalog-container">
        {goodsCatalog.map((item: IOriginCatalogItem) => {
          return (
            <div
              className={`goods-catalog-item ${curCatalogId === item.id ? 'catalog-item-active' : ''}`}
              key={item.id}
              onClick={() => updateCurCatalogId(item.id)}
            >
              {item.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
const mapStateToProps = (state: any) => {
  return {
    goodsCatalog: state.common.get('goodsCatalog').toJS()
  }
}
export default React.memo(connect(mapStateToProps)(GoodsCatalog))
