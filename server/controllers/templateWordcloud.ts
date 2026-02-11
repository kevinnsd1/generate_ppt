/**
 * @typedef {Object} NameValue
 * @property {string} name - The name.
 * @property {number} value - The value.
 */

interface NameValue {
    name: string;
    value: number;
}

/**
 * Render wordcloud from name-value data.
 * @param {NameValue[]} data - The array of NameValue objects.
 * @returns {string} The HTML as string.
 */
export const getHtml = function (data: NameValue[]) {
    const html = String.raw`
<!DOCTYPE html>
<meta charset="utf-8" />
<style>
  body {
    margin: 0;
  }
</style>
<body>
  <div id="container"></div>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/jasondavies/d3-cloud/build/d3.layout.cloud.js"></script>
  <script>
    (function () {
      const data = ${JSON.stringify(data)};

      const width = 500;
      const height = 300;
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      const minFontSize = 10;
      const maxFontSize = 60; // Reduced from 85 to make it "smaller"
      const maxWord = 100; 

      const svg = d3
        .select("#container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // get text color
      const fill = d3.scaleOrdinal(
        ["#58CCED", "#3895D3", "#1261A0", "#072F5F"].reverse()
      );

      // filter only top 50 highest word value
      data.sort((a, b) => b.value - a.value);
      const top50Words = data.slice(0, maxWord - 1);

      const dataValues = top50Words.map((word) => word.value);
      const maxValue = Math.max(...dataValues);
      const minValue = Math.min(...dataValues);

      // get text font size
      const fontSizeScale = d3
        .scaleLinear()
        .domain([minValue, maxValue])
        .range([minFontSize, maxFontSize]);

      const words = top50Words.map((d) => {
        return { text: d.name, size: fontSizeScale(d.value) };
      });

      // wordcloud config
      const layout = d3.layout
        .cloud()
        .size([width, height])
        .words(words)
        .padding(0) // Reduced padding for "stacked" look
        .spiral(function(size) {
            var e = size[0] / size[1]; 
            return function(t) {
                // Determine the "radius" or distance from center based on t
                // We use a smaller step (0.05 instead of 0.1) to make the spiral tighter
                // This forces the algorithm to check more positions closer to the center = denser packing
                 return [(e*1.2) * (t *= .05) * Math.cos(t), t * Math.sin(t)];
            };
        })
        .rotate(0)
        .font("Arial") // Changed from "Impact" to "Arial" for better server compatibility (Linux)
        .fontSize((d) => d.size)
        .on("end", draw)
        .text((d) => d.text);

      layout.start();

      // Draw svg. Do not modify this
      function draw(words) {
        svg
          .append("g")
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")"
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", (d) => d.size)
          .style("fill", (d, i) => fill(i))
          .attr("text-anchor", "middle")
          .style("font-family", (d) => d.font)
          .attr(
            "transform",
            (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"
          )
          .text((d) => d.text);
      }
    })();
  </script>
</body>
`;
    return html;
};
