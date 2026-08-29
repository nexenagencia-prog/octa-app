export function createCalculatorState(){return {display:'0',acc:null,op:null,replace:true};}
function fmt(n){if(!Number.isFinite(n)) return 'Erro'; const s=String(Number(n.toFixed(10))); return s;}
function calc(a,b,op){if(op==='+')return a+b;if(op==='−')return a-b;if(op==='×')return a*b;if(op==='÷')return b===0?NaN:a/b;return b;}
export function applyCalculatorInput(state,key){
  if(key==='C') return createCalculatorState();
  if(key==='⌫'){
    if(state.replace||state.display.length<=1||state.display==='Erro') return {...state,display:'0',replace:true};
    return {...state,display:state.display.slice(0,-1)};
  }
  if(key==='%') return {...state,display:fmt(Number(state.display)/100),replace:true};
  if(['+','−','×','÷'].includes(key)){
    const n=Number(state.display);
    if(state.acc!==null&&state.op&&!state.replace){const result=calc(state.acc,n,state.op);return {display:fmt(result),acc:result,op:key,replace:true};}
    return {...state,acc:n,op:key,replace:true};
  }
  if(key==='='){
    if(state.acc===null||!state.op) return state;
    const result=calc(state.acc,Number(state.display),state.op);
    return {display:fmt(result),acc:null,op:null,replace:true};
  }
  if(/^\d+$/.test(key)){
    const next=state.replace||state.display==='0'?key:state.display+key;
    return {...state,display:next,replace:false};
  }
  if(key==='.'){
    if(state.replace) return {...state,display:'0.',replace:false};
    if(state.display.includes('.')) return state;
    return {...state,display:state.display+'.',replace:false};
  }
  return state;
}
