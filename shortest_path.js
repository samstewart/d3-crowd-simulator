function has_unexplored_nodes(node_data) {
	// ignore isolated nodes
	return node_data.filter(function(d) { return d.distance == Infinity && legal_neighbors(d).length > 0; }).length > 0;

}

function legal_neighbors(d) {
	return d.neighbors.filter(n => n.node_type != 'deleted');
}

function minNode(n1, n2) {
	// important for folding that we break ties with n2 
	return n2.distance <= n1.distance ? n2 : n1; 

}

function minNeighbor(node_data) {
	// find neighbor with shortest distance to exit
	return legal_neighbors(node_data).reduceRight(minNode, { distance: Infinity }); // a little nervous that the sentinal value is not of same type. Neighbors can never be empty?
}

function exit_not_set(node_data) {
	return node_data.filter(d => d.distance == 0).length == 0;
}

function compute_shortest_path_distances(node_data) { 

	if (exit_not_set(node_data)) {
		console.log('set an exit!');
		return;
	}

	node_data.forEach(d => d.distance = d.distance == 0 ? 0 : Infinity);

	// for each node, compute the shortest path distance to the exit
	// TODO: instead of hard coding the neighbors into the data structure, continue to use
	// d3.nest with rollup function that gives minimal distance. 
	// Currently we are just doing more verbose folds.
	while (has_unexplored_nodes(node_data)) {
		node_data.forEach(function(d) { 
			d.distance = Math.min(d.distance, minNeighbor(d).distance + 1); 
		});
	}
}


