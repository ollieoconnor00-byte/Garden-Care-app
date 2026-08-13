import './style.css';

const root = document.getElementById('root');

const plants = [
['Hydrangea','🌸','Keep evenly moist while actively growing. Check every 2–3 days in warm/dry weather.','Softwood cuttings late spring–early summer; semi-ripe cuttings in summer.','Lightly prune after flowering; pruning depends on mophead/lacecap type.','Feed in spring and early summer with hydrangea fertiliser.','Mulch around roots, not against stems.'],
['Peruvian Lily (Alstroemeria)','🌺','Water when the top few centimetres dry; increase in hot weather.','Divide established clumps in autumn or early spring.','Remove spent flower stems at the base and remove yellow or damaged foliage.','Feed in spring and after flowering.','Avoid waterlogged soil.'],
['Star of Jasmine','🌿','Water deeply when soil begins to dry.','Take semi-ripe cuttings in summer or early autumn.','Lightly shape after flowering; remove dead/tangled growth.','Feed in spring with balanced slow-release fertiliser.','Tie new growth onto supports.'],
['Rose Bushes','🌹','Deeply water around roots when soil is dry; avoid shallow watering.','Hardwood cuttings autumn/winter or semi-ripe cuttings in warmer months.','Main pruning in winter; remove dead/diseased/crossing wood anytime.','Feed in spring and after the first major flush.','Water soil rather than foliage.'],
['Perennial Geranium','💜','Water when topsoil dries; established plants tolerate short dry periods.','Divide clumps in spring or autumn.','Cut back after main flowering flush for fresh growth.','Light balanced feed in spring.','Remove spent flowers when the scheduled deadheading task appears.'],
['Laurel','🍃','Water deeply while young; established plants need extra water in prolonged dry weather.','Semi-ripe cuttings late summer/early autumn.','Trim hedges late spring/summer; remove damaged branches.','Feed in spring with slow-release fertiliser.','Mulch annually.'],
['Azalea','🌺','Keep consistently moist but not waterlogged.','Semi-ripe cuttings in summer.','Prune lightly straight after flowering.','Feed after flowering with acid-loving plant fertiliser.','Rainwater is useful where practical.'],
['Lavender','🪻','Let soil dry between watering; established lavender is drought tolerant.','Semi-ripe cuttings late summer/early autumn.','Light trim after flowering; never cut deeply into old bare wood.','Usually needs little fertiliser; avoid high nitrogen.','Excellent drainage matters most.'],
['Alliums','🧅','Water during growth/flowering if rainfall is low; allow some drying.','Divide bulbs/offsets when dormant, usually autumn.','Leave foliage until naturally yellow; remove only spent heads if desired.','Feed in spring if growth is weak.','Seed heads can provide winter structure.'],
['Daffodils','🌼','Water during active growth if soil is dry; reduce after foliage dies back.','Lift/divide congested clumps after foliage dies back.','Do not cut foliage until naturally yellow; remove spent flowers.','Feed as shoots emerge and after flowering if needed.','Foliage replenishes the bulb.'],
['Tulips','🌷','Keep evenly moist while growing/flowering; avoid soggy soil.','Separate offsets after foliage dies back.','Remove spent flowers but leave foliage until it dies back.','Feed as growth starts and after flowering if naturalising.','Good drainage is essential.'],
['Camellia','🌺','Keep evenly moist, especially during flowering and bud formation.','Semi-ripe cuttings in summer.','Lightly prune after flowering.','Feed after flowering with acid-loving fertiliser.','Mulch with compost/leaf mould away from trunk.'],
['Red Robin (Photinia)','🍃','Water deeply while establishing; extra water in prolonged hot/dry weather.','Semi-ripe cuttings in summer.','Trim after a flush of red growth to encourage another flush.','Feed in spring with general slow-release fertiliser.','Good airflow helps reduce leaf spot.'],
['Forsythia','🌼','Water deeply while establishing; mature plants usually need little extra.','Softwood cuttings late spring or semi-ripe cuttings summer.','Prune immediately after flowering; remove older stems at ground level.','Feed in spring if growth is weak.','Wrong-time pruning can remove next season’s buds.']
].map(x=>({name:x[0],icon:x[1],water:x[2],propagate:x[3],prune:x[4],feed:x[5],notes:x[6]}));

