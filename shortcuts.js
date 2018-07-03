function n(node_id) {
	return d3.selectAll('g').filter(function(d) { return d.id == node_id });
}
function nd(node_id) {
	return n(node_id).data()[0];
}
function s(selector) {
	return d3.selectAll(selector);
}
