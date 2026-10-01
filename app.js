// EDITA AQUÍ: tu número con código de país, sin + ni espacios (Venezuela = 58)
var WA="584248484818";
// Los artículos se cargan desde catalogo.js (se edita con el administrador)
var DEF=30,PAGE=24;
var P=window.CATALOGO||[];
var CAT={retro:"Retro",sel:"Selecciones",club:"Clubes actuales",ropa:"Ropa"};

/* ---------- utilidades ---------- */
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function nz(x){return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function deb(f,ms){var h;return function(){clearTimeout(h);h=setTimeout(f,ms)}}
function isR(p){return p.cat==="ropa"}
function vtag(j){return +j[1]>0?" #"+j[1]:""}
function wa(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t)}

/* ---------- precios ---------- */
function pr(p){return +p.pr>0?+p.pr:DEF}
function off(p){return !!p.of&&+p.dc>0&&+p.dc<pr(p)}
function fin(p){return off(p)?+p.dc:pr(p)}
function money(n){return "$"+String(Math.round(n*100)/100)}
function usd(n){return String(Math.round(n*100)/100)+"$"}
function priceH(p){return off(p)?"<s>"+usd(pr(p))+"</s> "+usd(fin(p))+' <em class="of">Oferta</em>':usd(fin(p))+" <small>a tasa BCV</small>"}

/* ---------- preparación del catálogo (una sola vez) ---------- */
var BY={},BE={};
P.forEach(function(p,i){
if(!p.jug||!p.jug.length)p.jug=[["",0,{}]];
p.i=i;p.j=p.jug[0][0];p.n=p.jug[0][1];
p.k=nz([p.eq,p.d||"",CAT[p.cat]||""].concat(p.jug.map(function(j){return j[0]})).join(" "));
if(p.id)BY[p.id]=p;
if(!BE[p.eq])BE[p.eq]=p});
function lookup(x){return BY[x.id]||BE[x.eq]}
function cprice(x){var p=lookup(x);return p?fin(p):DEF}

/* ---------- tallas ---------- */
function tl(p,k){var j=p.jug[k],x=j[2]||p.tallas;if(x&&!Array.isArray(x))return ["S","M","L","XL"].filter(function(t){return x[t]>0});return x||["S","M","L","XL"]}
function ut(p){var u=[];p.jug.forEach(function(j,k){tl(p,k).forEach(function(t){if(u.indexOf(t)<0)u.push(t)})});return ["S","M","L","XL"].filter(function(t){return u.indexOf(t)>-1})}

/* ---------- dibujo de prendas (cuando no hay foto) ---------- */
var PATH='<path d="M35 8 20 14 4 32l12 12 10-6v54h48V38l10 6 12-12L80 14 65 8Q50 22 35 8Z" fill="#F0CDBD"/>';
var TA='font-family="Anton,Impact,sans-serif" text-anchor="middle" fill="#000"';
function sv(vb,inner,al){return '<svg viewBox="'+vb+'" role="img" aria-label="'+al+'">'+inner+'</svg>'}
function num(p){return +p.n>0?esc(p.n):""}
function front(p){
var t=isR(p)?'<text x="50" y="34" '+TA+' font-size="8">BROWN</text>':'<text x="50" y="66" '+TA+' font-size="30">'+num(p)+'</text>';
return sv("0 0 100 100",PATH+t,(isR(p)?"Prenda ":"Frente de la camisa de ")+esc(p.eq))}
function views(p){
if(p.imgs&&p.imgs.length)return p.imgs.slice(0,4).map(function(u,k){return '<img src="'+u+'" alt="'+esc(p.eq)+', foto '+(k+1)+'" decoding="async">'});
if(isR(p))return [front(p)];
return [
front(p),
sv("0 0 100 100",PATH+'<text x="50" y="40" '+TA+' font-size="6.5">'+esc(String(p.j).toUpperCase())+'</text><text x="50" y="72" '+TA+' font-size="34">'+num(p)+'</text>',"Espalda con nombre y número"),
sv("25 0 50 40",PATH+'<path d="M35 8Q50 22 65 8" stroke="#000" stroke-width="2" fill="none"/>',"Detalle del cuello"),
sv("0 8 46 42",PATH+'<path d="M16 44 26 38" stroke="#000" stroke-width="2"/>',"Detalle de la manga")]}
function cover(p){var u=p.imgs&&p.imgs[0];return u?'<div class="cph"><img src="'+u+'" alt="'+esc(p.eq)+'" loading="lazy" decoding="async"></div>':(p.img?'<img src="'+p.img+'" alt="'+esc(p.eq)+'">':front(p))}

