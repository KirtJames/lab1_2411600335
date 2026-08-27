document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
    return;
  }

  const username = localStorage.getItem("username") || "Admin";

  document.getElementById("userGreeting").textContent = username;
  document.getElementById("navUser").textContent = username;
  updateGreeting(username);
  updateStatistics();
  populateActivityTable();
  setupLogout();
  document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString("en-PH", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  function updateGreeting(name) {
    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    document.getElementById("greeting").textContent = `${greeting}, ${name}`;
  }

  function updateStatistics() {
    const stats = [
      { title: "Total Orders", value: "248", className: "text-primary" },
      { title: "Revenue", value: "₱86,450", className: "text-success" },
      { title: "Customers", value: "1,284", className: "text-info" },
      { title: "Return Rate", value: "2.4%", className: "text-warning" }
    ];

    stats.forEach((stat, index) => {
      const number = index + 1;
      const titleEl = document.getElementById(`stat${number}-title`);
      const valueEl = document.getElementById(`stat${number}-value`);

      titleEl.textContent = stat.title;
      valueEl.textContent = stat.value;
      valueEl.className = `stat-value ${stat.className}`;
    });
  }

  function populateActivityTable() {
    const activities = [
      { date: "2026-08-27 09:15", activity: "New order #QC-1042 received", status: "Success" },
      { date: "2026-08-27 10:05", activity: "Product stock updated", status: "Info" },
      { date: "2026-08-27 11:20", activity: "Customer account created", status: "Success" },
      { date: "2026-08-27 12:45", activity: "Order #QC-1038 returned", status: "Warning" },
      { date: "2026-08-27 14:10", activity: "Daily sales report generated", status: "Success" }
    ];

    const tableBody = document.getElementById("activityTableBody");
    tableBody.innerHTML = "";

    activities.forEach(item => {
      const row = document.createElement("tr");
      let badgeClass = "bg-secondary";
      if (item.status === "Success") badgeClass = "bg-success";
      if (item.status === "Warning") badgeClass = "bg-warning text-dark";
      if (item.status === "Info") badgeClass = "bg-info text-dark";

      row.innerHTML = `
        <td>${item.date}</td>
        <td>${item.activity}</td>
        <td><span class="badge ${badgeClass}">${item.status}</span></td>
      `;
      tableBody.appendChild(row);
    });
  }

  function setupLogout() {
    document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.href = "index.html";
    });
  }
});
