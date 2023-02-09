import React from 'react';
import { Provider } from 'react-redux'
// import { IconStyle } from './assets/iconfont/iconfont';
// import { GlobalStyle } from './style';
import { renderRoutes } from 'react-router-config';//renderRoutes 读取路由配置转化为 Route 标签
import routes from './routes/index.js';
import store from './store/index'
import { HashRouter } from 'react-router-dom';
import { Data } from './application/Singers/data';

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        {/*<GlobalStyle></GlobalStyle>*/}
        {/*<IconStyle></IconStyle>*/}
        <Data>
          {renderRoutes(routes)}
        </Data>
      </HashRouter>
    </Provider>
  );
}

export default App;
