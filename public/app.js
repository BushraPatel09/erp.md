const state = { jobs: [], storage: { usedGb: 0 }, history: [] };

async function boot() {
  const feed = document.getElementById('liveFeed');
  feed.innerHTML = '<li>Connect API with JWT token to stream live data.</li>';
  render();

  const chart = new Chart(document.getElementById('storageChart'), {
    type: 'line',
    data: { labels: ['T-4', 'T-3', 'T-2', 'T-1', 'Now'], datasets: [{ label: 'GB', data: [40, 55, 62, 74, 88], borderColor: '#38bdf8' }] },
    options: { plugins: { legend: { labels: { color: '#e2e8f0' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }
  });

  chart.update();
}

function render() {
  document.getElementById('totalBackups').textContent = String(state.jobs.length);
  document.getElementById('activeJobs').textContent = String(state.jobs.filter((j) => j.status === 'running').length);
  document.getElementById('failedJobs').textContent = String(state.jobs.filter((j) => j.status === 'failed').length);
  document.getElementById('storageUsed').textContent = String(state.storage.usedGb || 0);

  document.getElementById('jobsTable').innerHTML = state.jobs.map((job) => `
    <tr><td>${job.name}</td><td>${job.type}</td><td>${job.status}</td><td>${job.schedule}</td></tr>
  `).join('');
}

boot();
