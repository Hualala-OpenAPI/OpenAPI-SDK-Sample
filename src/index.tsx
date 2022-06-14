import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

import Store, { persistor } from './store'
import App from './App'

ReactDOM.render(
  <BrowserRouter>
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
