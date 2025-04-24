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
      <td>${student.student_name}</td>
      <td>${student.assignment1}</td>
      <td>${student.assignment2}</td>
      <td>${student.assignment3}</td>
    `;
    tableBody.appendChild(row);
  });
}

window.onload = fetchGradeData;
