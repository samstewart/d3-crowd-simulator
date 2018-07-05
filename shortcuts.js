function n(node_descriptor) {
	var ids = null;
	
	// range of IDs
	if (node_descriptor.match(/-/)) {
		ids = node_descriptor.match(/\d+/g).map(Number);	
		ids = d3.range(ids[0], ids[1] + 1);
	}
	
	// list of ids
	if (node_descriptor.match(/,/)) {
		ids = node_descriptor.match(/\d+/g).map(Number);	
	}
	
	// all the nodes
	if (node_descriptor == '*') {
		return d3.selectAll('g');
	}

	// a random choice of nodes within a range
	// syntax is: 2r1-5 where first number is percentage of range 
	if (node_descriptor.match(/r/)) {
		ids = node_descriptor.match(/\d+/g).map(Number);	
		var subset = ids[0];
		ids = d3.range(ids[1], ids[2] + 1);

		ids = chance.pickset(ids, Math.round(ids.length * subset / 100));
	}
	return d3.selectAll('g').filter(function(d) { return ids.includes(d.id); });
}

function nd(node_id) {
	return n(node_id).data();
}
function s(selector) {
	return d3.selectAll(selector);
}
