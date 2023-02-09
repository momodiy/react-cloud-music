import React from 'react';
import {
    ListWrapper,
    ListItem,
    List
} from './style';
import { getCount } from "../../api/utils";
import LazyLoad from "react-lazyload";
import { withRouter } from 'react-router-dom';

function RecommendList(props) {
  /***
   * 这里 List 组件作为 Recommend 的子组件，并不能从 props 拿到 history 变量，无法跳转路由
   *    1. 将 Recommend 组件中 props 对象中的 history 属性传给 List 组件
   *    2. 将List 组件用 withRouter 包裹 (实际使用)
   */

  const enterDetail = id => {
    console.log(id)
    props.history.push(`/recommend${id}/`)
  }
    return (
        <ListWrapper>
            <h1 className="title"> 推荐歌单 </h1>
            <List>
                {
                    props.recommendList.map((item, index) => {
                        return (
                            <ListItem key={item.id + index} onClick={()=> enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <div className="decorate"></div>
                                    {/* 加此参数可以减小请求的图片资源大小 */}
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music" />}>
                                        <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                    <div className="play_count">
                                        <i className="iconfont play">&#xe885;</i>
                                        <span className="count">{getCount(item.playCount)}</span>
                                    </div>
                                </div>
                                <div className="desc">{item.name}</div>
                            </ListItem>
                        )
                    })
                }
            </List>
        </ListWrapper>
    );
}

export default React.memo(withRouter(RecommendList));