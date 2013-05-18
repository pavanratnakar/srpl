YUI.add('<%=module%>-model-list', function(Y){

    var defaults = {
        
    };

    var <%=MODULE%>ModelList = function(){
        <%=MODULE%>ModelList.superclass.constructor.apply(this, arguments);
    };

    Y.extend(<%=MODULE%>ModelList, Y.ModelList, {
    	initializer: function(models){

    	},
    	destructor: function(){

    	},
        query:function(query, callback){
            // callback(err, data)
        }
    });

	Y.namespace('<%=namespace%>.<%=MODULE%>');
    Y.<%=namespace%>.<%=MODULE%>.ModelList = <%=MODULE%>ModelList;

}, '@VERSION@',{
    requires:['model-list', '<%=module%>-model']
});