// EMBEDDED JSON DATA
const internetData = [
  {"country":"Afghanistan","major_area":"Asia","region":"Southern Asia","speed2023":2.84,"speed2024":3.63},
  {"country":"Albania","major_area":"Europe","region":"Southern Europe","speed2023":46.47,"speed2024":62.71},
  {"country":"Algeria","major_area":"Africa","region":"Northern Africa","speed2023":11.3,"speed2024":14.26},
  {"country":"Andorra","major_area":"Europe","region":"Southern Europe","speed2023":93.94,"speed2024":null},
  {"country":"Angola","major_area":"Africa","region":"Middle Africa","speed2023":15.96,"speed2024":18.58},
  {"country":"Argentina","major_area":"Latin America and the Caribbean","region":"South America","speed2023":68.66,"speed2024":88.03},
  {"country":"Australia","major_area":"Oceania","region":"Australia and New Zealand","speed2023":54.08,"speed2024":71.87},
  {"country":"Austria","major_area":"Europe","region":"Western Europe","speed2023":69.6,"speed2024":92.86},
  {"country":"Brazil","major_area":"Latin America and the Caribbean","region":"South America","speed2023":126.89,"speed2024":170.42},
  {"country":"Canada","major_area":"Northern America","region":"Northern America","speed2023":153.39,"speed2024":188.2},
  {"country":"China","major_area":"Asia","region":"Eastern Asia","speed2023":200.53,"speed2024":189.49},
  {"country":"France","major_area":"Europe","region":"Western Europe","speed2023":169.65,"speed2024":223.72},
  {"country":"India","major_area":"Asia","region":"Southern Asia","speed2023":54.17,"speed2024":63.79},
  {"country":"Japan","major_area":"Asia","region":"Eastern Asia","speed2023":143.18,"speed2024":197.78},
  {"country":"Singapore","major_area":"Asia","region":"SouthEastern Asia","speed2023":254.65,"speed2024":297.57},
  {"country":"United States","major_area":"Northern America","region":"Northern America","speed2023":210.4,"speed2024":242.27}
  // Add more countries here as needed
];

// Populate dropdown
const select = document.getElementById('countrySelect');
internetData.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c.country;
  opt.textContent = c.country;
  select.appendChild(opt);
});

select.addEventListener('change', () => {
  drawChart(select.value);
});

// Draw Chart
let chart;
function drawChart(countryName = '') {
  const ctx = document.getElementById('speedChart').getContext('2d');
  let labels = [];
  let speed2023 = [];
  let speed2024 = [];

  if (countryName) {
    const c = internetData.find(d => d.country === countryName);
    labels = ['2023','2024'];
    speed2023 = [c.speed2023 || 0];
    speed2024 = [c.speed2024 || 0];
  } else {
    internetData.forEach(c => {
      labels.push(c.country);
      speed2023.push(c.speed2023 || 0);
      speed2024.push(c.speed2024 || 0);
    });
  }

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {label: 'Speed 2023 (Mbps)', data: speed2023, backgroundColor:'rgba(54,162,235,0.6)'},
        {label: 'Speed 2024 (Mbps)', data: speed2024, backgroundColor:'rgba(255,99,132,0.6)'}
      ]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      plugins: {legend:{position:'top'}, title:{display:true, text:'Global Internet Speeds'}},
      scales:{y:{beginAtZero:true}}
    }
  });
}

// Initial chart
drawChart();

// Globe
function drawGlobe() {
  const container = document.getElementById('globeContainer');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth/container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  const globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg');

  scene.add(globe);
  camera.position.z = 200;

  const animate = function(){
    requestAnimationFrame(animate);
    globe.rotation.y += 0.001;
    renderer.render(scene,camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth/container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
}

drawGlobe();

