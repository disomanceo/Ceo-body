export function attemptPercent(attempt){
 const total=Number(attempt?.total)||0,score=Number(attempt?.score)||0;
 return total>0?Math.round(score/total*100):0;
}

export function bestAttempt(history=[]){
 return history.filter(x=>Number(x?.total)>0).reduce((best,item)=>{
  if(!best)return item;
  const a=Number(item.score)/Number(item.total),b=Number(best.score)/Number(best.total);
  return a>b||(a===b&&Number(item.score)>Number(best.score))?item:best;
 },null);
}

export function summarizeHistories(rows=[]){
 const attempts=rows.flatMap(r=>(r.history||[]).map(a=>({...a,id:r.id,title:r.title})));
 const attemptedSystems=rows.filter(r=>(r.history||[]).length).length;
 const average=attempts.length?Math.round(attempts.reduce((s,a)=>s+attemptPercent(a),0)/attempts.length):0;
 const latest=attempts.reduce((best,a)=>!best||String(a.at)>String(best.at)?a:best,null);
 return {attemptedSystems,totalSystems:rows.length,totalAttempts:attempts.length,average,latest};
}

const csvCell=value=>'"'+String(value??'').replaceAll('"','""')+'"';
export function resultsCsv(rows=[],lang='en'){
 const th=lang==='th';
 const header=th?['ระบบ','ครั้งที่','คะแนน','เต็ม','ร้อยละ','วันที่เวลา']:['System','Attempt','Score','Total','Percent','Date/time'];
 const lines=[header.map(csvCell).join(',')];
 for(const row of rows){
  const history=row.history||[];
  history.forEach((a,index)=>lines.push([row.title,index+1,a.score,a.total,attemptPercent(a),a.at||''].map(csvCell).join(',')));
 }
 return '\ufeff'+lines.join('\r\n');
}
