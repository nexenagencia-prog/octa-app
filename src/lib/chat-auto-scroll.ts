export const AUTO_SCROLL_THRESHOLD_PX=72;
export function isNearChatBottom({scrollTop,scrollHeight,clientHeight}:{scrollTop:number;scrollHeight:number;clientHeight:number},threshold=AUTO_SCROLL_THRESHOLD_PX){return scrollHeight-scrollTop-clientHeight<=threshold}
