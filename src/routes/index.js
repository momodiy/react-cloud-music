import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../application/Home'
import Recommend from '../application/Recommend'
import Singers from '../application/Singers'
import Rank from '../application/Rank'

export default [
    {
        path: "/",
        component: Home,
        routes: [
            {
                path: '/',
                // exact 默认为false， 为true时需要和路由相同才能匹配。
                // 比如 path:/one	实际路由:/one/two exact为true校验不通过
                exact: true,
                render: () => (
                    <Redirect to={"/recommend/"} />
                )
            },
            {
                path: "/recommend",
                component: Recommend
            },
            {
                path: "/singers",
                component: Singers
            },
            {
                path: "/rank",
                component: Rank
            }
        ]
    }
]