/**
 * @module srpl-business-model
 * @requires model-list,srpl-business-model
*/
YUI.add('srpl-business-model-list', function(Y){

    var BusinessModelList = function(){
        BusinessModelList.superclass.constructor.apply(this, arguments);
    };

    Y.extend(BusinessModelList, Y.ModelList, {
        // This tells the list that it will hold instances of the Business Model class.
        model : Y.srpl.Business.Model
    });

    Y.namespace('srpl.Business.List');
    Y.srpl.Business.Model.List = BusinessModelList;

},'@VERSION@',{requires:['model-list', 'srpl-business-model']});