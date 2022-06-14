import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ListView } from 'antd-mobile'
import '../css/CommonListview.less'

type IProps = {
  listData: any[]
  listRow: any
  pageSize?: number
  useBodyScroll?: boolean
}
const CommonListview = (props: IProps, ref: Ref<any>) => {
  const { listData, listRow, pageSize = 6, useBodyScroll = false } = props
  const [dataSource, updateDataSource] = useState(new ListView.DataSource({ rowHasChanged: (row1: any, row2: any) => row1 !== row2 }))
  const listViewRef: Ref<any> = useRef()

  useEffect(() => {
    updateDataSource(dataSource.cloneWithRows({ ...listData }))
  }, [listData])

  useImperativeHandle(ref, () => {
    return {
      scrollTo: listViewRef.current.scrollTo
    }
  })

  return (
    <div className="common-listview">
      <ListView ref={listViewRef} useBodyScroll={useBodyScroll} dataSource={dataSource} renderRow={listRow} pageSize={pageSize} />
    </div>
  )
}

export default React.memo(forwardRef(CommonListview))
