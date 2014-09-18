/*
 *  Copyright (c) 2005-2009, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
var pageDecorators = {};
(function() {
    pageDecorators.navigationBar = function(ctx, page, utils) {
        var rxtManager = ctx.rxtManager;
        //Obtain all of the available rxt types
        var availableTypes = rxtManager.listRxtTypeDetails();
        var types = [];
        var currentType = ctx.assetType;
        var log = new Log();
        page.navigationBar = {};
        for (var index in availableTypes) {
            currentType = availableTypes[index];
            currentType.selected = false;
            currentType.listingUrl = utils.buildAssetPageUrl(availableTypes[index].shortName, '/list');
            if (currentType.shortName == ctx.assetType) {
                currentType.selected = true;
            }
            types.push(currentType);
        }
        page.navigationBar.types = types;
        return page;
    };
    /**
     * The function populates any text field as a search field
     * @param  {[type]} ctx  [description]
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    pageDecorators.searchBar = function(ctx, page) {
        page.searchBar = {};
        page.searchBar.searchFields = [];
        var searchFields = page.assetMeta.searchFields;
        for (var index in searchFields) {
            if ((searchFields[index].type == 'text') || (searchFields[index].type == 'options')) {
                page.searchBar.searchFields.push(searchFields[index]);
            }
        }
        return page;
    };
    /**
     * The function populates the categories for the category box
     * @param  {[type]} ctx  [description]
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    pageDecorators.categoryBox = function(ctx, page) {
        page.categoryBox = {};
        page.categoryBox.categories = page.assetMeta.categories;
        page.categoryBox.searchEndpoint = '/apis/assets?type=' + ctx.assetType;
        return page;
    };
    pageDecorators.authenticationDetails = function(ctx, page) {
        var authenticationMethods = ctx.tenantConfigs.authentication ? ctx.tenantConfigs.authentication : {};
        var activeMethod = authenticationMethods.activeMethod ? authenticationMethods.activeMethod : '';
        //Obtain the details for this method of authentication
        var authDetails = fetchActiveAuthDetails(activeMethod, authenticationMethods.methods || []);
        page.security.method = activeMethod;
        page.security.details = authDetails;
        return page;
    };
    pageDecorators.recentAssets = function(ctx, page) {
         var am = getAssetManager(ctx);
         var assets = am.recentAssets();
         page.recentAssets=assets;
         return page;
    };

    pageDecorators.recentAssetsOfActivatedTypes=function(ctx,page){
        var app=require('rxt').app;
        var asset=require('rxt').asset;
        var assets={};
        var assetsOfType;
        var am;
        var type;
        var types=ctx.rxtManager.listRxtTypeDetails();
        for(var index in types){
            type=types[index].shortName;
            if(ctx.isAnonContext){
                am=asset.createAnonAssetManager(ctx.session,type,ctx.tenantId);
            }
            else{
                am=asset.createUserAssetManager(ctx.session,type);
            }
            assets[type]=am.recentAssets();
        }
        page.recentAssetsOfAllTypes=assets;
    };
    var getAssetManager = function(ctx) {
        var asset = require('rxt').asset;
        var am;
        var tenantId = -1234;

        if (ctx.isAnonContext) {
            am = asset.createAnonAssetManager(ctx.session, ctx.assetType, tenantId);
        } else {
            am = asset.createUserAssetManager(ctx.session, ctx.assetType);
        }
        return am;
    };
    var fetchActiveAuthDetails = function(method, methods) {
        for (var key in methods) {
            if (key == method) {
                return methods[key];
            }
        }
        return null;
    };
}());