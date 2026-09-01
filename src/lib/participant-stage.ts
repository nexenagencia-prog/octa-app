export type ParticipantStageState={hostId:string;participantIds:string[];focusedId:string|null;lockedId:string|null;autoSpeaker:boolean;mode:'mosaic'|'focus';size:'compact'|'normal'|'expanded'};
export type ParticipantStageAction=
 |{type:'active-speaker';participantId:string|null}
 |{type:'silence'}
 |{type:'manual-focus';participantId:string|null}
 |{type:'show-mosaic'}
 |{type:'lock';participantId:string}
 |{type:'unlock'}
 |{type:'set-auto-speaker';enabled:boolean}
 |{type:'set-size';size:ParticipantStageState['size']};

export function createStageState(hostId:string,participantIds:string[]):ParticipantStageState{
 return{hostId,participantIds:participantIds.filter(id=>id!==hostId),focusedId:null,lockedId:null,autoSpeaker:true,mode:'mosaic',size:'normal'};
}

export function stageReducer(state:ParticipantStageState,action:ParticipantStageAction):ParticipantStageState{
 switch(action.type){
  case'active-speaker':{
   const id=action.participantId;
   if(!state.autoSpeaker||state.lockedId||!id||id===state.hostId||!state.participantIds.includes(id))return state;
   return{...state,focusedId:id,mode:'focus'};
  }
  case'silence':return state;
  case'manual-focus':return action.participantId&&state.participantIds.includes(action.participantId)?{...state,focusedId:action.participantId,mode:'focus'}:state;
  case'show-mosaic':return{...state,mode:'mosaic'};
  case'lock':return state.participantIds.includes(action.participantId)?{...state,focusedId:action.participantId,lockedId:action.participantId,mode:'focus'}:state;
  case'unlock':return{...state,lockedId:null};
  case'set-auto-speaker':return{...state,autoSpeaker:action.enabled};
  case'set-size':return{...state,size:action.size};
  default:return state;
 }
}
