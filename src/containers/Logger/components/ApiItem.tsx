import React, { FC } from 'react'
import { Button } from 'antd-mobile'
import ReactJson from 'react-json-view'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { filterAPIName } from '../../../Filter'
import { showToast } from '../../../Utils'
import { IApiItem } from '../../../types/store/api'
import '../css/ApiItem.less'

const ApiItem: FC<IApiItem> = props => {
  const { url, params, result } = props
  const jsonConfig = {
    indentWidth: 2,
    enableClipboard: false,
    displayDataTypes: false
  }

  const renderPanelHeader = (type: string) => {
    const copyText = type === 'params' ? JSON.stringify(params) : JSON.stringify(result)
    return (
      <CopyToClipboard text={copyText} onCopy={() => showToast({ content: `${type}复制成功`, icon: 'success' })}>
        <Button className="copy-btn" size="small">
          复制
        </Button>
      </CopyToClipboard>
    )
  }

  return (
    <div className="api-item">
      <div className="api-name item" style={{ textAlign: 'center' }}>
        <div>{filterAPIName(url)}</div>
        <div>{url}</div>
      </div>
      <div className="item">
        <div>{renderPanelHeader('params')}</div>
        <ReactJson name="params" {...jsonConfig} collapsed src={params} />
      </div>
      <div className="item">
        <div>{renderPanelHeader('result')}</div>
        <ReactJson name="result" {...jsonConfig} collapsed src={result} />
      </div>
    </div>
  )
}

export default React.memo(ApiItem)
