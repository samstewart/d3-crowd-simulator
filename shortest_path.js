function has_unexplored_nodes(node_data) {

	return node_data.filter(function(d) { return d.distance == Infinity; }).length > 0;

}

function minNode(n1, n2) {
	// important for folding that we break ties with n2 
	return n2.distance <= n1.distance ? n2 : n1; 

}

function neighs(node_data) {
	return node_data.outgoing_edges.map(function(d) { return d.dst });
}

function minNeighbor(node_data) {
	// find neighbor with shortest distance to exit
	return neighs(node_data).reduceRight(minNode, { distance: Infinity }); // a little nervous that the sentinal value is not of same type. Neighbors can never be empty?
}
function distances_to_neighbors(node_data) {
	return node_data.outgoing_edges.map(function(edge) { return edge.dst.distance + 1; })
}

function compute_shortest_path_distances(node_data) { 
	// for each node, compute the shortest path distance to the exit
	// TODO: instead of hard coding the neighbors into the data structure, continue to use
	// d3.nest with rollup function that gives minimal distance. 
	// Currently we are just doing more verbose folds.
	while (has_unexplored_nodes(node_data)) {
		node_data.forEach(function(d, i) { 
			d.distance = Math.min(d.distance, minNeighbor(d).distance + 1); 
		});
	}
}


