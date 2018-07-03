
function move_guy_to_exit(node_data) {
	var new_guy = minNode(node_data, minNeighbor(node_data));  // we could stay put

	if (new_guy.node_type != 'guy') {

		node_data.node_type = 'empty';

		if (new_guy.node_type != 'exit') {
			// if it's an exit, make this guy disappear
			new_guy.node_type = 'guy';
			
		}
	}
	
	d3.selectAll('g circle').attr('class', function(d) { return d.node_type; });
}

function has_guys() {

	return ! d3.selectAll('.guy').empty();

}

function move_guys_to_exit() {
	
	var t0 = d3.interval(function(elapsed) {

		if (has_guys()) {
				
			d3.selectAll('g circle.guy').each(move_guy_to_exit);

		} else {
			t0.stop();
		}

	}, 1000);


}

