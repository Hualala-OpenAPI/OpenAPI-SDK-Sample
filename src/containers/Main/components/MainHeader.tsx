import React, { FC } from 'react'
import { NavBar } from 'antd-mobile'
import homeIcon from '../../../assets/images/home.png'
import '../css/MainHeader.less'

type IProps = { title: string }
const MainHeader: FC<IProps> = props => {
  const { title } = props

  const backToIndex = () => {
    window.location.href = '/'
  }

  return (
    <div className="main-header">
      <NavBar mode="dark" icon={<img className="home-icon" src={homeIcon} alt="home-icon" onClick={backToIndex} />}>
        {title}
      </NavBar>
    </div>
  )
}

export default React.memo(MainHeader)