/* ---------- tarjeta ---------- */
function card(p){
var u=ut(p),names=p.jug.map(function(x){return x[0]}).filter(Boolean),
short=names.slice(0,4).join(", ")+(names.length>4?" y "+(names.length-4)+" más":"");
return '<article class="card'+(u.length?"":" so")+'" data-v="'+p.i+'">'+cover(p)+'<h3>'+esc(p.eq)+'</h3>'+(short?'<p class="meta">'+(isR(p)?"Modelos: ":"Jugadores: ")+esc(short)+'</p>':'')+'<p class="dsc">'+esc(p.d||"")+'</p><p class="price">'+priceH(p)+'</p><div class="sizes" aria-label="Tallas disponibles">'+(u.map(function(t){return '<b>'+t+'</b>'}).join("")||'<b class="ag">Agotado</b>')+'</div><button type="button" class="btn" data-v="'+p.i+'">Ver y elegir</button></article>'}

/* ---------- ventana de detalle ---------- */
var dv=document.getElementById("dv"),dvb=document.getElementById("dvb");
function openV(i){
var p=P[i],R=isR(p),s="L",kk=0;
for(var z=0;z<p.jug.length;z++){if(tl(p,z).length){kk=z;break}}
p.j=p.jug[kk][0];p.n=p.jug[kk][1];
dvb.innerHTML='<div class="big" id="dvm"></div><div class="dvc"><div class="thumbs" id="dvth"></div><h2 id="dvt" style="font-size:2.4rem">'+esc(p.eq)+'</h2><p class="meta" style="margin:6px 0" id="dvj"></p><p style="margin:0 0 10px">'+esc(p.d||"")+'</p><p class="price" style="margin:0 0 14px">'+priceH(p)+'</p><p style="margin:0 0 8px;font-weight:600">'+(R?"Elige tu modelo":"Elige tu jugador")+'</p><div class="sizes" style="gap:8px;flex-wrap:wrap;margin:0 0 16px">'+p.jug.map(function(x,k){var ok=tl(p,k).length;return '<button type="button" class="pl" aria-pressed="'+(k===kk)+'"'+(ok?'':' disabled')+'>'+esc(x[0])+vtag(x)+(ok?'':' (agotado)')+'</button>'}).join("")+'</div><p style="margin:0 0 8px;font-weight:600">Elige tu talla</p><div class="sizes" id="dvs" style="gap:8px;margin:0 0 18px"></div><button type="button" class="btn" id="dva" style="width:100%">Agregar al carrito</button><a class="btn ghost" id="dvo" target="_blank" rel="noopener" style="display:block;text-align:center;margin-top:10px">Pedir solo esta por WhatsApp</a></div>';
var o=document.getElementById("dvo"),V,m=document.getElementById("dvm"),th=document.getElementById("dvth");
function show(k){m.innerHTML=V[k];th.querySelectorAll("button").forEach(function(b,j){b.setAttribute("aria-pressed",j===k)})}
function build(){V=views(p);th.hidden=V.length<2;th.innerHTML=V.map(function(h,k){return '<button type="button" class="th" aria-label="Ver imagen '+(k+1)+' de '+V.length+'">'+h+'</button>'}).join("");th.querySelectorAll("button").forEach(function(b,k){b.onclick=function(){show(k)}});show(0)}
build();
dvb.querySelectorAll(".pl").forEach(function(b,k){b.onclick=function(){p.j=p.jug[k][0];p.n=p.jug[k][1];dvb.querySelectorAll(".pl").forEach(function(x){x.setAttribute("aria-pressed",x===b)});kk=k;build();drawS()}});
var dvs=document.getElementById("dvs");
function drawS(){var L=tl(p,kk);if(L.indexOf(s)<0)s=L.indexOf("L")>-1?"L":(L[0]||"");
dvs.innerHTML=L.length?L.map(function(t){return '<button type="button" class="sz" aria-pressed="'+(t===s)+'">'+t+'</button>'}).join(""):'<b class="ag">Agotado</b>';
document.getElementById("dva").disabled=!L.length;up()}
function up(){
document.getElementById("dvj").textContent=R?"Modelo: "+p.j:"Jugador: "+p.j+(+p.n>0?", número "+p.n:"");
o.href=wa("Hola BROWN, quiero "+(R?"":"la camisa de ")+p.eq+" ("+p.j+(+p.n>0?", #"+p.n:"")+") en talla "+s+".");
o.textContent="Pedir solo esta en talla "+s+" por WhatsApp"}
drawS();
o.style.display=C.length?"none":"block";
document.getElementById("dva").onclick=function(){add(p,p.j,p.n,s);dv.close()};
dvs.onclick=function(e){var b=e.target.closest(".sz");if(!b)return;s=b.textContent;dvs.querySelectorAll(".sz").forEach(function(x){x.setAttribute("aria-pressed",x===b)});up()};
dv.showModal()}
document.addEventListener("click",function(e){var b=e.target.closest("[data-v]");if(b)openV(+b.dataset.v);if(e.target===dv||e.target.id==="dvx")dv.close()});

