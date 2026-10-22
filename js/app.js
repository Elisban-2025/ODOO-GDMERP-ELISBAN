(() => {
"use strict";

const $ = (s, root=document) => root.querySelector(s); const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = "bsc_gdmerp_neon_v1"; // Forzará la recarga de los datos

// COLORES NEÓN PARA LAS PERSPECTIVAS
const perspectives = {
  financiera:{label:"Financiera",color:"#ffd700",soft:"rgba(255, 215, 0, 0.1)"},
  clientes:{label:"Clientes",color:"#00f0ff",soft:"rgba(0, 240, 255, 0.1)"},
  procesos:{label:"Procesos internos",color:"#bc13fe",soft:"rgba(188, 19, 254, 0.1)"},
  aprendizaje:{label:"Aprendizaje y crecimiento",color:"#00ff9d",soft:"rgba(0, 255, 157, 0.1)"}
};

const users = [
  {id:"u1",name:"Elisban Huaylla",email:"admin@gdmerp.com",role:"Administrador",area:"Gerencia General",password:"BSC2026!"},
  {id:"u2",name:"Carlos Ruiz",email:"comercial@gdmerp.com",role:"Gerente",area:"Ventas CRM",password:"BSC2026!"},
  {id:"u3",name:"María Torres",email:"compras@gdmerp.com",role:"Responsable de indicadores",area:"Logística",password:"BSC2026!"},
  {id:"u4",name:"Luis Quispe",email:"calidad@gdmerp.com",role:"Responsable de indicadores",area:"Operaciones",password:"BSC2026!"},
  {id:"u5",name:"Rosa Medina",email:"rrhh@gdmerp.com",role:"Gerente",area:"Gestión de Personas",password:"BSC2026!"}
];

const demoState = () => {
  const objectives = [
    ["OBJ-01","Optimizar costos de materia prima","financiera","Reducir gasto en compras agrícolas.","María Torres","Alta",100],
    ["OBJ-02","Maximizar ingresos B2B","financiera","Incrementar facturación vía CRM.","Carlos Ruiz","Alta",100],
    ["OBJ-03","Asegurar calidad de proveedores","clientes","Garantizar insumos sin defectos.","Luis Quispe","Alta",100],
    ["OBJ-04","Fidelizar compradores mayoristas","clientes","Mantener activa la cartera B2B.","Carlos Ruiz","Media",80],
    ["OBJ-05","Agilizar ciclo de abastecimiento","procesos","Reducir días de proceso de compra.","María Torres","Alta",90],
    ["OBJ-06","Mejorar conversión de prospectos","procesos","Optimizar embudo de ventas CRM.","Carlos Ruiz","Media",80],
    ["OBJ-07","Garantizar adopción de GDMERP","aprendizaje","Asegurar uso diario del sistema.","Elisban Huaylla","Alta",100],
    ["OBJ-08","Capacitar fuerza de ventas y compras","aprendizaje","Completar entrenamiento ERP.","Rosa Medina","Media",80]
  ].map(a=>({id:a[0],name:a[1],perspective:a[2],description:a[3],owner:a[4],priority:a[5],weight:a[6],status:"Activo",created:"2026-01-05"}));

  const kpisRaw = [
    ["KPI-01","Ahorro total en compras","financiera","OBJ-01","Soles","Ppto asignado - Costo negociado",0,50000,42000,"mayor","Mensual","María Torres","Logística",5],
    ["KPI-02","Ingresos por nuevos contratos","financiera","OBJ-02","Soles","Suma de facturas CRM",100000,500000,450000,"mayor","Mensual","Carlos Ruiz","Ventas CRM",5],
    ["KPI-03","Tasa de lotes rechazados","clientes","OBJ-03","%","Lotes devueltos / Recibidos * 100",15,5,8,"menor","Mensual","Luis Quispe","Operaciones",5],
    ["KPI-04","Retención de cartera B2B","clientes","OBJ-04","%","Clientes recurrentes / Totales * 100",70,90,85,"mayor","Trimestral","Carlos Ruiz","Ventas CRM",5],
    ["KPI-05","Días de ciclo de compra","procesos","OBJ-05","Días","Ingreso almacén - Fecha OC",15,5,7,"menor","Mensual","María Torres","Logística",5],
    ["KPI-06","Conversión de Leads","procesos","OBJ-06","%","Leads ganados / Leads totales * 100",10,30,25,"mayor","Mensual","Carlos Ruiz","Ventas CRM",5],
    ["KPI-07","Usuarios activos en GDMERP","aprendizaje","OBJ-07","%","Usuarios activos / Registrados * 100",40,95,88,"mayor","Semanal","Elisban Huaylla","Sistemas",5],
    ["KPI-08","Horas de capacitación ERP","aprendizaje","OBJ-08","Horas","Horas de entrenamiento",10,40,35,"mayor","Trimestral","Rosa Medina","Gestión de Personas",5]
  ];

  const kpis = kpisRaw.map(a=>({id:a[0],name:a[1],perspective:a[2],objectiveId:a[3],unit:a[4],formula:a[5],baseline:a[6],target:a[7],current:a[8],direction:a[9],frequency:a[10],owner:a[11],area:a[12],weight:a[13],description:"Indicador de control GDMERP",lower:null,upper:null,alertAt:80,criticalAt:60,measurements:[]}));
  
  const months = ["2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
  kpis.forEach((k)=>{
    if(k.current===null)return;
    months.forEach((month,m)=>{
     let progress=(m+1)/6;
     let v;
     if(k.direction==="menor") v=Math.round(k.baseline-(k.baseline-k.current)*progress + (m%2?1:-1));
     else v=Math.round(k.baseline+(k.current-k.baseline)*progress + (m%2?2:-2));
     if(m===5)v=k.current;
     k.measurements.push({id:`M-${k.id}-${month}`,period:month,date:`${month}-${["28","27","29","28","29","30"][m]}`,value:v,notes:m===5?"Cierre GDMERP":"Medición histórica",responsible:k.owner});
    });
  });

  const initiatives = [
    {id:"INI-01",name:"Portal de proveedores B2B",objectiveId:"OBJ-05",kpiId:"KPI-05",owner:"María Torres",area:"Logística",start:"2026-01-01",end:"2026-06-30",budget:42000,progress:80,status:"En ejecución",description:"Automatizar cotizaciones agroindustriales."},
    {id:"INI-02",name:"Automatización WhatsApp API",objectiveId:"OBJ-06",kpiId:"KPI-06",owner:"Carlos Ruiz",area:"Ventas CRM",start:"2026-02-01",end:"2026-08-31",budget:15000,progress:65,status:"En ejecución",description:"Integrar WhatsApp con leads de GDMERP."}
  ];
  return {objectives,kpis,initiatives,users:users.map(({password,...u})=>u),period:"2026",measurementsVersion:1,audit:[{id:"AUD-001",date:new Date().toISOString(),user:"Elisban Huaylla",action:"Inicialización",entity:"Datos ERP",detail:"Base Agro Peruvian Foods cargada."}]};
};

let state;
let currentUser=null;
let currentPage="dashboard";
let charts={};
let modalSubmit=null;

function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed&&parsed.objectives)return parsed;}}catch(e){}return demoState()}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){toast("Error al guardar","error")}}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fmt(n,d=0){return n===null||n===undefined||n===""?"—":Number(n).toLocaleString("es-PE",{maximumFractionDigits:d})}
function currency(n){return "S/ "+Number(n||0).toLocaleString("es-PE",{maximumFractionDigits:0})}
function today(){return new Date().toISOString().slice(0,10)}
function monthNow(){return today().slice(0,7)}

