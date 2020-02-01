import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Main from './main'
import Synthwave from './synthwave'
// import Shooter from './shooter'

const App = () => {
  return (
    <Switch>
      <Route exact path='/' component={Main} />
      <Route exact path='/synthwave' component={Synthwave} />
      {/* <Route exact path='/x2' component={Shooter} /> */}
    </Switch>
  )
}

export default App
