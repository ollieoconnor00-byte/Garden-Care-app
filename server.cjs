const express=require('express');const cors=require('cors');const webpush=require('web-push');
const app=express();app.use(cors());app.use(express.json());
const PORT=process.env.PORT||8787, PUBLIC=process.env.VAPID_PUBLIC_KEY||'', PRIVATE=process.env.VAPID_PRIVATE_KEY||'', CONTACT=process.env.VAPID_CONTACT||'mailto:admin@example.com';
if(PUBLIC&&PRIVATE)webpush.setVapidDetails(CONTACT,PUBLIC,PRIVATE);
const subscriptions=[];
app.get('/vapid-public-key',(_q,r)=>r.json({publicKey:PUBLIC}));
app.post('/subscribe',(q,r)=>{const s=q.body;if(!s?.endpoint)return r.status(400).json({error:'Invalid subscription'});if(!subscriptions.some(x=>x.endpoint===s.endpoint))subscriptions.push(s);r.status(201).json({ok:true})});
app.post('/send',async(q,r)=>{if(!PUBLIC||!PRIVATE)return r.status(500).json({error:'VAPID keys not configured'});const payload=JSON.stringify({title:'Garden Care 🌿',body:q.body?.body||"Today you're free, have fun and maybe play some golf! ⛳"});const results=await Promise.allSettled(subscriptions.map(s=>webpush.sendNotification(s,payload)));r.json({sent:results.filter(x=>x.status==='fulfilled').length})});
app.listen(PORT,()=>console.log(`Push server listening on ${PORT}`));
