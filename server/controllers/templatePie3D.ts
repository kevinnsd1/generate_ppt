
const defaultColors = [
    '#21BF73', // Positive
    '#FD5E53', // Negative
    '#1DA1F2', // Neutral
];

export const getHtml = function (data: any[], colorList: string[] = defaultColors) {
    const colors = (colorList && colorList.length > 0 ? colorList : defaultColors).map(c => c.startsWith('#') ? c : '#' + c);
    const chartData = data.map(item => [item.name, item.value]);

    return String.raw`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>3D Pie Chart</title>
<style>
  body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: white; }
  #container { width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="container"></div>

<script>
window.onerror = function(msg, url, line, col, error) {
  document.body.innerHTML += '<div style="color:red; font-size:12px; font-family:Arial; background:white; padding:5px; position:absolute; top:0; left:0; z-index:1001;">Global Error: ' + msg + '</div>';
};

const scriptsToLoad = [
  'https://cdnjs.cloudflare.com/ajax/libs/highcharts/10.3.3/highcharts.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highcharts/10.3.3/highcharts-3d.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highcharts/10.3.3/modules/exporting.js'
];

let loadedCount = 0;

function onScriptError(e) {
  document.body.innerHTML += '<div style="color:red; font-size:12px; font-family:Arial; background:white; padding:5px; position:absolute; top:30px; left:0; z-index:1001;">Script Failed: ' + e.target.src + '</div>';
}

function onScriptLoad() {
  loadedCount++;
  if (loadedCount === scriptsToLoad.length) {
    renderChart();
  }
}

function renderChart() {
  if (typeof Highcharts === 'undefined') {
     document.body.innerHTML += '<div style="color:red; font-size:12px; font-family:Arial; background:white; padding:5px; position:absolute; top:60px; left:0; z-index:1001;">Highcharts still undefined after loading scripts.</div>';
     return;
  }
  try {
    Highcharts.setOptions({ lang: { thousandsSep: '.' } });
    Highcharts.chart('container', {
      chart: { type: 'pie', options3d: { enabled: true, alpha: 45, beta: 0 }, backgroundColor: '#ffffff' },
      title: { text: '' },
      credits: { enabled: false },
      colors: ${JSON.stringify(colors)},
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              borderColor: null,
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                  distance: 15,
                  style: { fontSize: '11px', fontFamily: 'Arial', color: '#333', textOutline: 'none' }
              }
          }
      },
      series: [{ type: 'pie', name: 'Share', data: ${JSON.stringify(chartData)} }]
    });
  } catch (e) {
    document.body.innerHTML += '<div style="color:red; font-size:12px; font-family:Arial; background:white; padding:5px; position:absolute; top:90px; left:0; z-index:1001;">Init Error: ' + e.message + '</div>';
  }
}

scriptsToLoad.forEach(src => {
  const s = document.createElement('script');
  s.src = src;
  s.async = false;
  s.onload = onScriptLoad;
  s.onerror = onScriptError;
  document.head.appendChild(s);
});
</script>
</body>
</html>
`;
};
