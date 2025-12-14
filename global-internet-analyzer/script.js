// Load JSON Data
let internetData = [];
fetch('data/internet_data.json')
  .then(response => response.json())
  .then(data => {
    internetData = data;
    populateDropdown();
    drawChart();
    drawGlobe();
  });

// Populate country dropdown
function populateDropdown() {
  const select = document.getElementById('countrySelect');
  internetData.forEach(country => {
    const option = document.createElement('option');
    option.value = country.country;
    option.textContent = country.country;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    drawChart(select.value);
  });
}

// Draw Chart.js line chart
let chart;
function drawChart(countryName = '') {
  const ctx = document.getElementById('speedChart').getContext('2d');

  let labels = [];
  let speed2023 = [];
  let speed2024 = [];

  if (countryName) {
    const country = internetData.find(c => c.country === countryName);
    labels = ['2023', '2024'];
    speed2023 = [country.speed2023];
    speed2024 = [country.speed2024];
  } else {
    internetData.forEach(c => {
      labels.push(c.country);
      speed2023.push(c.speed2023);
      speed2024.push(c.speed2024);
    });
  }

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Speed 2023 (Mbps)',
          data: speed2023,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Speed 2024 (Mbps)',
          data: speed2024,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Global Internet Speeds' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Draw 3D Globe
function drawGlobe() {
  const globeContainer = document.getElementById('globeContainer');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, globeContainer.offsetWidth / globeContainer.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(globeContainer.offsetWidth, globeContainer.offsetHeight);
  globeContainer.appendChild(renderer.domElement);

  const globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .arcsData(internetData.filter(d => d.speed2024), d => ({
      startLat: Math.random() * 180 - 90,
      startLng: Math.random() * 360 - 180,
      endLat: Math.random() * 180 - 90,
      endLng: Math.random() * 360 - 180,
      color: ['red', 'blue'][Math.round(Math.random())]
    }));

  scene.add(globe);

  camera.position.z = 200;

  const animate = function () {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.001;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = globeContainer.offsetWidth / globeContainer.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(globeContainer.offsetWidth, globeContainer.offsetHeight);
  });
}

