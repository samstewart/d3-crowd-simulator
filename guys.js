

function move_guy_to_exit(node_data) {
	var new_guy = minNode(node_data, minNeighbor(node_data));  // we could stay put

	if (new_guy.node_type != 'guy' || new_guy.distance == 0) { // if we're moving to an exit, it's ok that there's a pile of guys 

		node_data.node_type = 'empty';
		new_guy.node_type = 'guy'; // this will turn an exit into a guy, but not a problem since we're just following the gradient field
		
	}
	
	d3.selectAll('g circle').attr('class', (d) => { return d.node_type; });
}

function has_guys_away_from_exit() {

	return ! d3.selectAll('.guy').filter((d) => { return d.distance > 0; }).empty();

}


function move_guys_to_exit() {
	
	var last_state = d3.selectAll('g').data().map(d => d.node_type);

	if (has_guys_away_from_exit()) {

		d3.selectAll('g circle.guy').each(move_guy_to_exit);

	} 

	return last_state;
}