const STORAGE='garden-care-v2';
const DONE='garden-done-v2';
const NOTIFY='garden-notify-v2';
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
let settings=load(STORAGE,{selected:plants.map(p=>p.name),notifications:false});
let done=load(DONE,{});

// This is a Sydney-oriented CARE CALENDAR, not a generic monthly rotation.
// A dated event appears only inside its sensible seasonal window. Frequency means
// a maintenance check inside that window; annual jobs appear once.
// UK / England seasonal schedule. Annual jobs have a preferred date or a short window,
// so a job is NOT repeated every day. Recurring jobs (e.g. rose deadheading) use a cadence.
const events=[
['Hydrangea','prune',[1,15],[2,31],365,'Prune hydrangea','Late winter/early spring. Mophead and lacecap types need light pruning; panicle/smooth types can be pruned harder.'],
['Hydrangea','feed',[2,1],[3,31],365,'Feed hydrangea','Feed in spring as growth begins; use a suitable hydrangea fertiliser.'],
['Hydrangea','water',[4,1],[8,31],5,'Check hydrangea moisture','Check the soil and water deeply if it is drying out. Container plants may need more frequent checks.'],
['Peruvian Lily (Alstroemeria)','propagate',[2,1],[4,30],365,'Divide Peruvian lily','Divide established clumps in spring or autumn when conditions are suitable.'],
['Peruvian Lily (Alstroemeria)','prune',[4,1],[9,30],14,'Tidy Peruvian lily','Remove spent flower stems at the base and yellow or damaged foliage.'],
['Peruvian Lily (Alstroemeria)','feed',[2,1],[5,31],365,'Feed Peruvian lily','Feed during active growth and after flowering with a balanced fertiliser.'],
['Peruvian Lily (Alstroemeria)','water',[4,1],[8,31],5,'Check Peruvian lily moisture','Water when the top few centimetres of soil dry.'],

['Star of Jasmine','prune',[6,1],[7,31],365,'Prune star jasmine','Prune and shape after flowering. Remove dead, damaged or tangled growth and tie in new shoots.'],
['Star of Jasmine','propagate',[6,1],[8,31],365,'Take star jasmine cuttings','Take semi-ripe cuttings from healthy non-flowering growth in summer.'],
['Star of Jasmine','feed',[2,1],[4,30],365,'Feed star jasmine','Apply a balanced slow-release fertiliser in spring.'],
['Star of Jasmine','water',[4,1],[8,31],5,'Check star jasmine moisture','Check the soil and water deeply if it is drying out.'],

['Rose Bushes','prune',[1,15],[2,29],365,'Winter prune roses','Main annual prune for most bush roses: remove dead, diseased and crossing wood and open the centre. Exact timing varies by rose type and local weather.'],
['Rose Bushes','feed',[2,1],[3,31],365,'Feed roses','Feed as winter ends and new growth begins.'],
['Rose Bushes','feed',[5,1],[6,30],365,'Feed roses after first flush','Feed again after the first major flush of flowers.'],
['Rose Bushes','prune',[5,1],[9,30],7,'Deadhead roses','Remove faded flowers. This task is scheduled every 7 days during the flowering season.'],
['Rose Bushes','propagate',[9,1],[11,30],365,'Take rose cuttings','Take hardwood cuttings in autumn from healthy stems.'],
['Rose Bushes','water',[4,1],[8,31],5,'Check rose moisture','Check the soil and water deeply at the root zone if dry.'],

['Perennial Geranium','prune',[6,1],[8,31],365,'Cut back perennial geranium','Cut back after the main flowering flush to encourage fresh foliage and possible repeat flowering.'],
['Perennial Geranium','propagate',[2,1],[4,30],365,'Divide perennial geranium','Divide established clumps in spring or autumn.'],
['Perennial Geranium','feed',[2,1],[4,30],365,'Feed perennial geranium','Apply a light balanced feed in spring.'],
['Perennial Geranium','water',[4,1],[8,31],7,'Check geranium moisture','Water when the top layer of soil dries.'],

['Laurel','prune',[5,1],[6,30],365,'Trim laurel','Trim hedges after the spring flush. Remove damaged branches at any time.'],
['Laurel','propagate',[7,1],[9,30],365,'Take laurel cuttings','Take semi-ripe cuttings in late summer.'],
['Laurel','feed',[2,1],[3,31],365,'Feed laurel','Apply a general-purpose slow-release fertiliser in spring.'],
['Laurel','water',[4,1],[8,31],10,'Check laurel moisture','Established laurels usually need extra water only during prolonged dry weather.'],

['Azalea','prune',[4,1],[5,31],365,'Prune azalea','Prune lightly immediately after flowering. Avoid heavy pruning later in the season.'],
['Azalea','feed',[4,1],[6,30],365,'Feed azalea','Feed after flowering with fertiliser suitable for acid-loving plants.'],
['Azalea','propagate',[6,1],[8,31],365,'Take azalea cuttings','Take semi-ripe cuttings in summer.'],
['Azalea','water',[4,1],[8,31],5,'Check azalea moisture','Keep the root zone evenly moist but not waterlogged.'],

['Lavender','prune',[7,1],[8,31],365,'Prune lavender','Lightly trim after flowering, keeping the plant compact. Never cut deeply into old bare wood.'],
['Lavender','propagate',[7,1],[9,30],365,'Take lavender cuttings','Take semi-ripe cuttings from healthy, non-flowering shoots in late summer.'],
['Lavender','water',[4,1],[8,31],10,'Check lavender moisture','Let the soil dry between watering. Established lavender is drought tolerant.'],

['Alliums','feed',[2,1],[4,30],365,'Feed alliums','A light bulb fertiliser can help if growth is weak.'],
['Alliums','prune',[5,1],[8,31],14,'Check allium foliage','Leave green foliage alone. Remove spent flower heads if desired; allow foliage to yellow naturally.'],
['Alliums','propagate',[6,1],[9,30],365,'Divide alliums','Lift and separate offsets once flowering is over and foliage has died back.'],
['Alliums','water',[2,1],[6,30],10,'Check allium moisture','Usually little watering is needed in the ground; water containers when compost dries.'],

['Daffodils','feed',[2,1],[4,30],365,'Feed daffodils','Feed as shoots emerge and, if needed, after flowering.'],
['Daffodils','prune',[4,15],[6,30],365,'Check daffodil foliage','Do not cut green leaves. Remove foliage only once it has naturally yellowed, usually about six weeks after flowering.'],
['Daffodils','propagate',[5,1],[7,31],365,'Divide daffodils','Lift and divide congested clumps after foliage has died back.'],
['Daffodils','water',[1,1],[5,31],7,'Check daffodil moisture','Water during active growth if the soil is dry, especially in containers.'],

['Tulips','feed',[2,1],[5,31],14,'Feed tulips','Feed once growth begins; stop when leaves start to yellow.'],
['Tulips','prune',[4,15],[6,30],365,'Check tulip foliage','Remove spent flower heads, but leave foliage until it turns yellow and dies back.'],
['Tulips','propagate',[5,1],[7,31],365,'Separate tulip offsets','Lift and separate offsets after foliage dies back.'],
['Tulips','water',[2,1],[5,31],7,'Check tulip moisture','Keep evenly moist while growing and flowering, but avoid soggy soil.'],

['Camellia','prune',[3,1],[5,31],365,'Prune camellia','Prune lightly after flowering. Remove dead, damaged or awkward growth first.'],
['Camellia','feed',[3,1],[5,31],365,'Feed camellia','Feed after flowering with fertiliser suitable for acid-loving plants.'],
['Camellia','propagate',[6,1],[8,31],365,'Take camellia cuttings','Take semi-ripe cuttings in summer.'],
['Camellia','water',[6,1],[8,31],5,'Check camellia moisture','Keep soil evenly moist, especially while buds are forming.'],

['Red Robin (Photinia)','prune',[5,1],[7,31],365,'Trim Red Robin','Trim after a flush of red growth if you want to encourage another flush.'],
['Red Robin (Photinia)','propagate',[7,1],[9,30],365,'Take Red Robin cuttings','Take semi-ripe cuttings in summer.'],
['Red Robin (Photinia)','feed',[2,1],[4,30],365,'Feed Red Robin','Apply a general-purpose slow-release fertiliser in spring.'],
['Red Robin (Photinia)','water',[4,1],[8,31],10,'Check Red Robin moisture','Water deeply during prolonged dry weather.'],

['Forsythia','prune',[3,1],[4,30],365,'Prune forsythia','Prune immediately after flowering. Remove some of the oldest stems from the base.'],
['Forsythia','propagate',[5,1],[7,31],365,'Take forsythia cuttings','Take suitable softwood or semi-ripe cuttings from healthy growth.'],
['Forsythia','feed',[2,1],[4,30],365,'Feed forsythia','No routine feed is required. Feed in spring only when growth is weak.'],
['Forsythia','water',[4,1],[8,31],10,'Check forsythia moisture','Water deeply while establishing and during prolonged dry weather.']
].map(e=>({plant:e[0],type:e[1],start:e[2],end:e[3],frequency:e[4],title:e[5],text:e[6]}));

