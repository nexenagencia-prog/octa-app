export type CalendarCell={date:Date;day:number;currentMonth:boolean;key:string};

export function toDateKey(year:number,month:number,day:number){
  return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

export function daysInMonth(year:number,month:number){
  return new Date(year,month+1,0).getDate();
}

export function shiftMonth(year:number,month:number,delta:number){
  const date=new Date(year,month+delta,1);
  return{year:date.getFullYear(),month:date.getMonth()};
}

export function buildMonthGrid(year:number,month:number):CalendarCell[]{
  const first=new Date(year,month,1);
  const mondayOffset=(first.getDay()+6)%7;
  const gridStart=new Date(year,month,1-mondayOffset);
  return Array.from({length:42},(_,index)=>{
    const date=new Date(gridStart);
    date.setDate(gridStart.getDate()+index);
    return{date,day:date.getDate(),currentMonth:date.getMonth()===month,key:toDateKey(date.getFullYear(),date.getMonth(),date.getDate())};
  });
}
