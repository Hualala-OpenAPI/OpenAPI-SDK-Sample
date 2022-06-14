import React, { FC, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Form, Input, Radio, RadioChangeEvent, TimePicker } from 'antd'
import moment from 'moment'
import MainHeader from '../../containers/Main/components/MainHeader'
import { setModuleConfig } from '../../store/actions/Common'
import { ROUTERS } from '../../CONSTANT'
import { IModuleConfig } from '../../types/store/common'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import './index.less'

type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = RouteComponentProps & MapDispatchToProps

const OptionPage: FC<IProps> = props => {
  const [form] = Form.useForm()
  const [dineWayValue, updateDineWayValue] = useState(1)

  const handleSubmit = () => {
    form.validateFields().then((values: IModuleConfig) => {
      props.setModuleConfig(values)
      props.history.push({ pathname: ROUTERS.SHOP })
    })
  }

  const dineWayOnChange = (e: RadioChangeEvent) => {
    const { value } = e.target
    updateDineWayValue(value)
  }
  return (
    <div className="option-page">
      <MainHeader title="请选择配置项" />
      <Form
        form={form}
        labelCol={{ span: 5 }}
        initialValues={{
          peopleNum: 1,
          dineWay: 1,
          orderTime: moment(),
          username: '张三',
          telephone: '13312345678',
          address: '北京市西城区凯德Mall'
        }}
      >
        <Form.Item label="用餐人数" name="peopleNum" required>
          <Radio.Group>
            <Radio value={1}>1人</Radio>
            <Radio value={2}>2人</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="就餐方式" name="dineWay" required>
          <Radio.Group onChange={dineWayOnChange}>
            <Radio value={1}>自提</Radio>
            <Radio value={2}>商家自配送</Radio>
            <Radio value={3} disabled>
              哗啦啦聚合配送(需要联系项目经理对接相关业务)
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={dineWayValue === 1 ? '自提时间' : '期望送达时间'} name="orderTime" required>
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item label="收货人" name="username" required>
          <Input disabled />
        </Form.Item>
        <Form.Item label="收货电话" name="telephone" required>
          <Input disabled />
        </Form.Item>
        {dineWayValue === 2 ? (
          <Form.Item label="收货地址" name="address" required>
            <Input disabled />
          </Form.Item>
        ) : null}
      </Form>

      <div className="fix-btn">
        <Button type="primary" className="button" onClick={handleSubmit}>
          下一步
        </Button>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setModuleConfig(config: IModuleConfig) {
    dispatch(setModuleConfig(config))
  }
})
export default React.memo(connect(null, mapDispatchToProps)(withRouter(OptionPage)))
