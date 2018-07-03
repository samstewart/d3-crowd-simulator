
function move_guy(node_data) {
	var new_guy = minNode(node_data, minNeighbor(node_data));  // we could stay put

	if (new_guy.node_type != 'guy') {

		node_data.node_type = 'empty';

		if (new_guy.node_type != 'exit') {
			// if it's an exit, make this guy disappear
			new_guy.node_type = 'guy';

		}
	}
	
	return new_guy;
}

function move_guy_to_exit(node_data) {
	
	var t0 = d3.interval(function(elapsed) {

		if (node_data.node_type == 'exit') {

			t0.stop();

		} else {
			
			node_data = move_guy(node_data);

			d3.selectAll('g circle').attr('fill', function(d) { return node_colors[d.node_type]; });
			d3.selectAll('g circle').attr('r', function(d) { return node_sizes[d.node_type]; });
		}

	}, 1000);


}
function update_node_colors() {
	d3.selectAll('g circle').transition().duration(1000).ease('linear').attr('fill', function(d) { return node_colors[d.node_type]; });
}


