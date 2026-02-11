
const defaultColors = [
    '#3874CB',
    '#61B258',
    '#FACB00',
    '#C23F38',
    '#54B9D1',
    '#91218C',
    '#1F3E1A',
    '#009FE3',
    '#1C4E80',
    '#00BFA5',
    '#75140C',
    '#FFA600',
    '#D485B2',
    '#926531',
    '#5C9790',
    '#D7BFFA',
    '#AED581',
    '#7E909A',
    '#0B85AE',
    '#DB6917',
];

export const getHtml = function (data: any[], colorList: string[] = defaultColors) {
    const colors = (colorList && colorList.length > 0) ? colorList : defaultColors;
    return String.raw`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.32.1/apexcharts.min.js"
  integrity="sha512-JSsrXEHqMT7k/tJkCDX82lqxSmR0yRKQ7nPoxfiA2Xuga4EomTDmb6EtPNgLxpqe6cw+N0jj/mHb9uPXpBcidw=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
<title>Document</title>
</head>
<body>
<div class="flex flex-col items-center w-[1160px] h-[520px] ml-[-140px]">
<div id="topTalk" class="mb-[-28px]">Talk</div>
<div class="flex items-center">
<div class="w-20">Negative -100%</div>
<div id="chart" class="w-[1000px] ml-[-22px]"></div>
<div class="w-20 ml-[-275px]">Positive +100%</div>
</div>
<div class="mt-[-20px]">0 Talk</div>
<div id="error-log" style="color:red; font-weight:bold; padding:20px; position:absolute; top:0; left:0; z-index:9999; background:rgba(255,255,255,0.9);"></div>
</div>
</body>
<script>
window.onerror = function(msg, url, line, col, error) {
  const div = document.getElementById('error-log');
  if(div) div.innerHTML += '<p>Error: ' + msg + ' <br> Line: ' + line + ' Col: ' + col + ' <br> ' + (error && error.stack ? error.stack : '') + '</p>';
};

function separateNumberFormat(num) {
if (Number.isInteger(num)) {
  return parseFloat(num.toFixed(2))?.toLocaleString("id-Id");
} else {
  return num?.toLocaleString("id-Id");
}
}

const colors = ${JSON.stringify(colors)}
const data = ${JSON.stringify(data)}

const dataSeries = data.map((res) => ({
name: res.name,
data: [[res?.positivity, res?.popularity]],
}));

  let topTalkNum = Math.max(...data.map((brand) => brand.popularity));

  if (!isFinite(topTalkNum) || topTalkNum <= 0) {
    topTalkNum = 100; // Default fallback to prevent infinite loop
  }

  while (topTalkNum % 8 != 0 || topTalkNum % 10 != 0) {
    topTalkNum++;
  }

const options = {
series: dataSeries,
colors: colors,
chart: {
  animations: {
    enabled: false,
  },
  width: '1080px',
  height: '500px',
  toolbar: {
    show: false,
  },
},
annotations: {
  xaxis: [
    {
      x: -0.1,
      x2: 0.1,
      borderColor: "#000000",
      fillColor: "#000000",
      strokeDashArray: 0,
      opacity: 1,
    },
  ],
},
xaxis: {
  tickAmount: 10,
  min: -102,
  max: 102,
  axisBorder: {
    show: true,
    height: 2,
    color: "#000000",
    offsetY: -230,
  },
  labels: {
    show: false,
  },
},
yaxis: {
  tickAmount: 8,
  show: true,
  min: 0,
  max: topTalkNum,
  labels: {
    show: false,
  },
},
grid: {
  xaxis: {
    lines: {
      show: true,
    },
  },
  yaxis: {
    lines: {
      show: true,
    },
  },
},
markers: {
  size: 10,
},
legend: {
  show: true,
  width: 340,
  position: "right",
  formatter: function (
    seriesName,
    { series, seriesIndex, dataPointIndex, w }
  ) {
    return (
      seriesName +
      " (" +
      w.config.series[seriesIndex].data[0][0].toFixed(2) +
      "%, " +
      separateNumberFormat(w.config.series[seriesIndex].data[0][1]) +
      ")"
    );
  },
  offsetX: -80,
},
};
try {
  const chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render().catch(err => {
     document.getElementById('error-log').innerHTML += '<p>Render Error: ' + err.message + '</p>';
  });
} catch(err) {
  document.getElementById('error-log').innerHTML += '<p>Init Error: ' + err.message + '</p>';
}

document.querySelector("#topTalk").innerHTML = separateNumberFormat(
topTalkNum
)+ " Talk";
</script>
<style>
*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.absolute{position:absolute}.relative{position:relative}.-bottom-\[2px\]{bottom:-2px}.-right-\[2px\]{right:-2px}.z-10{z-index:10}.m-5{margin:1.25rem}.mx-4{margin-left:1rem;margin-right:1rem}.mx-auto{margin-left:auto;margin-right:auto}.my-\[4px\]{margin-top:4px;margin-bottom:4px}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-\[-28px\]{margin-bottom:-28px}.ml-\[-140px\]{margin-left:-140px}.ml-\[-22px\]{margin-left:-22px}.ml-\[-275px\]{margin-left:-275px}.mr-\[-22px\]{margin-right:-22px}.mt-4{margin-top:1rem}.mt-\[-20px\]{margin-top:-20px}.flex{display:flex}.grid{display:grid}.aspect-square{aspect-ratio:1 / 1}.h-20{height:5rem}.h-\[118px\]{height:118px}.h-\[210px\]{height:210px}.h-\[520px\]{height:520px}.h-\[84px\]{height:84px}.w-12{width:3rem}.w-20{width:5rem}.w-\[1000px\]{width:1000px}.w-\[1160px\]{width:1160px}.w-\[450px\]{width:450px}.w-\[600px\]{width:600px}.w-\[70px\]{width:70px}.grow{flex-grow:1}.basis-1\/2{flex-basis:50%}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-7{gap:1.75rem}.overflow-hidden{overflow:hidden}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.border{border-width:1px}.border-l-2{border-left-width:2px}.border-\[\#2098E7\]{--tw-border-opacity: 1;border-color:rgb(32 152 231 / var(--tw-border-opacity))}.border-\[\#4267B2\]{--tw-border-opacity: 1;border-color:rgb(66 103 178 / var(--tw-border-opacity))}.border-\[\#833AB4\]{--tw-border-opacity: 1;border-color:rgb(131 58 180 / var(--tw-border-opacity))}.border-\[\#FF0000\]{--tw-border-opacity: 1;border-color:rgb(255 0 0 / var(--tw-border-opacity))}.border-black{--tw-border-opacity: 1;border-color:rgb(0 0 0 / var(--tw-border-opacity))}.border-slate-200{--tw-border-opacity: 1;border-color:rgb(226 232 240 / var(--tw-border-opacity))}.border-slate-300{--tw-border-opacity: 1;border-color:rgb(203 213 225 / var(--tw-border-opacity))}.bg-\[\#2098E7\]{--tw-bg-opacity: 1;background-color:rgb(32 152 231 / var(--tw-bg-opacity))}.bg-\[\#4267B2\]{--tw-bg-opacity: 1;background-color:rgb(66 103 178 / var(--tw-bg-opacity))}.bg-\[\#833AB4\]{--tw-bg-opacity: 1;background-color:rgb(131 58 180 / var(--tw-bg-opacity))}.bg-\[\#E7F3F7\]{--tw-bg-opacity: 1;background-color:rgb(231 243 247 / var(--tw-bg-opacity))}.bg-\[\#FF0000\]{--tw-bg-opacity: 1;background-color:rgb(255 0 0 / var(--tw-bg-opacity))}.bg-black{--tw-bg-opacity: 1;background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.bg-blue-400{--tw-bg-opacity: 1;background-color:rgb(96 165 250 / var(--tw-bg-opacity))}.bg-green-400{--tw-bg-opacity: 1;background-color:rgb(74 222 128 / var(--tw-bg-opacity))}.bg-red-400{--tw-bg-opacity: 1;background-color:rgb(248 113 113 / var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-yellow-400{--tw-bg-opacity: 1;background-color:rgb(250 204 21 / var(--tw-bg-opacity))}.bg-cover{background-size:cover}.object-cover{-o-object-fit:cover;object-fit:cover}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-\[0\.3em\]{padding:.3em}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.text-left{text-align:left}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-\[12px\]{font-size:12px}.text-\[20px\]{font-size:20px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.text-\[\#4B4B4B\]{--tw-text-opacity: 1;color:rgb(75 75 75 / var(--tw-text-opacity))}.text-\[\#535353\]{--tw-text-opacity: 1;color:rgb(83 83 83 / var(--tw-text-opacity))}.line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}.line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.line-clamp-4{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4}
</style>
</html>

`;
};
