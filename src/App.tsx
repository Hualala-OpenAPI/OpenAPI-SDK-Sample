import React, { useEffect } from 'react'
import Framework from './views/framework'
import 'reset-css'
import 'antd/dist/antd.less'
import './assets/App.less'
import Config from './Config'

function App() {
  useEffect(() => {
    console.log(Config)
  }, [])
  return (
    <div className="app">
      <Framework />
    </div>
  )
}

export default App
