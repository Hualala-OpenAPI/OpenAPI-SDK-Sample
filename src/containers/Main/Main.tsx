import React, { FC, Suspense, useEffect } from 'react'
import { Redirect, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import NoData from '../../components/general/NoData'
import Routes from '../../routes'
import { pushApiContainer } from '../../store/actions/Api'
import './css/Main.less'

type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = MapDispatchToProps & RouteComponentProps

const Main: FC<IProps> = props => {
  const { history } = props
  const excludeApiContainer = ['/', '/option']

  useEffect(() => {
    const { pathname } = history.location
    if (!excludeApiContainer.includes(pathname)) {
      props.pushApiContainer(pathname)
    }
  }, [history?.location?.pathname])

  return (
    <div className="main" id="mainContainer">
      <Suspense fallback={<NoData>加载中...</NoData>}>
        <Switch>
          {Routes.map((item: any, index: number) => {
            const { path, component } = item
            return <Route exact key={index} path={path} component={component} />
          })}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </div>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  pushApiContainer(path: string) {
    dispatch(pushApiContainer(path))
  }
})
export default React.memo(withRouter(connect(null, mapDispatchToProps)(Main)))
