function nodes_in_range(id_range) {
	// pass in array of node ids
  return d3.selectAll('g').filter(function(d) { return id_range.includes(d.id); });
}
// Article idea: the power of *seeing* your data structures while debugging. Avoids effort of
// having to build a mental model. Lets you manipulate them physically. Downside is bad metaphors like 'Desktop'
// TODO: move into own namespace
function all_neighbors(node_data) {
	// return [ [neighbors for node at index 0], [neighbors for node at index 1], etc]
	return d3.nest()
	.key(function(d) { return d.src.id; })
	.entries(all_edges(node_data))
	.map(function(entry) { return entry.values; })
}


function all_edges(node_data) {
	// returns edges connecting nodes given by node_data.
	// first do cross product for all pairings of edges, then filter down to edges between nodes that are next to each other.
	// we multiply by 3/2 to avoid floating point comparison errors.
	return d3.cross(node_data, node_data, function(n1, n2) {
		return {
				src: n1,
				dst: n2,
				length: distance(n1, n2)
			}
	}).filter(function(d) { return 0 < d.length && d.length <= 3/2 * radius; })
}

function distance(node1, node2) {
	// return the Euclidean distance between two nodes
	return Math.sqrt(Math.pow(node1.cx - node2.cx, 2) + Math.pow(node1.cy - node2.cy, 2));

}

// Q: for display properties derived from the model, is it better to update the underlying model or the display?
function euclidean_neighbors(node) {
	// look for anything within a ball of radius 3/2.
	// we have a factor of 3/2 to make radius just a bit bigger to avoid floating point error
	return d3.selectAll('svg g').filter(function(neigh) { return 0 < distance(neigh, d) && distance(neigh, d) <= 3/2 * radius; } );
}

function load_graph(fname, callback) {
	var type_names = ["empty", "exit", "guy", "obstacle",  "seed", "soft_obstacle"];
	var data = [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	data[12] = 3;
	// bind the data to the svg line elements. (create if necc)

	var	grid_width = 5; // get from json data
	var	grid_height = 5; // get from json data

	var nodes = [];
	var dataIndex = 0; // index for getting node type from the JSON array

	for (var y = 0; y < grid_height; y++) {

		for (var x = 0; x < grid_width; x++) {
			var node_type = type_names[data[dataIndex] - 1]; // convert numerical code to text

			if (node_type != "obstacle") {
				nodes.push({
					node_type: node_type,
					id: dataIndex,
					distance: node_type == "exit" ? 0 : Infinity, // for shortest path calculations
					cx: radius * (x + .5 * (y % 2)),
					cy: radius * (Math.sqrt(3) / 2 * y)
				});

			}

			dataIndex++;
		}
	}

	var neighs = all_neighbors(nodes);

	// TODO: roll into transformation generating the neighbors. Generate all the data at once. 
	nodes.forEach(function(node, i) { node.outgoing_edges = neighs[i] });

	compute_shortest_path_distances(nodes);

	callback(nodes)
}
