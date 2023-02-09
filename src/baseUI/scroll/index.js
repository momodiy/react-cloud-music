import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import styled from 'styled-components';
import Loading from '../loading';
import LoadingV2 from '../loading-v2';
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`;

export const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;

const Scroll = forwardRef((props, ref) => {
    const [bScroll, setBScroll] = useState();

    const scrollContaninerRef = useRef();

    const { direction, click, refresh, bounceTop, bounceBottom } = props;

    const { pullUp, pullDown, onScroll, pullUpLoading, pullDownLoading } = props;

    // 千万注意，这里不能省略依赖，
    // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。
    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp]);


    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown]);

    useEffect(() => {
        const scroll = new BScroll(scrollContaninerRef.current, {
            scrollX: direction === "horizental",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        });
        setBScroll(scroll);
        return () => {
            setBScroll(null);
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!bScroll || !onScroll) return;
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll);
        })
        return () => {
            bScroll.off('scroll');
        }
    }, [onScroll, bScroll]);

    // 上拉到底 刷新
    useEffect(() => {
        if (!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            // 判断是否滑动到了底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUp();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        }
    }, [pullUp, bScroll]);

    // 下拉调用刷新
    useEffect(() => {
        if (!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos) => {
            // 判断用户的下拉动作
            if (pos.y > 50) {
                pullDown();
            }
        });
        return () => {
            bScroll.off('touchEnd');
        }
    }, [pullDown, bScroll]);

    // 每次重新渲染，都要刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });

    useEffect(() => {
        if (!bScroll || !pullUp) return;
        const handlePullUp = () => {
            //判断是否滑动到了底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce();
            }
        };
        bScroll.on('scrollEnd', handlePullUp);
        // 解绑
        return () => {
            bScroll.off('scrollEnd', handlePullUp);
        }
    }, [pullUp, pullUpDebounce, bScroll]);

    // 判断用户的下拉动作
    useEffect(() => {
        if (!bScroll || !pullDown) return;
        const handlePullDown = (pos) => {
            //判断用户的下拉动作
            if (pos.y > 50) {
                pullDownDebounce();
            }
        };
        bScroll.on('touchEnd', handlePullDown);
        return () => {
            bScroll.off('touchEnd', handlePullDown);
        }
    }, [pullDown, pullDownDebounce, bScroll]);

    useImperativeHandle(ref, () => ({
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));

    const PullUpDisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
    const PullDownDisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
    return (
        <ScrollContainer ref={scrollContaninerRef}>
            {props.children}
            {/* 滑到底部加载动画 */}
            <PullUpLoading style={PullUpDisplayStyle}><Loading></Loading></PullUpLoading>
            {/* 顶部下拉刷新动画 */}
            <PullDownLoading style={PullDownDisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    );
})

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};

Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizental']),// 滚动的方向
    refresh: PropTypes.bool,// 是否刷新
    onScroll: PropTypes.func,// 滑动触发的回调函数
    pullUp: PropTypes.func,// 上拉加载逻辑
    pullDown: PropTypes.func,// 下拉加载逻辑
    pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool// 是否支持向上吸顶
};

export default Scroll;