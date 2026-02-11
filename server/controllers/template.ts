export const getHtml = function (title: string, description: string, img: any) {
    return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.32.1/apexcharts.min.js"
      integrity="sha512-JSsrXEHqMT7k/tJkCDX82lqxSmR0yRKQ7nPoxfiA2Xuga4EomTDmb6EtPNgLxpqe6cw+N0jj/mHb9uPXpBcidw=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js"></script>
    <script>
      

      const sortingDayPeakTime = function (dataPeakTime) {
        const days = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        const sorted = days
          .reverse()
          .map((day) => dataPeakTime.find((time) => time.name === day));
        return sorted;
      };

      

      
      
      const getSeries = (dataWidget) => {
        const details = dataWidget?.details;
        const responseType = dataWidget?.responseType.name;
        switch (responseType) {
          case 'chronological':
            if (details.chronological) {
              return buildDataLineGroup([details.chronological]);
            }
            return null;
          case 'chronologicalGroup':
            if (details.chronologicalGroup) {
              return buildDataLineGroup(details.chronologicalGroup);
            }
            return null;
          case 'numericWithGrow':
            return details.numericWithGrowth;
          case 'nameValue':
            return details.nameValue;
          case 'peaktime':
            const { max, min, peakTimeValue } = details.peakTime;
            const data = peakTimeValue ? sortingDayPeakTime(peakTimeValue) : [];
            return { data, max, min };
          case 'user':
            return details.user;
          case 'table':
            return details.table;
          default:
            return null;
        }
      };
      const generalOption = function(type, title) {
        return {
          chart: {
            type: type,
            animations: {
              enabled: false
            },
            width: '100%',
            height: 226,
            toolbar: {
              show: false
            },
          },
          title: {
            text: title,
            align: 'left'
          },
        }
      }
      const selectWidget = ({
        visualization,
        displayName,
        detail,
        metric
      }) => {
        const colorsComparisonHex = [
          '#3874CB',
          '#61B258',
          '#FACB00',
          '#C23F38',
          '#54B9D1',
          '#91218C',
          '#1F3E1A',
          '#1C4E80',
          '#00BFA5',
          '#009FE3',
          '#75140C',
          '#FFA600',
          '#D485B2',
          '#926531',
          '#5C9790',
          '#D7BFFA',
          '#AED581',
          '#7E909A',
          '#0B85AE',
          '#DB6917'
        ];

        switch (visualization) {
          case 'bubble':
            const dataSeries = getSeries(detail);
            const {max, min} = dataSeries;
            const colors = ['#58CCED', '#3895D3', '#1261A0', '#072F5F'];
            const names = ['low', 'medium', 'large', 'extreme'];
            const stepperValue = Math.round((max - min) / colors.length);
            const colorRange = colors.map((color, index) => ({
              from: index === 0 ? min : stepperValue * index + 1,
              to: index >= colors.length - 1 ? max : stepperValue * (index + 1),
              color: color,
              name: names[index]
            }));
            return({
              ...generalOption("heatmap", displayName),
            
              series: dataSeries.data,
              plotOptions: {
                heatmap: {
                  radius: 2,
                  enableShades: false,
                  shadeIntensity: 0.5,
                  reverseNegativeShade: true,
                  distributed: false,
                  colorScale: {
                    ranges: colorRange,
                    inverse: false
                  }
                }
              },
              colors: ['#0070b1'],
              legend: {
                show: false
              },
              dataLabels: {
                enabled: false
              },
              xaxis: {
                type: 'category',
                categories: [
                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                  20, 21, 22, 23
                ],
                tickAmount: 8,
                labels: {
                  rotate: 0
                }
              },
            });
          case 'line_chart':
            return ({
              ...generalOption("line", displayName),
              subtitle: {
                text: 'Number of comments or mentions to Social Profiles, Keywords, or Hashtags',
                margin: 0,
              },
              series: getSeries(detail),
              xaxis: {
                type: 'datetime'
              },
            });
          case 'pie':
            const dataPie = getSeries(detail);
            const series = dataPie.map((dt) => dt.value);
            const labelsPie = dataPie.map((dt) => dt.name);
            return ({
                ...generalOption(visualization, displayName),
                series: series,
                subtitle: {
                  text: 'A view or opinion towards objects',
                  margin: 16,
                  offsetY: 24
                },
                colors: metric === 'sentiment'
                  ? ['#00E396', '#008FFB', '#FF4560']
                  : colorsComparisonHex,
                labels: labelsPie,
                legend: {
                  show: true,
                  offsetY: 40
                }
              })
          case 'text':
            return createHtmlKeyMetric(displayName, getSeries(detail));
          case 'table':
            return createHtmlTable(displayName, getSeries(detail));
          case 'bar_chart':
            const data = getSeries(detail);
            if (detail.responseType.name === 'chronological' || detail.responseType.name === 'chronologicalGroup') {
                const values = data.map((dt) => ({
                  name: dt?.name,
                  data: dt?.data.map((d) => d[1].toFixed(3))
                }))[0].data;
              return ({
                ...generalOption("bar", displayName),
                series: data.map((dt) => ({
                  name: dt?.name,
                  data: dt?.data.map((d) => d[1])
                })),
                subtitle: {
                  text: 'Number of comments or mentions to Social Profiles, Keywords, or Hashtags',
                  margin: 0,
                },
                dataLabels: {
                  enabled: false
                },
                colors: metric === 'sentiment'
                  ? ['#00E396', '#008FFB', '#FF4560']
                  : colorsComparisonHex,
                xaxis: {
                  type: 'datetime',
                  categories: data[0]?.data.map((dt) => dt[0])
                },
                yaxis: {
                    min: Math.min(...values),
                    max: Math.max(...values),
                    tickAmount: 6,
                    labels: {
                    show: true,
                    formatter: (value) => {
                        if(value < 1) return value;
                        const formatValue = simplifyNumber(value === 5e-324 ? 0 : value.toFixed(3));
                        return formatValue;
                    },
                },
                }
              })
            }
            return ({
              ...generalOption("bar", displayName),
              series: [{
                data: data.map((dt) => dt.value)
              }],
              dataLabels: {
                enabled: false
              },
              subtitle: {
                  text: 'A view or opinion towards objects',
                  margin: 0,
                  },
              colors: metric === 'sentiment'
                  ? ['#00E396', '#008FFB', '#FF4560']
                  : colorsComparisonHex,
              legend: {
                show: true,
              },
              plotOptions: {
                bar: {
                  columnWidth: "50%",
                  distributed: true,
                  horizontal: false
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                categories: data.map((dt) => dt.name),
                labels: {
                  style: {
                    colors: metric === 'sentiment'
                  ? ['#00E396', '#008FFB', '#FF4560']
                  : colorsComparisonHex,
                    fontSize: '12px'
                  }
                }
              }
            })
          default:
            return ' < div / > ';
        }
      };
      const renderWidget = function async (id, widgets) {
        const option = selectWidget(widgets);
		console.log(option)
        var chart = new ApexCharts(document.querySelector('#'+id), option);
        chart.render();
      }
    </script>
    <style>
      body {
        width: 230mm;
        height: 100%;
        margin: 0 auto;
        padding: 0;
        font-size: 12pt;
        background: #FBFBFB;
      }

      * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
      }

      h1 {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 80px;
        line-height: 105%;
        text-transform: uppercase;
        color: rgb(5, 28, 38);
      }

      h2 {
        margin: 0px;
        font-size: 24px;
        line-height: 130%;
        font-family: "Red Hat Display";
        font-style: normal;
        color: rgb(5, 28, 38);
        font-weight: 700;
      }

      h5 {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 17.4886px;
        line-height: 25px;
        letter-spacing: -0.01em;
        color: rgb(5, 28, 38);
      }

      table {
        border-collapse: collapse;
        border: 1px solid #bdbdbd;
        table-layout: auto;
        width: 100%;
      }

      th,
      td {
        border: 1px solid #bdbdbd;
        text-align: center;
        padding: 8px;
      }

      th {
        background: #0A789D;
        color: #FBFBFB;
        padding: 8px;
      }

      caption {
        color: #051C26;
        font-family: helvetica;
        font-weight: 600;
        text-align: left;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .logo-container {
        position: absolute;
      }

      .logo {
        height: 42px;
        width: auto;
      }

      .main-page {
        width: 210mm;
        min-height: 297mm;
        margin: 10mm auto;
        background: white;
        box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
      }

      .sub-page {
        padding: 1cm;
        height: 297mm;
      }

      .cover-image {
        background-image: url("https://v5.dashboard.nolimit.id/static/media/cover_custom_report_1.png") !important;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .cover-page {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

      }

      .cover-footer {
        background: #E7F3F7;
        position: relative;
        left: 0;
        bottom: 0;
        padding: 12px;
        width: 100%;
        text-align: center;
      }

      .copy-right {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        line-height: 120%;
        letter-spacing: 0.02em;
        color: #0B85AE;
      }

      .object-card {
        background: #E7F3F7;
        border-radius: 8px;
        padding: 4px;
        display: flex;
        flex-direction: row;
        width: fit-content;
      }

      .center {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .card-key-metric {
        color: rgb(5, 28, 38);
        transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        box-shadow: rgb(159 162 191 / 18%) 0px 2px 3px, rgb(159 162 191 / 32%) 0px 1px 1px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), linear-gradient(90deg, rgb(221, 245, 255) 0%, rgb(193, 254, 250) 50.65%, rgb(193, 236, 254) 100%);
        border: 1px solid rgba(157, 157, 156, 0.16);
        box-sizing: border-box;
        border-radius: 16px;
        padding: 16px;
        width: 100%;
      }

      .card-key-metric-footer {
        display: flex;
        justify-content: flex-end;
      }

      .title-key-metric {
        font-size: 16px;
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: 300;
        line-height: 15px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: rgb(5, 28, 38);
      }

      .object-name {
        color: #0A789D;
      }

      .header-content {
        padding: 16px;
      }

      .content {
        padding: 16px;
      }

      .footer-content {
        background: #F5F5F6;
        position: relative;
        left: 0;
        bottom: 0;
        padding: 12px;
        width: 100%;
        text-align: center;
      }

      .page-label {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        line-height: 120%;
        letter-spacing: 0.02em;
        color: #4B4B4B;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 8px;
        row-gap: 8px;
        margin-bottom: 8px;
      }

      .grid-container > div{
        background-color: rgb(255, 255, 255);
        color: rgb(5, 28, 38);
        transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        border: 1px solid #ECEEF6;
        width: 600px;
        height:200px;
        border-radius: 8px;
      }

      .grid-item-2 {
        grid-column: auto / span 1;
      }

      .grid-item-4 {
        grid-column: auto / span 2;
      }

      .numerical-container {
        padding: 4px 8px;
      }
      
      .numerical-title {
        font-family: Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 900;
        font-size: 14px;
        line-height: 130%;
        color: '#051C26';
      }

      .numerical-subtitle {
        font-family: Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 130%;
        color: '#051C26';
      }

      .numerical-value {
        font-family: Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 32px;
        line-height: 34px;
        letter-spacing: 0.01em;
        color: #232323;
      }

      .numerical-tablet {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 3px 4px;
        gap: 3px;
        width: 64px;
        height: 23px;
        border-radius: 50px;
      }

      .numerical-growth {
        font-family: Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 17px;
        letter-spacing: 0.01em;

      }

      .numerical-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .numerical-footer {
        font-family: Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.01em;
      }

      @page {
        size: A4;
        margin: 0;
        width: 21cm;
        height: 29.7cm;
      }

      @media print {

        html,
        body {
          width: 210mm;
          height: 297mm;
        }

        .main-page {
          margin: 0;
          border: initial;
          border-radius: initial;
          width: initial;
          min-height: initial;
          box-shadow: initial;
          background: initial;
          page-break-after: always;
          position: relative;
        }

        .footer-content,
        .cover-footer {
          position: absolute !important;
        }
      }
    </style>
  </head>
  <body>
    
        <div class="content">
          <div class="grid-container">
            <div class="grid-item-4" id="widget-41a202d7-8d4e-11ec-819c-02420a00002a"></div>
           
          </div>
        </div>
      
    

    <script>
      renderWidget("widget-41a202d7-8d4e-11ec-819c-02420a00002a", {
        "id" : "widget-41a202d7-8d4e-11ec-819c-02420a00002a",
        "metric" : "peaktime",
        "displayName" : "",
        "description" : null,
        "size" : 4,
        "title" : "The specific day and hour when the followers do some interactions with the posts",
        "visualization" : "bubble",
        "detail": {
          "responseType": {
            "name": "peaktime"
          },
          "details" : {
            "chronologicalGroup" : null,
            "chronological" : null,
            "nameValue" : null,
            "table" : null,
            "numericWithGrowth" : null,
            "user" : null,
            "peakTime" : {
              "peakTimeValue" : [ {
                "name" : "wednesday",
                "data" : [ 2, 3, 2, 1, 0, 0, 2, 4, 8, 6, 1, 0, 2, 0, 1, 3, 0, 0, 1, 2, 0, 2, 0, 1 ]
              }, {
                "name" : "monday",
                "data" : [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 2, 0, 1, 0, 1 ]
              }, {
                "name" : "saturday",
                "data" : [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
              }, {
                "name" : "thursday",
                "data" : [ 1, 5, 0, 0, 2, 3, 9, 16, 4, 18, 21, 5, 14, 10, 16, 9, 14, 13, 11, 0, 1, 0, 0, 2 ]
              }, {
                "name" : "tuesday",
                "data" : [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0 ]
              }, {
                "name" : "friday",
                "data" : [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 5, 2, 2, 2, 0, 0, 2, 0, 0, 0 ]
              }, {
                "name" : "sunday",
                "data" : [ 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 3, 0, 0, 1, 0, 0, 0, 4, 0 ]
              } ],
              "max" : 21,
              "min" : 0
            }
          },
        }
      });
    
    </script>
  </body>
</html>`;
};
