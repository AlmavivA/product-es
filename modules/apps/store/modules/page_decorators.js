var pageDecorators = {};
(function() {
    pageDecorators.navigationBar = function(ctx, page) {
        var rxtManager = ctx.rxtManager;
        //Obtain all of the available rxt types
        var availableTypes = rxtManager.listRxtTypeDetails();
        var types=[];
        var currentType = ctx.assetType;
        page.navigationBar = {};
        for (var index in availableTypes) {
            currentType = availableTypes[index];
            currentType.selected=false;
            if (currentType.shortName == ctx.assetType) {
                currentType.selected = true;
            }
            types.push(currentType);
        }
        page.navigationBar.types = types;
        return page;
    };
    pageDecorators.searchBar = function(ctx, page) {
    	page.searchBar={};
    	page.searchBar.searchFields=page.assets.searchFields;
    	return page;
    };
}());