function nodes_in_range(id_range) {
	// pass in array of node ids
  return d3.selectAll('g').filter(function(d) { return id_range.includes(d.id); });
}
// Article idea: the power of *seeing* your data structures while debugging. Avoids effort of
// having to build a mental model. Lets you manipulate them physically. Downside is bad metaphors like 'Desktop'
// TODO: move into own namespace
function all_neighbors(node_data, spacing) {
	// return [ [neighbors for node at index 0], [neighbors for node at index 1], etc]
	return d3.nest()
		.key(d => d.src.id)
		.rollup(values => values.map(v => v.dst))
		.entries(all_edges(node_data, spacing))
		.map(p => p.value)
}


function all_edges(node_data, spacing) {
	// returns edges connecting nodes given by node_data.
	// first do cross product for all pairings of edges, then filter down to edges between nodes that are next to each other.
	// we multiply by 3/2 to avoid floating point comparison errors.
	return d3.cross(node_data, node_data, function(n1, n2) {
		return {
				src: n1,
				dst: n2,
				length: distance(n1, n2)
			}
	}).filter(function(d) { return 0 < d.length && d.length <= 3/2 * spacing; })
}

function delete_node(node) {
	var node_data = node.datum();

	node_data.neighbors.forEach(n => {

		n.delete_neighbor(node_data); // delete incoming edges in the model
		
	});

	// get rid of actual node in the data
	var ds = d3.selectAll('g').data().filter(function(d) { return d.id != node_data.id });

	// rebind
	d3.selectAll('g')
	.data(ds, function(d) { return d.id; })
	.exit()
	.remove();

	// recompute shorest paths
	compute_shortest_path_distances(ds);
	
	d3.selectAll('text').text(function(d) { return d.id + ' - ' + d.distance; })

}

function distance(node1, node2) {
	// return the Euclidean distance between two nodes
	return Math.sqrt(Math.pow(node1.cx - node2.cx, 2) + Math.pow(node1.cy - node2.cy, 2));

}


function load_graph(fname, callback) {
	var type_names = ["empty", "exit", "guy", "obstacle",  "seed", "soft_obstacle"];
	var data = [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	data[12] = 3;
	data[2] = 3;
	// bind the data to the svg line elements. (create if necc)

	var	grid_width = 5; // get from json data
	var	grid_height = 5; // get from json data
	
	var spacing = 800 / (grid_width + 1); 
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
					cx: spacing / 2 + spacing * (x + .5 * (y % 2)),
					cy: spacing / 2 + spacing * (Math.sqrt(3) / 2 * y),
					delete_neighbor: function(neigh) {
						this.neighbors = this.neighbors.filter(function(n) { return n.id != neigh.id; });
					}
				});

			}

			dataIndex++;
		}
	}

	var neighs = all_neighbors(nodes, spacing);

	// TODO: roll into transformation generating the neighbors. Generate all the data at once. 
	nodes.forEach(function(node, i) { node.neighbors = neighs[i] });

	// compute_shortest_path_distances(nodes);

	callback(nodes, grid_width, grid_height, spacing);
}