function statusOf(k,value=k.current){
 if(value===null||value===undefined||value==="")return {key:"neutral",label:"Sin datos",pct:null};
 const pct=achievement(k,Number(value));
 if(pct>=100)return {key:"good",label:"Cumplido",pct};
 if(pct>=Number(k.alertAt??80))return {key:"warn",label:"En alerta",pct};
 return {key:"bad",label:"Crítico",pct};
}

function achievement(k,value=k.current){
 if(value===null||value===undefined||value===""||k.target===null)return null;
 value=Number(value);const target=Number(k.target);
 if(k.direction==="menor"){
  if(value<=target)return 100;
  if(target<=0||value<=0)return 0;
  return Math.max(0,Math.min(100,target/value*100));
 }
 if(target===0)return value>=0?100:0;
 return Math.max(0,Math.min(150,value/target*100));
}

function weightedCompliance(items,weightField="weight"){
 const valid=items.filter(x=>x.pct!==null&&x.pct!==undefined);
 if(!valid.length)return null;
 const sum=valid.reduce((a,x)=>a+Math.max(0,Number(x[weightField]??1)),0);
 if(sum<=0)return null;
 return valid.reduce((a,x)=>a+x.pct*Math.max(0,Number(x[weightField]??1)),0)/sum;
}

function globalCompliance(){
 const objScores=state.objectives.map(o=>{
  const linked=state.kpis.filter(k=>k.objectiveId===o.id).map(k=>({pct:achievement(k),weight:k.weight}));
  return {pct:weightedCompliance(linked),weight:Number(o.weight||1),perspective:o.perspective};
 });
 return weightedCompliance(Object.keys(perspectives).map(p=>({pct:weightedCompliance(objScores.filter(o=>o.perspective===p)),weight:25})));
}

