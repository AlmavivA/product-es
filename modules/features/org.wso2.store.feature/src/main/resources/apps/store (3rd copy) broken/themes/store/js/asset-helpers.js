var renderAssets, mouseStop, isAssertTrue, addAssert;

(function () {
    renderAssets = function (data) {
        var el = $('.store-left');
        caramel.css($('head'), data.header['sort-assets'].resources.css, 'sort-assets');
        caramel.code($('head'), data.body['assets'].resources.code);
        async.parallel({
            assets: function (callback) {
                caramel.render('assets', data.body.assets.context, callback);
            },
            paging: function (callback) {
                caramel.render('pagination', data.body.pagination.context, callback);
            },
            sort: function (callback) {
                caramel.render('sort-assets', data.header['sort-assets'].context, callback);
            }
        }, function (err, result) {
            theme.loaded(el, result.sort);
            el.append(result.assets);
            el.append(result.paging);
            caramel.js($('body'), data.body['assets'].resources.js, 'assets', function () {
                mouseStop();
            });
            caramel.js($('body'), data.header['sort-assets'].resources.js, 'sort-assets', function () {
                updateSortUI();
            });
            $(document).scrollTop(0);
        });
    };
    
    renderAssetsScroll = function(data){
    	var temp = '{{#slice assets size="4"}}<div class="row-fluid">';
        	temp += '{{#each .}}';
			temp += '<div class="span3 asset" data-path="{{path}}" data-type="{{type}}">';
			temp += '	{{#attributes}}';
			temp += '	<a href="{{url "/asset"}}/{{../type}}?asset={{../path}}">';
			temp += '	<div class="asset-icon">';		
			temp += '	<img src="{{#if images_thumbnail}}{{images_thumbnail}}{{/if}}">';
			temp += '	</div> </a>';
			temp += '	<div class="asset-details">';
			temp += '		<div class="asset-name">';
			temp += '			<a href="{{url "/asset"}}/{{../type}}?asset={{../path}}"> <h4>{{overview_name}}</h4> </a>';
			temp += '		</div>';
			temp += '		<div class="asset-rating">';
			temp += '			<div class="asset-rating-{{../rating/average}}star">';
			temp += '			</div>';
			temp += '		</div>';
			temp += '		<div class="asset-author-category">';
			temp += '			<ul>';
			temp += '				<li>';
			temp += '					<h4>{{t "Category"}}</h4>';
			temp += '					<a class="asset-category" href="#">{{cap ../type}}</a>';
			temp += '				</li>';
			temp += '				<li>';
			temp += '					<h4>{{t "Author"}}</h4>';
			temp += '					<a class="asset-author" href="#">{{overview_provider}}</a>';					
			temp += '				</li>';
			temp += '			</ul>';
			temp += '		</div>';
			temp += '	</div>';
			temp += '	{{/attributes}}';
			temp += '</div>';
			temp += '{{/each}}';
			temp += '</div>{{/slice}}';
			
      var assetsTemp = Handlebars.compile(temp);
 	  var render = assetsTemp(data.body.assets.context);
      $('#assets-container').append(render);
      
       caramel.js($('body'), data.body['assets'].resources.js, 'assets', function () {
                mouseStop();
            });
            caramel.js($('body'), data.header['sort-assets'].resources.js, 'sort-assets', function () {
                updateSortUI();
            });
    	
    }

    mouseStop = function () {
    	var windowWidth = $(window).width();
    	var offsetTop = windowWidth < 980 ? 167 : 200;
        var id;
        $('.asset').mousestop(function () {
            var that = $(this);
            id = setTimeout(function () {
		that.find('.store-bookmark-icon').animate({
		    top : -200
		}, 200);
                that.find('.asset-details').animate({
                    top: 0
                }, 200);
            }, 300);
        }).mouseleave(function () {
                clearTimeout(id);
		$(this).find('.store-bookmark-icon').animate({top: -4}, 200);
                $(this).find('.asset-details').animate({top: offsetTop}, 200);
            });
    };

    isAssertTrue = function (aid,type) {
	var array = new Array();
	caramel.get('/apis/asset/'+type,{
            }, function (data) {
		for(j = 0; j < data.length; j++){
		    if(data[j]['path']==aid){
		       array.push(data[j]['path']);
		    		}
        	}
		addAssert(aid,type,array);
            });
	};

     addAssert = function (aid,type,array) {
	if(array.length>0){
		asset.process(type, aid, location.href);
		}	
	};
}());
