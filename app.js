const seedListings = [
  {id:1,title:"Engineering Mathematics Vol. 1",category:"Books",price:280,description:"Clean copy with a few pencil notes. Great for first-year engineering maths. No missing pages.",seller:"Aarav",campus:"North Campus",emoji:"📚",art:"books",condition:"Good condition",posted:"2 hours ago",contact:"aarav@example.edu"},
  {id:2,title:"Wireless Headphones",category:"Electronics",price:899,description:"Bluetooth headphones, working perfectly. Includes charging cable. Selling because I upgraded.",seller:"Meera",campus:"North Campus",emoji:"🎧",art:"tech",condition:"Like new",posted:"Yesterday",contact:"meera@example.edu"},
  {id:3,title:"Study Table Lamp",category:"Hostel",price:350,description:"Warm and cool light modes, flexible neck. Perfect for late-night study sessions.",seller:"Kabir",campus:"Hostel Block B",emoji:"💡",art:"hostel",condition:"Good condition",posted:"Yesterday",contact:"kabir@example.edu"},
  {id:4,title:"Hybrid Bicycle",category:"Cycles",price:3200,description:"Lightweight frame, recently serviced brakes. Test ride welcome at the campus gate.",seller:"Riya",campus:"North Campus",emoji:"🚲",art:"cycle",condition:"Used — working well",posted:"2 days ago",contact:"riya@example.edu"},
  {id:5,title:"Scientific Calculator",category:"Electronics",price:550,description:"All functions work, clear display and original hard cover included.",seller:"Dev",campus:"Academic Block",emoji:"🧮",art:"tech",condition:"Good condition",posted:"2 days ago",contact:"dev@example.edu"},
  {id:6,title:"Hostel Storage Organizer",category:"Hostel",price:220,description:"Foldable fabric organizer. Fits under a bed or inside a cupboard. Clean and ready to use.",seller:"Ishita",campus:"Girls Hostel",emoji:"🧺",art:"hostel",condition:"Like new",posted:"3 days ago",contact:"ishita@example.edu"},
  {id:7,title:"Physics Lab Coat",category:"Other",price:180,description:"White lab coat, size M. Worn only a few times and freshly washed.",seller:"Nikhil",campus:"Science Block",emoji:"🥼",art:"other",condition:"Like new",posted:"3 days ago",contact:"nikhil@example.edu"},
  {id:8,title:"Organic Chemistry Notes",category:"Books",price:120,description:"Handwritten revision notes with reaction summaries and important mechanisms.",seller:"Sara",campus:"North Campus",emoji:"📝",art:"books",condition:"Good condition",posted:"4 days ago",contact:"sara@example.edu"},
  {id:9,title:"Resistance Bands Set",category:"Other",price:260,description:"Set of three resistance bands. Useful for hostel-room workouts.",seller:"Manav",campus:"Sports Complex",emoji:"🏋️",art:"other",condition:"Like new",posted:"4 days ago",contact:"manav@example.edu"},
  {id:10,title:"Mechanical Drawing Kit",category:"Other",price:400,description:"Compass, divider, set squares and scale in a hard case. All pieces included.",seller:"Ananya",campus:"Workshop Block",emoji:"📐",art:"lab",condition:"Good condition",posted:"5 days ago",contact:"ananya@example.edu"},
  {id:11,title:"Portable Bluetooth Speaker",category:"Electronics",price:700,description:"Compact speaker with good battery life. Great for a small room.",seller:"Yash",campus:"Hostel Block A",emoji:"🔊",art:"tech",condition:"Used — working well",posted:"5 days ago",contact:"yash@example.edu"},
  {id:12,title:"Desk Organizer",category:"Hostel",price:150,description:"Minimal desk organizer for stationery and small accessories.",seller:"Tara",campus:"North Campus",emoji:"🗂️",art:"hostel",condition:"Like new",posted:"1 week ago",contact:"tara@example.edu"}
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const readStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
let userListings = readStore("campusloop-listings", []);
let saved = readStore("campusloop-saved", []);
let activeCategory = "All", searchTerm = "", showAll = false;
let toastTimer;
const allListings = () => [...userListings, ...seedListings];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
function render(){
  const filtered=allListings().filter(item=>(activeCategory==="All"||item.category===activeCategory)&&(`${item.title} ${item.description} ${item.category} ${item.seller} ${item.campus}`).toLowerCase().includes(searchTerm));
  const visible=showAll?filtered:filtered.slice(0,8);
  $("#listingGrid").innerHTML=visible.map(item=>`<article class="item-card" data-id="${item.id}" tabindex="0" role="button" aria-label="View ${escapeHTML(item.title)}">
    <div class="item-art art-${item.art||"other"}"><span class="item-category">${escapeHTML(item.category.toUpperCase())}</span><button class="save-item ${saved.includes(item.id)?"saved":""}" data-save="${item.id}" aria-label="${saved.includes(item.id)?"Remove from":"Save"} saved items">${saved.includes(item.id)?"♥":"♡"}</button><span class="item-emoji">${item.emoji||"📦"}</span></div>
    <div class="item-details"><h3 class="item-title">${escapeHTML(item.title)}</h3><div class="item-meta"><span>${escapeHTML(item.campus)}</span><span>${escapeHTML(item.posted||"Just listed")}</span></div><div class="item-bottom"><span class="item-price">₹${Number(item.price).toLocaleString("en-IN")}</span><span class="seller-mini">by <span>${escapeHTML(item.seller)}</span></span></div></div></article>`).join("");
  $("#resultCount").textContent=`${filtered.length} ITEM${filtered.length===1?"":"S"}`;
  $("#resultsLabel").textContent=activeCategory==="All"?"CURATED FOR YOUR CAMPUS":`${activeCategory.toUpperCase()} FINDS`;
  $("#emptyState").classList.toggle("hidden",filtered.length!==0);
  $("#listingGrid").classList.toggle("hidden",filtered.length===0);
  $("#loadMoreBtn").classList.toggle("hidden",filtered.length<=8||showAll);
  $("#savedCount").textContent=saved.length;
}
function openListing(id){
  const item=allListings().find(x=>String(x.id)===String(id));if(!item)return;
  $("#listingModalContent").innerHTML=`<div class="detail-art art-${item.art||"other"}">${item.emoji||"📦"}</div><div class="eyebrow">${escapeHTML(item.category.toUpperCase())} · ${escapeHTML(item.condition||"Pre-loved")}</div><h2 class="detail-title" id="listingModalTitle">${escapeHTML(item.title)}</h2><div class="detail-price">₹${Number(item.price).toLocaleString("en-IN")}</div><p class="detail-description">${escapeHTML(item.description)}</p><div class="detail-info"><span>📍 ${escapeHTML(item.campus)}</span><span>♻ ${escapeHTML(item.condition||"Pre-loved")}</span><span>👤 ${escapeHTML(item.seller)}</span></div><p class="detail-description">Interested? Contact the seller directly and arrange a safe campus meet-up. Inspect the item before agreeing to buy.</p><a class="button button-primary button-large" href="mailto:${encodeURIComponent(item.contact)}?subject=${encodeURIComponent("Interested in "+item.title)}">Contact seller <span>↗</span></a><p class="form-note">CampusLoop does not process payments. Agree on details directly with the seller.</p>`;
  $("#listingModal").classList.remove("hidden");document.body.style.overflow="hidden";
}
function closeModal(modal){modal.classList.add("hidden");if($$(".modal-backdrop:not(.hidden)").length===0)document.body.style.overflow=""}
function toggleSave(id){id=Number(id);saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem("campusloop-saved",JSON.stringify(saved));render();showToast(saved.includes(id)?"Added to saved finds":"Removed from saved finds")}
function openSell(){ $("#sellModal").classList.remove("hidden");document.body.style.overflow="hidden";setTimeout(()=>$('#sellForm input[name="title"]').focus(),100)}
$("#listingGrid").addEventListener("click",e=>{const saveBtn=e.target.closest("[data-save]");if(saveBtn){e.stopPropagation();toggleSave(saveBtn.dataset.save);return}const card=e.target.closest("[data-id]");if(card)openListing(card.dataset.id)});
$("#listingGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();openListing(e.target.dataset.id)}});
$("#categoryFilters").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;showAll=false;$$(".filter-chip").forEach(x=>x.classList.toggle("active",x===btn));render()});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();showAll=false;render()});
$("#loadMoreBtn").addEventListener("click",()=>{showAll=true;render()});
$("#viewAllBtn").addEventListener("click",()=>{showAll=true;activeCategory="All";searchTerm="";$("#searchInput").value="";$$(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));render()});
$("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";searchTerm="";activeCategory="All";$$(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));render()});
["#sellTopBtn","#heroSellBtn","#sellBannerBtn"].forEach(s=>$(s).addEventListener("click",openSell));
$$("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.closest(".modal-backdrop"))));
$$(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal(backdrop)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal-backdrop:not(.hidden)").forEach(closeModal);if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus()}});
$("#savedNav").addEventListener("click",()=>{const ids=new Set(saved);const savedItems=allListings().filter(x=>ids.has(x.id));if(!savedItems.length){showToast("Save a few finds to see them here");return}$("#searchInput").value="";searchTerm="";activeCategory="All";showAll=true;render();$("#resultsLabel").textContent="YOUR SAVED FINDS";$("#listingGrid").innerHTML=savedItems.map(item=>`<article class="item-card" data-id="${item.id}" tabindex="0" role="button"><div class="item-art art-${item.art||"other"}"><span class="item-category">${escapeHTML(item.category.toUpperCase())}</span><span class="item-emoji">${item.emoji||"📦"}</span></div><div class="item-details"><h3 class="item-title">${escapeHTML(item.title)}</h3><div class="item-bottom"><span class="item-price">₹${Number(item.price).toLocaleString("en-IN")}</span><span class="seller-mini">${escapeHTML(item.seller)}</span></div></div></article>`).join("");$("#explore").scrollIntoView({behavior:"smooth"})});
$("#loginBtn").addEventListener("click",()=>showToast("Student sign-in is a future feature in this demo."));
$("#sellForm").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));const item={...data,id:Date.now(),price:Number(data.price),emoji:({Books:"📚",Electronics:"🎧",Hostel:"🛏️",Cycles:"🚲",Other:"📦"})[data.category],art:({Books:"books",Electronics:"tech",Hostel:"hostel",Cycles:"cycle",Other:"other"})[data.category],condition:"Seller described",posted:"Just now"};userListings.unshift(item);localStorage.setItem("campusloop-listings",JSON.stringify(userListings));e.currentTarget.reset();closeModal($("#sellModal"));activeCategory="All";searchTerm="";showAll=true;$("#searchInput").value="";$$(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));render();$("#explore").scrollIntoView({behavior:"smooth"});showToast("Your item is in the loop! (saved on this device)")});
$("#year").textContent=new Date().getFullYear();
render();
