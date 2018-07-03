function move_guy(node_data) {

	if (minNeighbor(node_data).node_type == 'empty') {

		node_data.node_type = 'empty';
		minNeighbor(node_data).node_type = 'guy';

	}
}
