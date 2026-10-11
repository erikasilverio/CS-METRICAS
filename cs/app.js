let DATA=[];const SEED=[
["Acme Logística","Ana","Enterprise",18500,35,82,76,8,2,6,0,1],
["Boreal Foods","Bruno","Mid-Market",6200,52,41,38,4,7,41,35,0],
["Cobalto Bank","Ana","Enterprise",24000,120,91,88,9,1,3,0,1],
["Delta Salud","Carla","Mid-Market",5400,28,55,47,5,5,22,12,1],
["Eólica Sur","Bruno","SMB",1900,75,30,25,3,6,58,48,0],
["Fénix Retail","Carla","Mid-Market",7800,160,74,69,7,3,12,0,1],
["Gaia Energy","Ana","Enterprise",15200,48,63,58,6,4,18,0,1],
["Horizonte Edu","Diego","SMB",2300,200,88,81,9,0,5,0,1],
["Ícaro Telecom","Diego","Enterprise",21000,22,48,44,4,8,35,28,0],
["Jade Seguros","Carla","Mid-Market",6900,95,79,72,8,2,9,0,1],
["Kappa Tech","Bruno","SMB",1500,40,58,61,6,3,27,0,0],
["Lumen Pharma","Ana","Mid-Market",8800,68,36,33,2,9,47,40,0],
["Mar Azul Hotéis","Diego","SMB",2700,140,69,64,7,2,14,0,1],
["Nova Agro","Carla","Mid-Market",5100,30,67,50,6,6,31,5,1]
].map(a=>({n:a[0],csm:"Erika",plan:a[2],mrr:a[3],ren:a[4],uso:a[5],ado:a[6],nps:a[7],tk:a[8],lc:a[9],mora:a[10],ch:a[11],tm:Math.round(a[5]/6+a[7]),tp:Math.round(a[5]/6+a[7]+(a[3]%7)-3),cs:+(3+a[5]/50).toFixed(1),ex:a[5]>75?Math.round(a[3]*.12):0,ct:a[5]<45?Math.round(a[3]*.15):0,est:a[0]=="Lumen Pharma"?1:0,ttv:Math.round(100-a[6]*.8)}));
const cl=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
function calc(a){
a.cs=a.cs??4;a.ex=a.ex||0;a.ct=a.ct||0;a.est=a.est||0;a.ttv=a.ttv||0;
a.m={uso:a.uso,ado:a.ado,nps:a.nps*10,tk:cl(100-a.tk*12),lc:cl(100-a.lc*2.5),pg:cl(100-Math.min(a.mora,60)*1.6),ch:a.ch?100:20};
a.h=Math.round(.25*a.m.uso+.2*a.m.ado+.15*a.m.nps+.15*a.m.tk+.1*a.m.lc+.1*a.m.pg+.05*a.m.ch);
a.p=Math.round(cl((100-a.h)*.9+(a.ren<=60?8:0)+(a.mora>30?6:0),2,97));
a.s=a.h>=70?"G":a.h>=45?"Y":"R";
a.pc=a.tp>0?Math.round((a.tm-a.tp)/a.tp*100):(a.tm>0?100:0);
return a}
const $=id=>document.getElementById(id),fmt=n=>"$"+n.toLocaleString("es-AR"),col={G:"var(--g)",Y:"var(--y)",R:"var(--r)"},lab={G:"Saludable",Y:"Atención",R:"Riesgo"};
const sc=v=>v>=70?"G":v>=45?"Y":"R";
let st={q:"",csm:"",s:"",k:"p",d:-1};
const cols=[["n","Cuenta"],["s","Semáforo"],["h","Health"],["p","Chance baja"],["mrr","MRR"],["ren","Renueva (d)"],["uso","Uso"],["nps","NPS"],["tk","Tickets"],["lc","Últ. contacto (d)"],["tm","Tareas mes / ant."],["pc","Δ% tareas"],["csm","CSM"],["_",""]];
function bar(v,s){return `<span class="mb"><i style="width:${v}%;background:${col[s]}"></i></span>`}
function kpis(){
const T=DATA.reduce((x,a)=>x+a.mrr,0),R=DATA.filter(a=>a.s=="R"),risk=R.reduce((x,a)=>x+a.mrr,0);
const exp=DATA.reduce((x,a)=>x+a.mrr*a.p/100,0),ren=DATA.filter(a=>a.ren<=90);
const nps=(DATA.reduce((x,a)=>x+a.nps,0)/DATA.length).toFixed(1),hs=Math.round(DATA.reduce((x,a)=>x+a.h,0)/DATA.length);
const k=[["Cuentas",DATA.length],["MRR total",fmt(T)],["MRR en riesgo",fmt(risk)+" ("+Math.round(risk/T*100)+"%)"],["MRR esperado a perder",fmt(Math.round(exp))],["Health medio",hs],["NPS (score)",Math.round(100*(DATA.filter(a=>a.nps>=9).length-DATA.filter(a=>a.nps<=6).length)/DATA.length)],["Cuentas en rojo",R.length],["Renuevan ≤90d",ren.length+" · "+fmt(ren.reduce((x,a)=>x+a.mrr,0))],["Tareas del mes",tt().a+" ("+tt().s+" vs ant.)"]];
const KD={"Cuentas":"Cuentas activas en la cartera.","MRR total":"Ingreso recurrente mensual de las cuentas activas.","MRR en riesgo":"MRR de las cuentas en rojo (Health menor a 45).","MRR esperado a perder":"Suma de MRR × chance de baja de cada cuenta.","Health medio":"Promedio del Health Score, de 0 a 100.","NPS (score)":"% de promotores menos % de detractores.","Cuentas en rojo":"Cuentas con Health menor a 45.","Renuevan ≤90d":"Contratos que vencen en 90 días y su MRR.","Tareas del mes":"Tareas completadas y variación vs. el mes anterior."};
$("kpis").innerHTML=k.map(x=>`<div class="card kpi"><span>${x[0]}</span><b>${x[1]}</b><small>${KD[x[0]]||""}</small></div>`).join("");
const seg=(f)=>["G","Y","R"].map(s=>{const v=DATA.filter(a=>a.s==s).reduce((x,a)=>x+f(a),0);return[s,v]});
const draw=(el,f,tot,u)=>$(el).innerHTML=`<div class="bar">${seg(f).filter(x=>x[1]).map(x=>`<i class="${x[0]}" style="width:${x[1]/tot*100}%">${u(x[1])}</i>`).join("")}</div>`;

$("top").innerHTML=[...DATA].sort((a,b)=>b.p-a.p).slice(0,5).map(a=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--bd);cursor:pointer" onclick="op('${a.n}')"><span>${a.n}</span><span><b style="color:${col[a.s]}">${a.p}%</b> · ${fmt(a.mrr)}</span></div>`).join("");
$("ren").innerHTML=[...ren].sort((a,b)=>a.ren-b.ren).map(a=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--bd);cursor:pointer" onclick="op('${a.n}')"><span><i class="dot ${a.s}"></i>${a.n}</span><span>${a.ren} d · ${fmt(a.mrr)}</span></div>`).join("");
}
function table(){$("sk").value=st.k;$("sd").textContent=st.d>0?"↑ Menor a mayor":"↓ Mayor a menor";
$("hd").innerHTML=cols.map(c=>`<th onclick="so('${c[0]}')">${c[1]}${st.k==c[0]?(st.d>0?" ▲":" ▼"):""}</th>`).join("");
let L=DATA.filter(a=>(!st.q||a.n.toLowerCase().includes(st.q))&&(!st.csm||a.csm==st.csm)&&(!st.s||a.s==st.s));
const key=st.k=="p"||st.k=="n"||st.k=="csm"||st.k=="s"?st.k:st.k;
L.sort((a,b)=>{const f=x=>st.k=="s"?x.h:(typeof x[st.k]=="string"?x[st.k].toLowerCase():x[st.k]);return(f(a)>f(b)?1:f(a)<f(b)?-1:0)*st.d});
$("tb").innerHTML=L.map(a=>`<tr class="r" onclick="op('${a.n}')"><td><b>${a.n}</b><br><span style="color:var(--mut);font-size:12px">${a.plan}</span></td><td><span class="pill p${a.s}">${a.est?"Baja":lab[a.s]}</span></td><td>${bar(a.h,a.s)}${a.h}</td><td><b style="color:${col[a.s]}">${a.p}%</b></td><td>${fmt(a.mrr)}</td><td>${a.ren}</td><td>${a.uso}%</td><td>${a.nps}</td><td>${a.tk}</td><td>${a.lc}</td><td>${a.tm}<span style="color:var(--mut)"> / ${a.tp}</span></td><td>${pt(a)}</td><td>${a.csm}</td><td><button onclick="event.stopPropagation();ed('${a.n}')">Editar</button></td></tr>`).join("")||`<tr><td colspan="14">Sin resultados</td></tr>`;
}
function so(k){if(k=="_")return;st.d=st.k==k?-st.d:(k=="n"||k=="csm"?1:-1);st.k=k;table()}
function filt(){$("fs").innerHTML=[["","Todos"],["R","Riesgo"],["Y","Atención"],["G","Saludable"]].map(x=>`<button class="${st.s==x[0]?"on":""}" onclick="st.s='${x[0]}';render()">${x[1]}</button>`).join(" ")}
function acts(a){
const r=[];
if(a.mora>30)r.push("Escalar cobranza con Finanzas y definir plan de pago antes de la renovación.");
if(a.uso<50)r.push("Agendar sesión de re-onboarding enfocada en los casos de uso de mayor valor.");
if(a.ado<50)r.push("Plan de adopción: activar 2–3 funcionalidades clave con campeón del cliente.");
if(a.tk>=5)r.push("Revisar tickets abiertos con Soporte y comprometer fechas de resolución.");
if(a.lc>30)r.push("Retomar contacto ejecutivo: reunión con sponsor en los próximos 7 días.");
if(!a.ch)r.push("Identificar y desarrollar un nuevo champion; mapear stakeholders.");
if(a.nps<=6)r.push("Cerrar el loop del NPS: llamada con el detractor y plan de acción.");
if(a.ren<=60)r.push("Iniciar playbook de renovación (QBR + propuesta de valor entregado).");
if(!r.length)r.push("Cuenta sana: explorar upsell/cross-sell y pedir referencia o caso de éxito.");
return r;
}
function op(n){
const a=DATA.find(x=>x.n==n);
const M=[["Uso de producto",a.m.uso,a.uso+"%"],["Adopción de features",a.m.ado,a.ado+"%"],["NPS",a.m.nps,a.nps+"/10"],["Tickets abiertos",a.m.tk,a.tk],["Último contacto",a.m.lc,a.lc+" días"],["Pagos",a.m.pg,a.mora?a.mora+" días de mora":"Al día"],["Champion activo",a.m.ch,a.ch?"Sí":"No"]];
$("dr").innerHTML=`<button onclick="cl2()" style="float:right">✕</button><h2 style="font-size:18px">${a.n}</h2><p style="color:var(--mut);margin:0 0 10px">${a.plan} · CSM ${a.csm} · ${fmt(a.mrr)}/mes · renueva en ${a.ren} días</p>
<div style="display:flex;gap:10px;margin-bottom:10px"><div class="card" style="flex:1"><span class="pill p${a.s}">${lab[a.s]}</span><b style="display:block;font-size:24px">${a.h}</b><span style="color:var(--mut);font-size:12px">Health Score</span></div><div class="card" style="flex:1"><b style="display:block;font-size:24px;margin-top:22px;color:${col[a.s]}">${a.p}%</b><span style="color:var(--mut);font-size:12px">Chance de baja</span></div></div>
<h2>Métricas</h2>${M.map(m=>{const s=sc(m[1]);return`<div class="m"><div><span>${m[0]}</span><b style="color:${col[s]}">${m[2]}</b></div><span class="mb"><i style="width:${m[1]}%;background:${col[s]}"></i></span></div>`}).join("")}
<h2 style="margin-top:14px">Acciones recomendadas</h2><ul>${acts(a).map(x=>`<li>${x}</li>`).join("")}</ul>
<p class="note">MRR esperado a perder: ${fmt(Math.round(a.mrr*a.p/100))}/mes</p><h2 style="margin-top:14px">Tareas realizadas</h2><p style="margin:4px 0">${a.tm} este mes vs ${a.tp} el mes anterior · ${pt(a)}</p><div class="tools" style="margin-top:14px"><button onclick="ed('${a.n}')">Editar</button><button class="dlt" onclick="cf(this,()=>rm('${a.n}'))">Eliminar</button></div>`;
$("dr").classList.add("o");
}
function cl2(){$("dr").classList.remove("o")}
$("q").oninput=e=>{st.q=e.target.value.toLowerCase();table()};
$("csm").onchange=e=>{st.csm=e.target.value;table()};

