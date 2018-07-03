function highlight_nodes(nodes) {

	// animate to highlighted color
	nodes.select('circle').transition().duration(1000).ease('linear').attr('fill', node_colors['highlighted']);
}

function unhighlight_nodes(nodes) {
	// animate to unhighlighted color
	nodes.select('circle').transition().duration(1000).ease('linear').attr('fill', function(d) { return node_colors[d.node_type]; });
}
