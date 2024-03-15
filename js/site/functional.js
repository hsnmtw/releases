var head = function(l){ return l[0]; };
var tail = function(l){ return l.slice(1); };

var unique = function(l,seen){
    if(typeof seen === 'undefined') seen = [];
	return l.length === 0 ? seen : unique(tail(l), seen.indexOf(head(l)) > -1 ? seen : seen.concat([head(l)]));
}