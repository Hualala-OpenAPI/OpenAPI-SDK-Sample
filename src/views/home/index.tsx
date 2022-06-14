import React, { FC, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Button } from 'antd-mobile'
import { persistor } from '../../store'
import './index.less'

type IProps = RouteComponentProps

const Home: FC<IProps> = props => {
  const { history } = props

  useEffect(() => {
    // todo 清空持久化redux
    persistor.purge()
  }, [])
  const pushToPage = () => {
    history.push({ pathname: '/option' })
  }

  return (
    <div className="home">
      <Button type="primary" style={{ width: '80%' }} onClick={pushToPage}>
        进入自提/外卖
      </Button>
    </div>
  )
}

export default React.memo(withRouter(Home))