const today=()=>{const d=new Date();d.setHours(12,0,0,0);return d};
const dateAt=i=>{const d=today();d.setDate(d.getDate()+i);return d};
const iso=d=>d.toISOString().slice(0,10);
const fmt=d=>d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
const typeIcon=t=>({water:'💧',propagate:'✂️',prune:'✂️',feed:'🌱'})[t]||'📝';
const typeName=t=>({water:'Water',propagate:'Propagate',prune:'Prune',feed:'Feed'})[t]||t;
const mdDate=(year,md)=>new Date(year,md[0],md[1],12);

function inWindow(date,start,end){
  let s=mdDate(date.getFullYear(),start), e=mdDate(date.getFullYear(),end);
  if(e<s) return date>=s || date<=e;
  return date>=s && date<=e;
}
function due(event,date){
  if(!inWindow(date,event.start,event.end)) return false;
  const anchor=mdDate(date.getFullYear(),event.start);
  let diff=Math.floor((date-anchor)/86400000);
  if(diff<0) diff+=366;
  // 365 = annual job: show it only on the anchor date, never every day in the window.
  if(event.frequency===365) return diff===0;
  return diff%event.frequency===0;
}
function tasksFor(i){
  const d=dateAt(i), out=[];
  for(const e of events){
    if(!settings.selected.includes(e.plant) || !due(e,d)) continue;
    const p=plants.find(x=>x.name===e.plant);
    out.push({id:`${iso(d)}|${e.plant}|${e.type}|${e.title}`,plant:e.plant,type:e.type,title:e.title,text:e.text,icon:p.icon});
  }
  return out;
}