function recordAudit(action,entity,detail){state.audit.unshift({id:"AUD-"+Date.now(),date:new Date().toISOString(),user:currentUser?.name||"Sistema",action,entity,detail});state.audit=state.audit.slice(0,250)}
function toast(message,type="success"){const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=message;$("#toastRegion").append(el);setTimeout(()=>el.remove(),3500)}
function statusBadge(k,value=k.current){const s=statusOf(k,value);return `<span class="status ${s.key}">${s.label}</span>`}
function perspectiveLabel(p){return perspectives[p]?.label||p||"—"}
function objectiveName(id){return state.objectives.find(o=>o.id===id)?.name||"Sin asignar"}
function canEdit(){return currentUser&&["Administrador","Gerente"].includes(currentUser.role)}
function canAdmin(){return currentUser?.role==="Administrador"}

function setUser(u){currentUser=u;sessionStorage.setItem("bsc_user",JSON.stringify({id:u.id,email:u.email,role:u.role,name:u.name,area:u.area}));}
function getInitials(name){return name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();}

function showApp(){ 
 $("#loginView").classList.add("hidden");
 $("#appView").classList.remove("hidden");
 $("#sideUserName").textContent=currentUser.name;
 $("#topUserName").textContent=currentUser.name;
 $("#sideUserRole").textContent=currentUser.role; $$(".avatar").forEach(a=>a.textContent=getInitials(currentUser.name));
 navigate(currentPage);
}

function showLogin(){ $("#appView").classList.add("hidden");$("#loginView").classList.remove("hidden");}
function login(email,password){const u=users.find(x=>x.email.toLowerCase()===email.toLowerCase()&&x.password===password);if(!u)return false;setUser({...u});showApp();return true}
function logout(){sessionStorage.removeItem("bsc_user");currentUser=null;showLogin();toast("Sesión cerrada");}

function navigate(page){
 if(!page)return;
 currentPage=page;
 $("#sidebar").classList.remove("open"); $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 destroyCharts();
 const fn=renderers[page]||renderDashboard;
 $("#pageContent").innerHTML=fn();
 bindPageEvents(page);
 if(page==="dashboard")drawDashboardCharts();
 window.scrollTo({top:0,behavior:"smooth"});
}

function destroyCharts(){Object.values(charts).forEach(c=>{try{c.destroy()}catch(e){}});charts={}}

function perspectiveBreakdown(){return Object.entries(perspectives).map(([key,p])=>{const ks=state.kpis.filter(k=>k.perspective===key);return {key,...p,pct:weightedCompliance(ks.map(k=>({pct:achievement(k),weight:k.weight}))),has:ks.some(k=>achievement(k)!==null)}})}

