const ENDPOINT='https://ceo-body-counter.disomanceo.workers.dev/count';
const storageKey='ceo-body-anon-visitor-v1';
let currentCount=null;

function visitorId(){
  try{
    let id=localStorage.getItem(storageKey);
    if(!id){
      id=globalThis.crypto?.randomUUID?.()||('v-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2));
      localStorage.setItem(storageKey,id);
    }
    return id;
  }catch{return 'session-'+Math.random().toString(36).slice(2)+Date.now().toString(36);}
}

export function renderVisitorCounter(element,lang='th'){
  if(!element)return;
  const label=lang==='th'?'ผู้เข้าชม':'Visitors';
  element.textContent=`◉ ${label} ${currentCount==null?'—':Number(currentCount).toLocaleString(lang==='th'?'th-TH':'en-US')}`;
  element.title=lang==='th'?'จำนวนผู้เข้าชมโดยประมาณแบบไม่ระบุตัวตน (นับหนึ่งครั้งต่อเบราว์เซอร์)':'Approximate anonymous unique visitors (one count per browser).';
}

export async function initVisitorCounter(element,lang='th'){
  renderVisitorCounter(element,lang);
  const production=location.hostname==='ceo-body.pages.dev';
  const options=production?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorId:visitorId()})}:{method:'GET'};
  try{
    const response=await fetch(ENDPOINT,{...options,cache:'no-store'});
    if(!response.ok)throw new Error(`counter ${response.status}`);
    const data=await response.json();
    currentCount=Number(data?.count)||0;
    renderVisitorCounter(element,lang);
  }catch{
    element.title=lang==='th'?'เคาน์เตอร์ผู้เข้าชมไม่พร้อมใช้งานชั่วคราว':'Visitor counter is temporarily unavailable.';
  }
  return currentCount;
}
