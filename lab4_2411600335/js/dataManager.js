// QuickCart Lab 4 - Data Management
let products=[];

async function initializeData(){
try{
const response=await fetch("api/products.php");
if(!response.ok) throw new Error("Unable to retrieve inventory data.");
products=await response.json();
}catch(error){
console.warn("Using simulated local inventory data:",error.message);
products=LOCAL_PRODUCTS.map(p=>({...p}));
}
return products;
}

const LOCAL_PRODUCTS=[{"id": 1, "name": "Wireless Mouse", "sku": "QC-MOU-001", "category": "Electronics", "unit_price": 599, "quantity": 3, "reorder_level": 5, "supplier": "Tech Supply Co."}, {"id": 2, "name": "Mechanical Keyboard", "sku": "QC-KEY-002", "category": "Electronics", "unit_price": 1899, "quantity": 12, "reorder_level": 5, "supplier": "Tech Supply Co."}, {"id": 3, "name": "USB-C Cable", "sku": "QC-CAB-003", "category": "Accessories", "unit_price": 299, "quantity": 25, "reorder_level": 10, "supplier": "Cable World"}, {"id": 4, "name": "Laptop Stand", "sku": "QC-LAP-004", "category": "Accessories", "unit_price": 899, "quantity": 7, "reorder_level": 5, "supplier": "Office Essentials"}, {"id": 5, "name": "Webcam HD", "sku": "QC-WEB-005", "category": "Electronics", "unit_price": 1499, "quantity": 4, "reorder_level": 5, "supplier": "Tech Supply Co."}, {"id": 6, "name": "Office Chair", "sku": "QC-CHR-006", "category": "Furniture", "unit_price": 5499, "quantity": 8, "reorder_level": 3, "supplier": "Office Essentials"}, {"id": 7, "name": "Desk Lamp", "sku": "QC-LAM-007", "category": "Furniture", "unit_price": 1299, "quantity": 0, "reorder_level": 3, "supplier": "Home Supplies"}, {"id": 8, "name": "Bluetooth Speaker", "sku": "QC-SPK-008", "category": "Electronics", "unit_price": 2299, "quantity": 6, "reorder_level": 5, "supplier": "Audio Hub"}];

function getProducts(){return products;}
function getProductById(id){return products.find(p=>p.id===Number(id));}
function getProductsByCategory(category){
if(!category||category==="all") return products;
return products.filter(p=>p.category.toLowerCase()===category.toLowerCase());
}
function getStockStatus(product){
if(product.quantity===0)return "out of stock";
if(product.quantity<=product.reorder_level)return "low stock";
return "in stock";
}
function getLowStockProducts(){return products.filter(p=>p.quantity<=p.reorder_level);}
function getStockStatistics(){
return {
totalProducts:products.length,
totalValue:products.reduce((sum,p)=>sum+p.quantity*p.unit_price,0),
lowStockCount:products.filter(p=>p.quantity>0&&p.quantity<=p.reorder_level).length,
outOfStockCount:products.filter(p=>p.quantity===0).length
};
}
function getCategorySummary(){
const summary={};
products.forEach(p=>{
if(!summary[p.category])summary[p.category]={quantity:0,value:0};
summary[p.category].quantity+=p.quantity;
summary[p.category].value+=p.quantity*p.unit_price;
});
return summary;
}
function filterByCategory(category){return getProductsByCategory(category);}
function filterByStockStatus(status){
if(!status||status==="all")return products;
return products.filter(p=>getStockStatus(p)===status.toLowerCase());
}
function filterByPriceRange(min,max){
const minimum=min===""?0:Number(min), maximum=max===""?Infinity:Number(max);
return products.filter(p=>p.unit_price>=minimum&&p.unit_price<=maximum);
}
function searchProducts(query){
if(!query.trim())return products;
const term=query.toLowerCase();
return products.filter(p=>p.name.toLowerCase().includes(term)||p.sku.toLowerCase().includes(term));
}
function applyFilters(filters){
return products.filter(p=>{
const category=filters.category==="all"||p.category.toLowerCase()===filters.category.toLowerCase();
const status=filters.status==="all"||getStockStatus(p)===filters.status.toLowerCase();
const min=filters.minPrice===""?0:Number(filters.minPrice);
const max=filters.maxPrice===""?Infinity:Number(filters.maxPrice);
const price=p.unit_price>=min&&p.unit_price<=max;
const q=filters.query.trim().toLowerCase();
const search=!q||p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q);
return category&&status&&price&&search;
});
}
function updateSearchResults(query){return searchProducts(query);}
function exportToCSV(data){
const headers=["Product","SKU","Category","Unit Price","Quantity","Reorder Level","Stock Status","Inventory Value"];
const rows=data.map(p=>[p.name,p.sku,p.category,p.unit_price,p.quantity,p.reorder_level,getStockStatus(p),p.quantity*p.unit_price]);
return [headers,...rows].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
}
function downloadCSV(csvContent,filename){
const blob=new Blob([csvContent],{type:"text/csv;charset=utf-8;"});
const url=URL.createObjectURL(blob), link=document.createElement("a");
link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
}