// VISTAS
function renderDashboard(){
 const global=globalCompliance();const critical=state.kpis.filter(k=>["bad","warn"].includes(statusOf(k).key));
 return `
 <div class="page-head"><div><h1>Dashboard GDMERP</h1><p>Monitoreo CRM y Compras</p></div><button class="btn primary" data-action="new-measurement">＋ Registrar resultado</button></div>
 <div class="grid metric-grid">
  <article class="metric-card"><div class="metric-top">Cumplimiento Global</div><div class="metric-value">${global===null?"—":Math.round(global)}%</div></article>
  <article class="metric-card"><div class="metric-top">Objetivos Activos</div><div class="metric-value">${state.objectives.length}</div></article>
  <article class="metric-card"><div class="metric-top">KPIs Calculados</div><div class="metric-value">${state.kpis.length}</div></article>
  <article class="metric-card"><div class="metric-top">Requieren Atención</div><div class="metric-value error-text" style="font-size:32px">${critical.length}</div></article>
 </div>
 <div class="grid dashboard-grid">
  <section class="panel"><h2>Desempeño por Perspectiva</h2>
   <div class="perspective-bars">${perspectiveBreakdown().map(p=>`<div class="perspective-row"><div class="perspective-name"><span class="persp-dot" style="background:${p.color}"></span>${p.label}</div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,p.pct||0)}%;background:${p.color};box-shadow:0 0 10px${p.color}"></div></div><div class="perspective-value">${p.has?Math.round(p.pct)+"%":"—"}</div></div>`).join("")}</div>
   <div class="chart-wrap short" style="margin-top:20px"><canvas id="perspectiveChart"></canvas></div>
  </section>
  <section class="panel"><h2>Tendencia Semestral</h2><div class="chart-wrap"><canvas id="trendChart"></canvas></div></section>
 </div>
 <section class="panel"><h2>KPIs en Riesgo</h2>${renderKpiTable(critical,false)}</section>`;
}

function renderKpiTable(list,withActions=true){if(!list.length)return `<p class="muted">Todo en orden.</p>`;return `<div class="table-scroll"><table><thead><tr><th>Indicador</th><th>Perspectiva</th><th>Real</th><th>Meta</th><th>Avance</th><th>Responsable</th><th>Estado</th>${withActions?"<th>Acciones</th>":""}</tr></thead><tbody>${list.map(k=>`<tr><td><span class="code">${k.id}</span> ${escapeHtml(k.name)}</td><td>${perspectiveLabel(k.perspective)}</td><td><strong>${fmt(k.current)}</strong></td><td>${fmt(k.target)}</td><td>${achievement(k)===null?"—":Math.round(achievement(k))+"\%"}</td><td>${escapeHtml(k.owner)}</td><td>${statusBadge(k)}</td>${withActions?`<td><button class="text-action" data-action="measure-kpi" data-id="${k.id}">Medir</button></td>`:""}</tr>`).join("")}</tbody></table></div>`}

function renderMap(){
 const lanes=Object.entries(perspectives).map(([key,p])=>{const objs=state.objectives.filter(o=>o.perspective===key);return `<div class="map-lane"><div class="map-lane-label" style="color:${p.color};border-color:${p.color}">${p.label}</div><div class="map-lane-items">${objs.map(o=>{const avg=weightedCompliance(state.kpis.filter(k=>k.objectiveId===o.id).map(k=>({pct:achievement(k),weight:k.weight})));const col=avg===null?"#64748b":avg>=100?"#00ff9d":avg>=80?"#ffd700":"#ff0055";return `<div class="map-objective" style="border-left: 3px solid ${col}">${escapeHtml(o.name)}<small>${avg===null?"S/D":Math.round(avg)+"% Cumplimiento"}</small></div>`}).join("")}</div></div>`}).join("");
 return `<div class="page-head"><div><h1>Mapa Estratégico</h1><p>Relaciones causa-efecto GDMERP</p></div></div><section class="panel"><div class="strategy-map">${lanes}</div></section>`;
}

function renderObjectives(){return `<div class="page-head"><div><h1>Objetivos</h1><p>Fines principales</p></div></div><section class="panel"><div class="table-scroll"><table><thead><tr><th>ID</th><th>Objetivo</th><th>Responsable</th></tr></thead><tbody>${state.objectives.map(o=>`<tr><td><span class="code">${o.id}</span></td><td>${escapeHtml(o.name)}</td><td>${escapeHtml(o.owner)}</td></tr>`).join("")}</tbody></table></div></section>`;}
function renderKpis(){return `<div class="page-head"><div><h1>Indicadores</h1><p>Métricas ERP</p></div></div><section class="panel">${renderKpiTable(state.kpis,true)}</section>`;}
function renderMeasurements(){const all=state.kpis.flatMap(k=>k.measurements.map(m=>({...m,kpi:k}))).sort((a,b)=>b.date.localeCompare(a.date));return `<div class="page-head"><div><h1>Resultados</h1><p>Ingreso manual</p></div><button class="btn primary" data-action="new-measurement">＋ Medición</button></div><section class="panel"><div class="table-scroll"><table><thead><tr><th>Fecha</th><th>Indicador</th><th>Valor</th><th>Responsable</th></tr></thead><tbody>${all.map(x=>`<tr><td>${x.date}</td><td><span class="code">${x.kpi.id}</span>${escapeHtml(x.kpi.name)}</td><td><strong>${fmt(x.value)}</strong></td><td>${escapeHtml(x.responsible)}</td></tr>`).join("")}</tbody></table></div></section>`;}
function renderInitiatives(){return `<div class="page-head"><div><h1>Iniciativas</h1><p>Proyectos de mejora</p></div></div><section class="panel"><div class="table-scroll"><table><thead><tr><th>Iniciativa</th><th>Módulo</th><th>Avance</th></tr></thead><tbody>${state.initiatives.map(i=>`<tr><td><span class="code">${i.id}</span> ${escapeHtml(i.name)}</td><td>${escapeHtml(i.area)}</td><td><div class="progress-track"><div class="progress-fill" style="width:${i.progress}%;background:#00f0ff;box-shadow:0 0 10px #00f0ff"></div></div></td></tr>`).join("")}</tbody></table></div></section>`;}
function renderReports(){return `<div class="page-head"><div><h1>Exportación</h1></div><button class="btn primary" data-action="export-csv">↓ Descargar Base de Datos (CSV)</button></div><section class="panel"><p>Exporta toda la información transaccional de GDMERP.</p></section>`;}
function renderAdministration(){return `<div class="page-head"><div><h1>Administración</h1></div></div><section class="panel"><h2>Usuarios</h2><div class="table-scroll"><table><thead><tr><th>Usuario</th><th>Rol</th><th>Área</th></tr></thead><tbody>${state.users.map(u=>`<tr><td>${escapeHtml(u.name)} (${escapeHtml(u.email)})</td><td>${escapeHtml(u.role)}</td><td>${escapeHtml(u.area)}</td></tr>`).join("")}</tbody></table></div></section>`;}

const renderers={dashboard:renderDashboard,mapa:renderMap,objetivos:renderObjectives,kpis:renderKpis,mediciones:renderMeasurements,iniciativas:renderInitiatives,reportes:renderReports,administracion:renderAdministration};

// LÓGICA DE GRÁFICOS (Chart.js)
function drawDashboardCharts(){
 if(typeof window.Chart==="undefined")return;
 const per=perspectiveBreakdown();
 Chart.defaults.color = "#a1a1aa";
 Chart.defaults.borderColor = "rgba(255, 255, 255, 0.05)";
 
 const ctx=$("#perspectiveChart");
 if(ctx)charts.perspective=new Chart(ctx,{type:"bar",data:{labels:per.map(x=>x.label),datasets:[{data:per.map(x=>x.pct||0),backgroundColor:per.map(x=>x.color),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:120}}}});
 
 const ctx2=$("#trendChart");
 if(ctx2){
  const months=["2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
  const values=months.map(m=>{const vals=state.kpis.map(k=>{const mm=k.measurements.find(x=>x.period===m);return mm?achievement(k,mm.value):null}).filter(x=>x!==null);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null});
  charts.trend=new Chart(ctx2,{type:"line",data:{labels:["Ene","Feb","Mar","Abr","May","Jun"],datasets:[{data:values,borderColor:"#00f0ff",backgroundColor:"rgba(0, 240, 255, 0.1)",fill:true,tension:0.4,pointBackgroundColor:"#00f0ff",pointShadowOffsetX:0,pointShadowOffsetY:0,pointShadowBlur:10,pointShadowColor:"#00f0ff"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:120}}}})}
}

// FUNCIONES Y MODALES
function bindPageEvents(page){
 $("#pageContent").onclick=e=>{
  const b=e.target.closest("[data-action]");if(!b)return;
  if(b.dataset.action==="new-measurement"||b.dataset.action==="measure-kpi") openMeasurementForm(b.dataset.id);
  else if(b.dataset.action==="export-csv"){
   const csv=[["ID","Indicador","Real","Meta","Unidad","Cumplimiento"].join(",")];
   state.kpis.forEach(k=>csv.push([k.id,`"${k.name}"`,k.current,k.target,k.unit,Math.round(achievement(k))+"%"].join(",")));
   const blob=new Blob([csv.join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="GDMERP_Data.csv";a.click();
  }
 };
}

function openMeasurementForm(kpiId=null){
 const k=state.kpis.find(x=>x.id===kpiId)||state.kpis[0];
 const body=`<form id="mForm" style="display:grid;gap:15px">
  <div><label style="color:#00f0ff;font-size:12px">Indicador</label><select id="mKpi" style="width:100%;padding:10px;background:#0a0f1d;color:#fff;border:1px solid #1e293b;border-radius:5px">${state.kpis.map(x=>`<option value="${x.id}" ${x.id===k.id?"selected":""}>${x.id} -${x.name}</option>`).join("")}</select></div>
  <div><label style="color:#00f0ff;font-size:12px">Valor Entero</label><input id="mValue" type="number" step="1" required style="width:100%;padding:10px;background:#0a0f1d;color:#fff;border:1px solid #1e293b;border-radius:5px"></div>
 </form>`;
 showModal("Registrar Resultado",body,()=>{
  const val=parseInt($("#mValue").value,10);if(isNaN(val)){toast("Ingresa un número entero","error");return}
  const target=state.kpis.find(x=>x.id===$("#mKpi").value);
  target.measurements.push({id:"M-"+Date.now(),period:monthNow(),date:today(),value:val,responsible:currentUser.name});
  target.current=val;saveState();closeModal();navigate(currentPage);toast("Dato registrado correctamente");
 });
}

function showModal(title,body,submitFn){
 $("#modalTitle").textContent=title;$("#modalBody").innerHTML=body;
 $("#modalFooter").innerHTML=`<button class="btn" id="modalCancel">Cancelar</button><button class="btn primary" id="modalSubmit">Guardar</button>`;
 $("#modalLayer").classList.remove("hidden");
 $("#modalClose").onclick=$("#modalCancel").onclick=closeModal;
 $("#modalSubmit").onclick=submitFn;
}
function closeModal(){$("#modalLayer").classList.add("hidden");}

// ARRANQUE
function init(){
 state=loadState();
 $("#loginForm").addEventListener("submit",e=>{e.preventDefault();if(!login($("#loginUser").value.trim(),$("#loginPass").value))$("#loginError").classList.remove("hidden");});
 $("#logoutBtn").addEventListener("click",logout);
 $("#mainNav").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)navigate(b.dataset.page)});
 try{const s=JSON.parse(sessionStorage.getItem("bsc_user"));if(s){currentUser=s;showApp()}}catch(e){}
}
document.addEventListener("DOMContentLoaded",init);
})();
