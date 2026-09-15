// QuickCart Lab 4 - Dashboard
let currentFilteredProducts=[],filters={query:"",category:"all",status:"all",minPrice:"",maxPrice:""};

document.addEventListener("DOMContentLoaded",async()=>{
if(localStorage.getItem("quickcartLoggedIn")!=="true"){window.location.href="index.html";return;}
await initializeData();
setupCategoryFilter();
setupEventListeners();
updateDashboard();
setInterval(simulateInventoryUpdate,15000);
});

function setupCategoryFilter(){
const select=document.getElementById("categoryFilter");
[...new Set(getProducts().map(p=>p.category))].forEach(category=>{
const option=document.createElement("option");option.value=category;option.textContent=category;select.appendChild(option);
});
}
function setupEventListeners(){
document.getElementById("searchInput").addEventListener("input",e=>{filters.query=e.target.value;updateDashboard();});
document.getElementById("categoryFilter").addEventListener("change",e=>{filters.category=e.target.value;updateDashboard();});
document.getElementById("stockFilter").addEventListener("change",e=>{filters.status=e.target.value;updateDashboard();});
document.getElementById("minPrice").addEventListener("input",e=>{filters.minPrice=e.target.value;updateDashboard();});
document.getElementById("maxPrice").addEventListener("input",e=>{filters.maxPrice=e.target.value;updateDashboard();});
document.getElementById("exportBtn").addEventListener("click",()=>downloadCSV(exportToCSV(currentFilteredProducts),"QuickCart_Inventory.csv"));
document.getElementById("logoutBtn").addEventListener("click",()=>{localStorage.removeItem("quickcartLoggedIn");window.location.href="index.html";});
}
function updateDashboard(){
currentFilteredProducts=applyFilters(filters);
updateStatistics();updateLowStockAlert();updateInventoryTable(currentFilteredProducts);createCharts(currentFilteredProducts);
document.getElementById("resultCount").textContent=`${currentFilteredProducts.length} product(s)`;
}
function updateStatistics(){
const s=getStockStatistics();
document.getElementById("totalProducts").textContent=s.totalProducts;
document.getElementById("totalValue").textContent=formatCurrency(s.totalValue);
document.getElementById("lowStockCount").textContent=s.lowStockCount;
document.getElementById("outOfStockCount").textContent=s.outOfStockCount;
}
function updateLowStockAlert(){
const alert=document.getElementById("lowStockAlert"), low=getLowStockProducts();
if(!low.length){alert.classList.add("d-none");return;}
alert.classList.remove("d-none");
alert.innerHTML=`<strong>Low Stock Alert:</strong> ${low.map(p=>`${escapeHTML(p.name)} (${p.quantity} left)`).join(", ")}`;
}
function updateInventoryTable(data){
const body=document.getElementById("inventoryTableBody");body.innerHTML="";
if(!data.length){body.innerHTML='<tr><td colspan="7" class="text-center text-muted py-4">No products found.</td></tr>';return;}
data.forEach(p=>{
const row=document.createElement("tr"),status=getStockStatus(p);
if(status==="low stock")row.classList.add("low-stock-row");
if(status==="out of stock")row.classList.add("out-of-stock-row");
row.innerHTML=`<td class="fw-semibold">${escapeHTML(p.name)}</td><td>${escapeHTML(p.sku)}</td><td>${escapeHTML(p.category)}</td><td>${formatCurrency(p.unit_price)}</td><td>${p.quantity}</td><td>${createStatusBadge(status)}</td><td>${formatCurrency(p.quantity*p.unit_price)}</td>`;
body.appendChild(row);
});
}
function createStatusBadge(status){
const classes={"in stock":"bg-success","low stock":"bg-warning text-dark","out of stock":"bg-danger"};
return `<span class="badge ${classes[status]}">${status}</span>`;
}
function formatCurrency(value){return new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(value);}
function escapeHTML(value){const div=document.createElement("div");div.textContent=value;return div.innerHTML;}

function simulateInventoryUpdate(){
const list=getProducts();if(!list.length)return;
const product=list[Math.floor(Math.random()*list.length)];
const old=product.quantity,change=Math.random()<0.5?-1:1;
product.quantity=Math.max(0,product.quantity+change);
updateDashboard();
showUpdateNotification(`${product.name} stock changed from ${old} to ${product.quantity}.`);
}
function showUpdateNotification(message){
document.getElementById("updateToastBody").textContent=message;
bootstrap.Toast.getOrCreateInstance(document.getElementById("updateToast")).show();
}