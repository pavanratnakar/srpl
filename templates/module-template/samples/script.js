// NO OTHER MODULES allowed to be loaded, unless necessary for demo purpose
YUI().use('<%=module%>',function(Y){	

	var <%=module%> = new Y.<%=namespace%>.<%=MODULE%>.View({
		container:'#container'
	});
	
});