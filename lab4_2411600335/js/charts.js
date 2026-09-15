// QuickCart Lab 4 - Chart.js
let inventoryValueChart,stockStatusChart,topProductsChart;

function createCharts(data){
const categorySummary={};
data.forEach(p=>{if(!categorySummary[p.category])categorySummary[p.category]=0;categorySummary[p.category]+=p.quantity*p.unit_price;});
const statusCounts={
"In Stock":data.filter(p=>getStockStatus(p)==="in stock").length,
"Low Stock":data.filter(p=>getStockStatus(p)==="low stock").length,
"Out of Stock":data.filter(p=>getStockStatus(p)==="out of stock").length};
const topProducts=[...data].sort((a,b)=>b.quantity*b.unit_price-a.quantity*a.unit_price).slice(0,5);
if(inventoryValueChart)inventoryValueChart.destroy();
if(stockStatusChart)stockStatusChart.destroy();
if(topProductsChart)topProductsChart.destroy();

inventoryValueChart=new Chart(document.getElementById("inventoryValueChart"),{
type:"bar",data:{labels:Object.keys(categorySummary),datasets:[{label:"Inventory Value (₱)",data:Object.values(categorySummary),backgroundColor:"#6f42c1"}]},
options:{responsive:true,maintainAspectRatio:false}});

stockStatusChart=new Chart(document.getElementById("stockStatusChart"),{
type:"doughnut",data:{labels:Object.keys(statusCounts),datasets:[{data:Object.values(statusCounts),backgroundColor:["#198754","#ffc107","#dc3545"]}]},
options:{responsive:true,maintainAspectRatio:false}});

topProductsChart=new Chart(document.getElementById("topProductsChart"),{
type:"bar",data:{labels:topProducts.map(p=>p.name),datasets:[{label:"Inventory Value (₱)",data:topProducts.map(p=>p.quantity*p.unit_price),backgroundColor:"#fd7e14"}]},
options:{indexAxis:"y",responsive:true,maintainAspectRatio:false}});
}