function canComplete(taskId){
  return taskId.startsWith(iso(today())+'|');
}

function render(){
  root.innerHTML=`<div class="shell"><header><div><small>🌿 YOUR GARDEN</small><h1>Garden Care Calendar</h1><p>A real seasonal care schedule — not a task every few days.</p></div><button id="notify">${settings.notifications?'🔔 Notifications on':'🔕 Turn on notifications'}</button></header><div class="notice"><b>Smart schedule:</b> jobs appear only when they are seasonally due. Watering is a soil check, because rain, heat and soil conditions can change what your garden needs.</div><section><div class="heading"><div><h2>Next 5 days</h2><p>${fmt(dateAt(0))} – ${fmt(dateAt(4))}</p></div></div><div class="days">${[0,1,2,3,4].map(i=>{const ts=tasksFor(i);return `<div class="day"><div class="dayhead"><div><b>${dateAt(i).toLocaleDateString(undefined,{weekday:'long'})}</b><small>${dateAt(i).toLocaleDateString(undefined,{day:'numeric',month:'long'})}</small></div><span>${ts.length} job${ts.length===1?'':'s'}</span></div>${ts.length?ts.map(t=>`<article class="task ${done[t.id]?'done':''}"><button class="check" data-id="${t.id}" ${canComplete(t.id)?'':'disabled'} title="${canComplete(t.id)?'Mark done':'You can only complete a job on the day it is due'}">${done[t.id]?'✓':''}</button><div class="emoji">${t.icon}</div><div><strong>${typeIcon(t.type)} ${t.title}</strong><label>${t.plant}</label><p>${t.text}</p></div></article>`).join(''):'<div class="empty">Nothing specifically due today 🌿</div>'}</div>`}).join('')}</div></section><section><div class="heading"><div><h2>Your plants</h2><p>Click a plant for watering, propagation, pruning, feeding and notes.</p></div></div><div class="plants">${plants.map(p=>`<button class="plant" data-name="${p.name}"><span>${p.icon}</span><b>${p.name}</b></button>`).join('')}</div></section><footer><button id="settings">⚙️ Settings</button><span>General gardening guidance. Adjust for your exact variety and garden conditions.</span></footer></div><div id="modal" class="modal hidden"></div>`;
  root.querySelectorAll('.check').forEach(b=>{
  if(!b.disabled) b.onclick=()=>{done[b.dataset.id]=!done[b.dataset.id];localStorage.setItem(DONE,JSON.stringify(done));render()};
});
  root.querySelector('#notify').onclick=enableNotifications;
  root.querySelector('#settings').onclick=showSettings;
  root.querySelectorAll('.plant').forEach(b=>b.onclick=()=>showPlant(b.dataset.name));
  if(settings.notifications)checkNotifications();
}
function showPlant(name){const p=plants.find(x=>x.name===name);openModal(`<button class="close" id="close">×</button><div class="big">${p.icon}</div><h2>${p.name}</h2>${[['💧 Water',p.water],['✂️ Propagate',p.propagate],['✂️ Prune',p.prune],['🌱 Feed',p.feed],['📝 Notes',p.notes]].map(x=>`<div class="care"><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}`)}
function showSettings(){openModal(`<button class="close" id="close">×</button><h2>Settings</h2><p>Choose which plants appear in your five-day list.</p><div class="checks">${plants.map(p=>`<label><input type="checkbox" data-p="${p.name}" ${settings.selected.includes(p.name)?'checked':''}> ${p.icon} ${p.name}</label>`).join('')}</div><button class="save" id="save">Save settings</button>`);root.querySelector('#save').onclick=()=>{settings.selected=[...root.querySelectorAll('[data-p]:checked')].map(x=>x.dataset.p);localStorage.setItem(STORAGE,JSON.stringify(settings));document.querySelector('#modal').classList.add('hidden');render()}}
function openModal(html){const m=document.querySelector('#modal');m.innerHTML=`<div class="modalbox">${html}</div>`;m.classList.remove('hidden');document.querySelector('#close').onclick=()=>m.classList.add('hidden');m.onclick=e=>{if(e.target===m)m.classList.add('hidden')}}
async function enableNotifications(){
  try{
    if(!('serviceWorker' in navigator)){
      alert('This browser does not support background notifications.');
      return;
    }

    if(!('PushManager' in window)){
      alert('This browser does not support push notifications.');
      return;
    }

    const permission=await Notification.requestPermission();

    if(permission!=='granted'){
      alert('Notifications were not allowed. Enable them in your browser settings.');
      return;
    }

    const registration=await navigator.serviceWorker.register('/sw.js');

    const keyResponse=await fetch('/vapid-public-key');

    if(!keyResponse.ok){
      throw new Error('Could not get the notification server key.');
    }

    const {publicKey}=await keyResponse.json();

    if(!publicKey){
      throw new Error('The VAPID public key is missing on the server.');
    }

    let subscription=await registration.pushManager.getSubscription();

    if(!subscription){
      subscription=await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(publicKey)
      });
    }

    const response=await fetch('/subscribe',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(subscription)
    });

    if(!response.ok){
      throw new Error('The server could not save the notification subscription.');
    }

    settings.notifications=true;
    localStorage.setItem(
      STORAGE,
      JSON.stringify(settings)
    );

    alert(
      'Garden notifications are now enabled 🌿\n\n' +
      'You can receive reminders even when the website is closed.'
    );

    render();

  }catch(error){
    console.error('Notification setup failed:',error);

    alert(
      'Notifications could not be enabled.\n\n' +
      error.message
    );
  }
}


function urlBase64ToUint8Array(base64String){
  const padding='='.repeat(
    (4-base64String.length%4)%4
  );

  const base64=(base64String+padding)
    .replace(/-/g,'+')
    .replace(/_/g,'/');

  const rawData=window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(char=>char.charCodeAt(0))
  );
}


function checkNotifications(){
}
render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkNotifications();render()}});
