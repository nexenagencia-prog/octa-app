'use client';
import { useEffect, useState } from 'react';
import { applyCalculatorInput, createCalculatorState } from '@/lib/calculator.mjs';

const keys=['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='];
const mapKey=(key:string)=>({Enter:'=',Backspace:'⌫',Escape:'C','/':'÷','*':'×','-':'−'} as Record<string,string>)[key]??key;

export function CalculatorPanel(){
  const [state,setState]=useState(createCalculatorState());
  const press=(key:string)=>setState((s:any)=>applyCalculatorInput(s,key));
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{const k=mapKey(e.key);if(/^\d$/.test(k)||['.','=','⌫','C','%','÷','×','−','+'].includes(k)){e.preventDefault();press(k)}};
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[]);
  return <div className="calculator-shell">
    <div className="calculator-display"><span>{state.op&&state.acc!==null?`${state.acc} ${state.op}`:''}</span><strong>{state.display}</strong></div>
    <div className="calculator-grid">{keys.map(key=><button key={key} onClick={()=>press(key)} className={`calculator-key ${['÷','×','−','+','='].includes(key)?'is-op':''} ${key==='0'?'col-span-2':''}`}>{key}</button>)}</div>
  </div>;
}
