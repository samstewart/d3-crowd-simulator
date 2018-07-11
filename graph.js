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
	}).filter(function(d) { return 0 < d.length && d.length <= 3/2; })
}

function delete_node(node_data) {

	// get rid of actual node in the data
	var ds = d3.selectAll('g').data().filter(function(d) { return d.id != node_data.id });

	d3.selectAll('g')
	.data(ds, function(d) { return d.id; })
	.exit()
	.remove();
	
	compute_neighbors(ds);

	compute_shortest_path_distances(ds);
	
	d3.selectAll('text').text(function(d) { return d.id + ' - ' + d.distance; })

}

function euclidean_distance(p1, p2) {

	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));

}

function distance(node1, node2) {
	// return the Euclidean distance between two nodes
	return euclidean_distance(node1.p, node2.p);

}

function compute_neighbors(nodes) {

	var neighs = all_neighbors(nodes);

	// TODO: roll into transformation generating the neighbors. Generate all the data at once. 
	nodes.forEach(function(node, i) { node.neighbors = neighs[i] });
}

function euclidean_lattice_to_hex_lattice(p) {
	return [ 
		// grid of hexagonal numbers. mod is for alternating rows
		p[0] + .5 * (p[1] % 2), 
		Math.sqrt(3) / 2 * p[1] 
	];
}

function mesh_grid(n) {
	// make a list of grid points
	return d3.cross(d3.range(n), d3.range(n), (x,y) => [x,y]);
}
function make_graph(svg_width, svg_height, grid_n) {
	
	var spacing = svg_width / (grid_n + 1); 

	// TODO: the right representation is a grid (nested arrays of arrays) just like table example in d3 docs. easy to index.
	//
	// create a hex grid spaced 1 apart
	// make square 2d lattice
	// origin of canvas is upper left
	var standard_grid = mesh_grid(grid_n);

	var nodes = standard_grid.map( function(grid_point) { 	
				return {
					node_type: 'empty',
					distance: Infinity, // for shortest path calculations
					index: grid_point,  // row column
					p: euclidean_lattice_to_hex_lattice(grid_point),
					radius: spacing / 10,
					node_label:  function() { return `(${this.index.join(',')}): ${this.distance == Infinity ? '' : this.distance}` },
					offset_within_row: function() {
						// offset within a row 
						return `translate(${spacing / 2 + spacing * this.p[0]}, 0)`;
					}
				}

			});


	// compute_neighbors(nodes);
	// group into rows
	var rows_of_nodes = d3.nest().key(d => d.index[1]).entries(nodes).map(d => d.values);
	// allow each row to calculate it's layout
	rows_of_nodes = rows_of_nodes.map(function(d, i) {
		return {
			nodes_in_row: d,
			offset_for_row: function () {
				return `translate(0, ${ spacing / 2 + spacing * i} )`;
			}
		}
	});
	

	return rows_of_nodes; 
}
