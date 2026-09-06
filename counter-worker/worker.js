const PROD='https://ceo-body.pages.dev';
const allowedOrigin=origin=>origin===PROD||/^https:\/\/[a-z0-9-]+\.ceo-body\.pages\.dev$/i.test(origin)||/^http:\/\/(127\.0\.0\.1|localhost):\d+$/i.test(origin);
const cors=origin=>({
  'Access-Control-Allow-Origin':allowedOrigin(origin)?origin:PROD,
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type',
  'Cache-Control':'no-store',
  'Content-Type':'application/json; charset=utf-8',
  'Vary':'Origin'
});
const reply=(body,status,origin)=>new Response(JSON.stringify(body),{status,headers:cors(origin)});

export default {
  async fetch(request,env){
    const origin=request.headers.get('Origin')||'';
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
    const url=new URL(request.url);
    if(url.pathname!=='/count')return reply({error:'not_found'},404,origin);
    if(request.method==='POST'){
      let body={};try{body=await request.json();}catch{}
      const id=String(body?.visitorId||'');
      if(!/^[a-z0-9-]{16,80}$/i.test(id))return reply({error:'invalid_visitor'},400,origin);
      await env.DB.prepare('INSERT OR IGNORE INTO visitors (id) VALUES (?)').bind(id).run();
    }else if(request.method!=='GET')return reply({error:'method_not_allowed'},405,origin);
    const row=await env.DB.prepare('SELECT COUNT(*) AS count FROM visitors').first();
    return reply({count:Number(row?.count)||0},200,origin);
  }
};