$("th").onclick=()=>{const r=document.documentElement,d=matchMedia("(prefers-color-scheme:dark)").matches;const cur=r.dataset.theme||(d?"dark":"light");r.dataset.theme=cur=="dark"?"light":"dark"};
const mn=d=>d.toLocaleString("es-AR",{month:"long"}),NOW=new Date(),MC=mn(NOW),MP=mn(new Date(NOW.getFullYear(),NOW.getMonth()-1,1));
const san=s=>String(s).replace(/['"\\<>&`]/g,"").trim(),LS="cs_accounts_v1";
const F=[["n","Cuenta","text"],["csm","CSM responsable","text"],["plan","Plan","sel"],["mrr","MRR ($/mes)","number"],["ren","Renueva en (días)","number"],["uso","Uso de producto (%)","number"],["ado","Adopción de features (%)","number"],["nps","NPS (0–10)","number"],["tk","Tickets abiertos","number"],["lc","Último contacto (días)","number"],["mora","Mora de pago (días)","number"],["ch","Champion activo","ch"],["tm","Tareas realizadas · mes actual","number"],["tp","Tareas realizadas · mes anterior","number"],["cs","CSAT (1 a 5)","number"],["ex","Expansión MRR ($)","number"],["ct","Contracción MRR ($)","number"],["ttv","Días hasta primer valor","number"],["est","Estado de la cuenta","est"]];
let EO=null,store=null;
function tt(){const a=DATA.reduce((x,c)=>x+c.tm,0),p=DATA.reduce((x,c)=>x+c.tp,0),c=p?Math.round((a-p)/p*100):(a?100:0);return{a,p,c,s:(c>0?"+":"")+c+"%"}}
function pt(a){const c=a.pc;return`<b style="color:${c>0?"var(--g)":c<0?"var(--r)":"var(--mut)"}">${c>0?"▲ +":c<0?"▼ ":""}${c}%</b>`}
function tasks(){const t=tt(),mx=Math.max(1,...DATA.map(a=>Math.max(a.tm,a.tp)));
$("tkb").innerHTML=`<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:baseline;margin-bottom:10px"><span><b style="font-size:24px">${t.a}</b> <span class="ds">${MC} (actual)</span></span><span><b style="font-size:24px">${t.p}</b> <span class="ds">${MP} (anterior)</span></span><span style="font-size:18px">${pt({pc:t.c})}</span></div>`+[...DATA].sort((a,b)=>b.tm-a.tm).map(a=>`<div style="display:grid;grid-template-columns:130px 1fr 110px;gap:8px;align-items:center;padding:3px 0"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.n}</span><span><span class="mb" style="width:100%;height:6px;margin:1px 0"><i style="width:${a.tp/mx*100}%;background:var(--mut)"></i></span><span class="mb" style="width:100%;height:6px;margin:1px 0"><i style="width:${a.tm/mx*100}%;background:var(--ac)"></i></span></span><span>${a.tm}/${a.tp} ${pt(a)}</span></div>`).join("")}
function dn(el,P,ct,sub){const T=P.reduce((x,p)=>x+p.v,0)||1;let a=-Math.PI/2,s="";const R=54,r=36,cx=60,cy=60;
P.forEach(p=>{if(!p.v)return;const w=p.v/T*2*Math.PI,b=a+w*0.9999,L=w>Math.PI?1:0;
s+=`<path d="M${cx+R*Math.cos(a)} ${cy+R*Math.sin(a)}A${R} ${R} 0 ${L} 1 ${cx+R*Math.cos(b)} ${cy+R*Math.sin(b)}L${cx+r*Math.cos(b)} ${cy+r*Math.sin(b)}A${r} ${r} 0 ${L} 0 ${cx+r*Math.cos(a)} ${cy+r*Math.sin(a)}Z" style="fill:${p.c};stroke:var(--card);stroke-width:1.5"/>`;a+=w});
$(el).innerHTML=`<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><svg viewBox="0 0 120 120" width="132" height="132">${s}<text x="60" y="62" text-anchor="middle" font-size="13" style="fill:var(--tx);font-family:'IBM Plex Mono',monospace">${ct}</text><text x="60" y="75" text-anchor="middle" font-size="7" style="fill:var(--mut)">${sub}</text></svg><div>${P.map(p=>`<div style="margin:4px 0"><i class="dot" style="background:${p.c}"></i>${p.l}: <b>${p.t}</b></div>`).join("")}</div></div>`}
function charts(){
if(!DATA.length){["c1","c2","c3","c4","c5","c6","c7","c8"].forEach(i=>$(i).innerHTML="");return}
const S=["G","Y","R"],T=DATA.reduce((x,a)=>x+a.mrr,0)||1,sm=(l,f)=>l.reduce((x,a)=>x+f(a),0),mono="font-family:'IBM Plex Mono',monospace";
dn("c1",S.map(s=>{const n=DATA.filter(a=>a.s==s).length;return{v:n,c:col[s],l:lab[s],t:n}}),DATA.length,"cuentas");
dn("c2",S.map(s=>{const v=sm(DATA.filter(a=>a.s==s),a=>a.mrr);return{v,c:col[s],l:lab[s],t:fmt(v)+" ("+Math.round(v/T*100)+"%)"}}),fmt(T),"MRR total");
const W=400,H=230,Lm=46,B=28,mx=Math.max(...DATA.map(a=>a.mrr))*1.1||1,X=h=>Lm+h/100*(W-Lm-8),Y=m=>H-B-m/mx*(H-B-10);
let g=`<rect x="${X(0)}" y="10" width="${X(45)-X(0)}" height="${H-B-10}" style="fill:var(--rs)"/><rect x="${X(45)}" y="10" width="${X(70)-X(45)}" height="${H-B-10}" style="fill:var(--ys)"/><rect x="${X(70)}" y="10" width="${X(100)-X(70)}" height="${H-B-10}" style="fill:var(--gs)"/>`;
[0,.5,1].forEach(f=>g+=`<text x="${Lm-5}" y="${Y(mx*f)+3}" text-anchor="end" font-size="9" style="fill:var(--mut)">${Math.round(mx*f/1000)}k</text>`);
[0,25,50,75,100].forEach(h=>g+=`<text x="${X(h)}" y="${H-B+13}" text-anchor="middle" font-size="9" style="fill:var(--mut)">${h}</text>`);
g+=`<text x="${(Lm+W)/2}" y="${H-3}" text-anchor="middle" font-size="9" style="fill:var(--mut)">Health Score</text><text x="8" y="14" font-size="9" style="fill:var(--mut)">MRR ($)</text>`;
DATA.forEach(a=>g+=`<circle cx="${X(a.h)}" cy="${Y(a.mrr)}" r="7" style="fill:${col[a.s]};stroke:var(--card);stroke-width:1.5;cursor:pointer" onclick="op('${a.n}')"><title>${a.n} | Health ${a.h} | ${fmt(a.mrr)}</title></circle>`);
$("c3").innerHTML=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">${g}</svg>`;
const cs=[...new Set(DATA.map(a=>a.plan))],mxc=Math.max(...cs.map(c=>sm(DATA.filter(a=>a.plan==c),a=>a.mrr)))||1;
$("c4").innerHTML=cs.map(c=>{const L=DATA.filter(a=>a.plan==c),t=sm(L,a=>a.mrr);return`<div style="display:grid;grid-template-columns:76px 1fr 84px;gap:8px;align-items:center;margin:8px 0"><span>${c}</span><span style="display:flex;height:16px;width:${t/mxc*100}%">${S.map(s=>{const v=sm(L.filter(a=>a.s==s),a=>a.mrr);return v?`<i style="flex:${v};background:${col[s]}"></i>`:""}).join("")}</span><span style="${mono};font-size:12px;text-align:right">${fmt(t)}</span></div>`}).join("");
const bk=[["0-30",0,30],["31-60",31,60],["61-90",61,90],["91-180",91,180],[">180",181,1e9]],vl=bk.map(b=>DATA.filter(a=>a.ren>=b[1]&&a.ren<=b[2])),mb=Math.max(1,...vl.map(l=>sm(l,a=>a.mrr)));
$("c5").innerHTML=`<div style="display:flex;gap:10px;height:160px">${bk.map((b,i)=>{const l=vl[i],t=sm(l,a=>a.mrr);return`<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;font-size:10px;text-align:center"><span style="${mono}">${t?fmt(t):""}</span><div style="display:flex;flex-direction:column;height:${t/mb*78}%;margin-top:3px">${S.map(s=>{const v=sm(l.filter(a=>a.s==s),a=>a.mrr);return v?`<i style="flex:${v};background:${col[s]}"></i>`:""}).join("")}</div></div>`}).join("")}</div><div style="display:flex;gap:10px;font-size:11px;color:var(--mut);text-align:center;border-top:1px solid var(--bd);margin-top:2px;padding-top:4px">${bk.map(b=>`<span style="flex:1">${b[0]} d</span>`).join("")}</div>`;
const dm=[["Uso de producto","uso"],["Adopción","ado"],["NPS","nps"],["Tickets abiertos","tk"],["Último contacto","lc"],["Pagos","pg"],["Champion","ch"]];
$("c6").innerHTML=dm.map(d=>{const v=Math.round(sm(DATA,a=>a.m[d[1]])/DATA.length),s=sc(v);return`<div class="m"><div><span>${d[0]}</span><b style="color:${col[s]}">${v}</b></div><span class="mb"><i style="width:${v}%;background:${col[s]}"></i></span></div>`}).join("")}
const gf=a=>(!st.plan||a.plan==st.plan)&&(!st.rw||a.ren<=+st.rw)&&(!st.s||a.s==st.s);
function inds(B){const act=B.filter(a=>!a.est),lost=B.filter(a=>a.est),n=act.length,sm=(l,f)=>l.reduce((x,a)=>x+f(a),0),av=(l,f)=>l.length?sm(l,f)/l.length:0;
const mrrA=sm(act,a=>a.mrr),exp=sm(act,a=>a.ex),con=sm(act,a=>a.ct),lostM=sm(lost,a=>a.mrr),start=mrrA-exp+con+lostM;
const pro=act.filter(a=>a.nps>=9).length,det=act.filter(a=>a.nps<=6).length;
return{n,pro,det,pas:n-pro-det,nps:n?(pro-det)/n*100:0,csat:av(act,a=>a.cs),grr:start?(start-con-lostM)/start*100:0,nrr:start?mrrA/start*100:0,churnL:B.length?lost.length/B.length*100:0,ret:B.length?100-lost.length/B.length*100:0,churnM:start?lostM/start*100:0,exp,con,lostM,start,mrrA,ttv:av(act.filter(a=>a.ttv>0),a=>a.ttv),ado:av(act,a=>a.ado),h:av(act,a=>a.h),champ:n?act.filter(a=>a.ch).length/n*100:0,tk:av(act,a=>a.tk),tm:sm(act,a=>a.tm),tp:sm(act,a=>a.tp)}}
function th(v,g,y,lo){return lo?(v<=g?"G":v<=y?"Y":"R"):(v>=g?"G":v>=y?"Y":"R")}
function ind(B){const I=inds(B),P=x=>I.n?Math.round(x/I.n*100):0;
const C=[["NPS",I.nps,"i",th(I.nps,50,30),"Promotores (9–10) menos detractores (0–6). Mide lealtad. Referencia: 50 o más."],
["CSAT",I.csat,"d",th(I.csat,4.2,3.8),"Satisfacción media de 1 a 5. Referencia: 4,2 o más."],
["GRR",I.grr,"p",th(I.grr,90,80),"Retención bruta de ingresos, sin contar expansión. Referencia: 90% o más."],
["NRR",I.nrr,"p",th(I.nrr,100,90),"Retención neta, con expansión. Sobre 100% la cartera crece sola."],
["Churn de logos",I.churnL,"p",th(I.churnL,5,10,1),"Cuentas dadas de baja sobre el total. Referencia: hasta 5%."],
["Retención de logos",I.ret,"p",th(I.ret,95,90),"Cuentas que siguen activas. Referencia: 95% o más."],
["MRR perdido por bajas",I.churnM,"p",th(I.churnM,3,6,1),"% del MRR inicial perdido por cuentas que se fueron."],
["Expansión MRR",I.exp,"m",I.exp>0?"G":"Y","Ingreso extra por upsell y cross-sell en el período."],
["Contracción MRR",I.con,"m",I.con>0?"Y":"G","Ingreso perdido por downgrades en cuentas que siguen."],
["Tiempo al primer valor",I.ttv,"n",th(I.ttv,30,60,1),"Días de onboarding hasta el primer resultado. Referencia: hasta 30."],
["Adopción media",I.ado,"p",th(I.ado,70,50),"% de funcionalidades clave en uso."],
["Health medio",I.h,"i",th(I.h,70,45),"Promedio del Health Score de las cuentas activas."],
["Con champion activo",I.champ,"p",th(I.champ,80,60),"Cuentas con un sponsor interno que las impulsa."],
["Tickets por cuenta",I.tk,"d",th(I.tk,2,4,1),"Tickets abiertos promedio. Menos es mejor."],
["Tareas del mes",I.tm,"i",I.tm>=I.tp?"G":"Y",I.tm+" este mes vs "+I.tp+" el mes anterior."]];
$("ind").innerHTML=C.map(c=>`<div class="ic s${c[3]}"><span>${c[0]}</span><b data-n="${c[1]}" data-f="${c[2]}">0</b><small>${c[4]}</small></div>`).join("");
dn("c7",[{v:I.pro,c:col.G,l:"Promotores",t:I.pro+" ("+P(I.pro)+"%)"},{v:I.pas,c:col.Y,l:"Pasivos",t:I.pas+" ("+P(I.pas)+"%)"},{v:I.det,c:col.R,l:"Detractores",t:I.det+" ("+P(I.det)+"%)"}],Math.round(I.nps),"NPS");
wf("c8",I)}
function wf(el,I){const S2=[["Inicio",I.start,1,"var(--ac)"],["Expansión",I.exp,0,"var(--g)"],["Contracción",-I.con,0,"var(--y)"],["Bajas",-I.lostM,0,"var(--r)"],["Final",I.mrrA,1,"var(--ac)"]];
const W=400,H=210,B=34,T=18,mx=Math.max(1,I.start,I.start+I.exp,I.mrrA)*1.05,Y=v=>H-B-v/mx*(H-B-T),bw=48,gap=(W-5*bw)/6;let cur=0,g="";
S2.forEach((s,i)=>{let a,b;if(s[2]){a=0;b=s[1];cur=s[1]}else{a=cur;b=cur+s[1];cur=b}const x=gap+i*(bw+gap),y=Y(Math.max(a,b)),h=Math.max(2,Math.abs(Y(a)-Y(b)));
g+=`<rect class="wf" x="${x}" y="${y}" width="${bw}" height="${h}" style="fill:${s[3]};animation-delay:${i*.12}s"/><text x="${x+bw/2}" y="${y-5}" text-anchor="middle" font-size="9" style="fill:var(--tx);font-family:'IBM Plex Mono',monospace">${(s[1]<0?"−":s[2]?"":"+")+fmt(Math.abs(Math.round(s[1])))}</text><text x="${x+bw/2}" y="${H-B+14}" text-anchor="middle" font-size="9" style="fill:var(--mut)">${s[0]}</text>`});
$(el).innerHTML=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto"><line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--bd)"/>${g}</svg>`}
function cu(){const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;document.querySelectorAll("[data-n]").forEach(e=>{const t=+e.dataset.n||0,f=e.dataset.f,F=v=>f=="p"?Math.round(v)+"%":f=="d"?v.toFixed(1):f=="m"?fmt(Math.round(v)):f=="n"?Math.round(v)+" d":Math.round(v);if(rm){e.textContent=F(t);return}const s0=performance.now();(function k(now){const p=Math.min(1,(now-s0)/800),q=1-Math.pow(1-p,3);e.textContent=F(t*q);if(p<1)requestAnimationFrame(k)})(s0)})}
function csmOpts(){const v=st.csm;$("csm").innerHTML='<option value="">Todos los CSM</option>'+[...new Set(DATA.map(a=>a.csm))].map(c=>`<option${c==v?" selected":""}>${c}</option>`).join("")}
function render(){const full=DATA,base=full.filter(gf),A=base.filter(a=>!a.est);
$("fc").textContent="Mostrando "+base.length+" de "+full.length+" cuentas";
try{DATA=A;
if(A.length){kpis()}else{$("kpis").innerHTML='<div class="card" style="grid-column:1/-1">No hay cuentas activas con estos filtros. Probá limpiar los filtros o usá «+ Agregar cuenta».</div>';["c1","c2","c3","c4","c5","c6","top","ren"].forEach(i=>$(i).innerHTML="")}
tasks();charts();ind(base);DATA=base;csmOpts();filt();table()}finally{DATA=full}
cu()}
function save(){const j=JSON.stringify({a:DATA.map(a=>({n:a.n,csm:a.csm,plan:a.plan,mrr:a.mrr,ren:a.ren,uso:a.uso,ado:a.ado,nps:a.nps,tk:a.tk,lc:a.lc,mora:a.mora,ch:a.ch,tm:a.tm,tp:a.tp,cs:a.cs,ex:a.ex,ct:a.ct,est:a.est,ttv:a.ttv}))});try{localStorage.setItem(LS,j)}catch(e){}if(store)store.set({j}).catch(()=>{})}
function load(j){try{const o=JSON.parse(j);if(o&&Array.isArray(o.a)){DATA=o.a.map(calc);return true}}catch(e){}return false}
function cf(b,fn){if(b.dataset.c)return fn();b.dataset.t=b.textContent;b.dataset.c=1;b.textContent="¿Seguro? Confirmar";setTimeout(()=>{delete b.dataset.c;b.textContent=b.dataset.t},4000)}
function clr(){DATA=[];save();render()}
function fo(a){EO=a?a.n:null;const v=a||{n:"",csm:"",plan:"Mid-Market",mrr:0,ren:90,uso:50,ado:50,nps:7,tk:0,lc:7,mora:0,ch:1,tm:0,tp:0,cs:4,ex:0,ct:0,ttv:30,est:0};
$("ft").textContent=a?"Editar cuenta":"Agregar cuenta";$("fe").textContent="";
$("ff").innerHTML=F.map(f=>{const x=v[f[0]];const i=f[2]=="sel"?`<select id="f_plan">${["Enterprise","Mid-Market","SMB"].map(p=>`<option${p==x?" selected":""}>${p}</option>`).join("")}</select>`:f[2]=="est"?`<select id="f_est"><option value="0"${x?"":" selected"}>Activa</option><option value="1"${x?" selected":""}>Baja (churn)</option></select>`:f[2]=="ch"?`<select id="f_ch"><option value="1"${x?" selected":""}>Sí</option><option value="0"${x?"":" selected"}>No</option></select>`:`<input id="f_${f[0]}" type="${f[2]}" value="${x}"${f[2]=="number"?' min="0" step="any"':""}>`;return`<label>${f[1]}${i}</label>`}).join("");
$("m1").textContent=MC;$("m2").textContent=MP;cl2();$("fd").showModal()}
function ed(n){fo(DATA.find(x=>x.n==n))}
const HD=["Cuenta","CSM","Plan","MRR","Renueva en (dias)","Uso %","Adopcion %","NPS","Tickets","Ultimo contacto (dias)","Mora (dias)","Champion","Tareas mes actual","Tareas mes anterior","CSAT (1-5)","Expansion MRR","Contraccion MRR","Estado","Dias hasta primer valor"];
function io(){$("ie").textContent="";$("imt").value="";$("id").showModal()}
$("imf").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("imt").value=r.result;$("ie").textContent="Archivo cargado: "+f.name+". Revisá y tocá Importar."};r.readAsText(f)};
function toCsv(rows){return rows.map(r=>r.map(c=>{c=String(c);return /[;"\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(";")).join("\n")}
async function ex(w){const rows=[HD].concat(w?DATA.map(a=>[a.n,a.csm,a.plan,a.mrr,a.ren,a.uso,a.ado,a.nps,a.tk,a.lc,a.mora,a.ch?"Si":"No",a.tm,a.tp,a.cs,a.ex,a.ct,a.est?"Baja":"Activa",a.ttv]):[["Acme Logistica","Ana","Enterprise",18500,35,82,76,8,2,6,0,"Si",22,18,4.4,500,0,"Activa",21]]);const csv="\ufeff"+toCsv(rows);
try{if(typeof claude==="undefined"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=w?"cuentas-cs.csv":"plantilla-cuentas-cs.csv";a.click();return}const d=await claude.use("downloads");if(!d)throw 0;await d.save({filename:w?"cuentas-cs.csv":"plantilla-cuentas-cs.csv",data:csv})}catch(e){$("imt").value=csv.slice(1);$("ie").textContent="No se pudo descargar el archivo. Copiá este texto y pegalo en Excel o Google Sheets.";if(!$("id").open)$("id").showModal()}}
function imp(){const t=$("imt").value.replace(/\r/g,"").split("\n").filter(l=>l.trim());if(!t.length){$("ie").textContent="No hay filas para importar.";return}
const nm=s=>{const x=parseFloat(String(s||"").replace(/[$\s%]/g,"").replace(",","."));return isNaN(x)||x<0?0:x};
const sp=l=>{const d=l.includes("\t")?"\t":l.includes(";")?";":",";return l.split(d).map(c=>c.trim().replace(/^"|"$/g,""))};
let add=0,upd=0,skip=0;
t.forEach((l,k)=>{const c=sp(l);if(k==0&&isNaN(parseFloat(String(c[3]||"").replace(",",".")))&&c.length>3)return;const n=san(c[0]||"");if(!n){skip++;return}
const pl=(c[2]||"").toLowerCase();const o={n,csm:san(c[1]||"")||"Erika",plan:pl.startsWith("ent")?"Enterprise":pl.startsWith("smb")||pl.startsWith("peq")?"SMB":"Mid-Market",mrr:nm(c[3]),ren:Math.round(nm(c[4])),uso:Math.min(100,nm(c[5])),ado:Math.min(100,nm(c[6])),nps:Math.min(10,nm(c[7])),tk:Math.round(nm(c[8])),lc:Math.round(nm(c[9])),mora:Math.round(nm(c[10])),ch:/^(s|y|1|t|v)/i.test((c[11]||"").trim())?1:0,tm:Math.round(nm(c[12])),tp:Math.round(nm(c[13])),cs:Math.min(5,nm(c[14])),ex:nm(c[15]),ct:nm(c[16]),est:/^(b|1)/i.test((c[17]||"").trim())?1:0,ttv:Math.round(nm(c[18]))};
calc(o);const i=DATA.findIndex(x=>x.n.toLowerCase()==n.toLowerCase());if(i>=0){DATA[i]=o;upd++}else{DATA.push(o);add++}});
save();render();$("ie").textContent=add+" cuentas nuevas, "+upd+" actualizadas"+(skip?", "+skip+" filas omitidas (sin nombre)":"")+"."}
function rm(n){DATA=DATA.filter(x=>x.n!=n);save();render();cl2()}
function sv(){const g=k=>$("f_"+k).value,num=(k,hi)=>{let x=parseFloat(g(k));x=isNaN(x)||x<0?0:x;return hi?Math.min(x,hi):x};
const n=san(g("n"));if(!n){$("fe").textContent="Poné el nombre de la cuenta.";return}
const o={n,csm:"Erika",plan:g("plan"),mrr:num("mrr"),ren:Math.round(num("ren")),uso:num("uso",100),ado:num("ado",100),nps:num("nps",10),tk:Math.round(num("tk")),lc:Math.round(num("lc")),mora:Math.round(num("mora")),ch:+g("ch"),est:+g("est"),cs:num("cs",5),ex:num("ex"),ct:num("ct"),ttv:Math.round(num("ttv")),tm:Math.round(num("tm")),tp:Math.round(num("tp"))};
const i=EO?DATA.findIndex(x=>x.n==EO):-1;let c=2;while(DATA.some((x,j)=>x.n==o.n&&j!=i)){o.n=n+" ("+(c++)+")"}
calc(o);if(i>=0)DATA[i]=o;else DATA.push(o);save();render();$("fd").close()}
$("sk").innerHTML=cols.filter(c=>c[0]!="_").map(c=>`<option value="${c[0]}">${c[1]}</option>`).join("");
$("sk").onchange=e=>{st.k=e.target.value;table()};
$("sd").onclick=()=>{st.d=-st.d;table()};
$("fp").onchange=e=>{st.plan=e.target.value;render()};
$("fr").onchange=e=>{st.rw=e.target.value;render()};
$("fx").onclick=()=>{st.plan="";st.rw="";st.s="";st.q="";st.csm="";$("fp").value="";$("fr").value="";$("q").value="";render()};
$("dt").textContent=MC.charAt(0).toUpperCase()+MC.slice(1)+" "+NOW.getFullYear()+" · salud, riesgo de baja y renovaciones";
let ls=null;try{ls=localStorage.getItem(LS)}catch(e){}
if(!(ls&&load(ls)))DATA=SEED.map(calc);
render();
(async()=>{try{if(typeof claude==="undefined")return;const[u,db]=await Promise.all([claude.use("user"),claude.use("db")]);if(!u||!db)return;const id=await u.id();if(!id)return;store=db.collection("data/users/"+id).doc("cs");const s=await store.get();const j=s.exists&&s.data().j;if(j&&load(j)){try{localStorage.setItem(LS,j)}catch(e){}render()}else save()}catch(e){}})();
