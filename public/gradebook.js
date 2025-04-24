async function fetchGradeData() {
  console.log("Fetching data from server...");
  try {
    const response = await fetch('/api/grades');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data received:", data);
    populateGradebook(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

function populateGradebook(data) {
  const tableBody = document.querySelector('#gradebook tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  data.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.first_name} ${student.last_name}</td>
      <td colspan="3">${student.total_grade.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Auto fetch when page loads
window.onload = fetchGradeData;
