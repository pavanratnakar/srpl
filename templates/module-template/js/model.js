YUI.add('<%=module%>-model', function(Y){

    var defaults = {
        
    };
    
    var <%=MODULE%>Model = function(){
        <%=MODULE%>Model.superclass.constructor.apply(this, arguments);
    };

    Y.extend(<%=MODULE%>Model, Y.Model, {
    	initializer:function(attributes){

    	},
    	destructor: function(){

    	},
        query: function(options, callback){ // callback should be called with (err, data)

        }
    });

    Y.namespace('<%=namespace%>.<%=MODULE%>');
    Y.<%=namespace%>.<%=MODULE%>.Model = <%=MODULE%>Model;

}, '@VERSION@',{
    requires:['model']
});