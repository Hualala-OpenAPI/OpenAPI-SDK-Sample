import React, { FC } from 'react'
import { connect } from 'react-redux'
import ApiList from './components/ApiList'
import NoData from '../../components/general/NoData'
import './css/Logger.less'

type IProps = Readonly<ReturnType<typeof mapStateToProps>>

const Logger: FC<IProps> = props => {
  const { apiList } = props
  return <div className="logger">{apiList?.length ? <ApiList items={apiList} /> : <NoData>暂无日志</NoData>}</div>
}

const mapStateToProps = (state: any) => {
  const { pathname } = location
  const apiList = state.api.getIn(['apiList', pathname])?.toJS()
  return {
    apiList: apiList || []
  }
}
export default React.memo(connect(mapStateToProps)(Logger))