/* ---------- portada: destacados ---------- */
var fd=P.filter(function(p){return p.dest});if(!fd.length)fd=P.slice(0,4);
document.getElementById("dest").innerHTML=fd.slice(0,6).map(card).join("");

/* ---------- carrito ---------- */
var C=[];
try{C=JSON.parse(localStorage.getItem("brown_c")||"[]")}catch(e){C=[]}
function save(){try{localStorage.setItem("brown_c",JSON.stringify(C))}catch(e){}}
function cnt(){var q=C.reduce(function(a,x){return a+x.q},0);document.getElementById("cc").textContent=q;document.getElementById("cb").setAttribute("aria-label","Abrir carrito, "+q+" artículos")}
function toast(m){var t=document.getElementById("toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove("on")},2200)}
function add(p,j,n,t){var k=(p.id||p.eq)+"|"+j+"|"+t,f=C.filter(function(x){return x.k===k})[0];if(f)f.q++;else C.push({k:k,id:p.id||"",eq:p.eq,j:j,n:n,t:t,q:1});save();cnt();toast("Agregado al carrito")}
var cd=document.getElementById("cart"),cbd=document.getElementById("cbody");
function cthumb(x){var p=lookup(x)||{};return views({eq:x.eq,imgs:p.imgs,cat:p.cat,j:x.j,n:x.n})[0]}
function drawCart(){
if(!C.length){cbd.innerHTML='<p>Tu carrito está vacío. Elige un artículo y agrégalo.</p><a class="btn" href="#camisas" data-close style="display:inline-block">Ver camisas</a>';return}
var tot=0,rows=C.map(function(x,i){tot+=x.q*cprice(x);return '<div class="ci"><div class="cth">'+cthumb(x)+'</div><div style="flex:1;min-width:0"><strong>'+esc(x.eq)+'</strong><br><span class="meta">'+esc(x.j)+vtag([0,x.n])+', talla '+esc(x.t)+'</span></div><div class="qty"><button type="button" data-q="'+i+'" data-d="-1" aria-label="Quitar una">−</button><span>'+x.q+'</span><button type="button" data-q="'+i+'" data-d="1" aria-label="Agregar una">+</button></div></div>'}).join("");
cbd.innerHTML=rows+'<p class="price" style="margin:16px 0 10px">Total '+money(tot)+' <small>a tasa BCV</small></p><a class="btn" id="cs" target="_blank" rel="noopener" style="display:block;text-align:center">Enviar pedido por WhatsApp</a><button type="button" class="btn ghost" id="cv" style="width:100%;margin-top:10px">Vaciar carrito</button>';
document.getElementById("cs").href=wa("Hola BROWN, quiero hacer este pedido:\n"+C.map(function(x){return "- "+x.q+" x "+x.eq+", "+x.j+vtag([0,x.n])+", talla "+x.t}).join("\n")+"\nTotal: "+money(tot)+" a tasa BCV")}
document.addEventListener("click",function(e){
var b=e.target.closest("[data-q]");
if(b){var i=+b.dataset.q;C[i].q+=+b.dataset.d;if(C[i].q<1)C.splice(i,1);save();cnt();drawCart();return}
if(e.target.id==="cv"){C=[];save();cnt();drawCart();return}
if(e.target.closest("#cb")){drawCart();cd.showModal();return}
if(e.target===cd||e.target.id==="cx"||e.target.closest("[data-close]"))cd.close()});

/* ---------- catálogo: búsqueda, filtros y paginación ---------- */
var cat="all",qi=document.getElementById("q"),box=document.getElementById("todas"),mb=document.getElementById("more"),res=[],shown=0;
function filt(){var w=nz(qi.value.trim()).split(/\s+/).filter(Boolean);
res=P.filter(function(p){return (cat==="all"||p.cat===cat)&&w.every(function(t){return p.k.indexOf(t)>-1})})}
function more(){var a=res.slice(shown,shown+PAGE);shown+=a.length;
box.insertAdjacentHTML("beforeend",a.map(card).join(""));
var n=res.length-shown;mb.hidden=n<=0;if(n>0)mb.textContent="Ver más ("+n+" restantes)";
if(io&&n>0){io.unobserve(mb);io.observe(mb)}}
function list(){filt();shown=0;box.innerHTML="";
if(res.length)more();
else{mb.hidden=true;box.innerHTML='<p>No encontramos esa búsqueda. <a href="'+wa("Hola BROWN, ¿pueden conseguirme algo? Busco: "+qi.value)+'" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y la buscamos.</p>'}
document.getElementById("cnt").textContent=res.length+(res.length===1?" artículo":" artículos")}
var io=window.IntersectionObserver?new IntersectionObserver(function(en){if(en[0].isIntersecting&&!mb.hidden)more()},{rootMargin:"500px"}):null;
mb.addEventListener("click",more);
qi.addEventListener("input",deb(list,120));
document.getElementById("chips").addEventListener("click",function(e){var b=e.target.closest("[data-c]");if(!b)return;cat=b.dataset.c;this.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed",x===b)});list()});
list();cnt();

/* ---------- contacto y rutas ---------- */
document.querySelectorAll("[data-wa]").forEach(function(a){a.href=wa(a.dataset.wa);a.target="_blank";a.rel="noopener"});
document.getElementById("f").addEventListener("submit",function(e){e.preventDefault();var d=e.target;
var t="Hola BROWN, soy "+d.n.value+". Me interesa: "+(d.c.value||"ver camisas")+". Talla: "+d.t.value+"."+(d.m.value?" "+d.m.value:"");
window.open(wa(t),"_blank","noopener")});
var T={inicio:"BROWN | Camisas de fútbol en El Tigre, Venezuela",camisas:"Camisas de fútbol en El Tigre | BROWN",contacto:"Contacto y WhatsApp | BROWN"};
function route(){var h=(location.hash||"#inicio").slice(1);if(!T[h])h="inicio";
document.querySelectorAll(".page").forEach(function(p){p.classList.toggle("on",p.id===h)});
document.querySelectorAll("nav a").forEach(function(a){a.getAttribute("href")==="#"+h?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")});
document.title=T[h];window.scrollTo(0,0)}
document.documentElement.classList.add("js");
window.addEventListener("hashchange",route);route();
