let map = new L.Map("mapid", {center: [49.2527, -123.1207], zoom: 11.5})
.addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

function projectPoint(x, y) {
let point = map.latLngToLayerPoint(new L.LatLng(y, x));
console.log(this);
this.stream.point(point.x, point.y);
} 

let transform = d3.geoTransform({point: projectPoint});
let path = d3.geoPath().projection(transform);

d3.json("VancouverAreaSize.json", function(error, uk) {
// var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
// svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");

let svg = d3.select(map.getPanes().overlayPane).append("svg");
// let svg = d3.select("#abc").append("svg");

let g = svg.append("g").attr("class", "leaflet-zoom-hide");

let feature = g.selectAll( "path" )
.data( uk.features )
.enter()
.append( "path" )
.attr( "fill", "#000" )
.attr('fill-opacity', 0.1)
.attr( "stroke", "#333")
.attr("stroke-width", "3px")
.attr("d", path)

function reset() {
let bounds = path.bounds(uk),
topLeft = bounds[0],
bottomRight = bounds[1];

svg.attr("width", bottomRight[0] - topLeft[0])
.attr("height", bottomRight[1] - topLeft[1])
.style("left", topLeft[0] + "px")
.style("top", topLeft[1] + "px");

g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

feature.attr("d", path);
}
map.on("zoom", reset);

reset();
});