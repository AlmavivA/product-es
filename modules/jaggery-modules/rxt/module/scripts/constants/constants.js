/*
 *  Copyright (c) 2005-2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
var constants = {};
(function(constants) {
    constants.DEFAULT_TITLE = 'ES';
    constants.MSG_PAGE_INFO_NOT_FOUND = 'Title not found';
    constants.DEFAULT_TENANT = -1234;
    constants.RECENT_ASSET_COUNT = 5; //The default number of recent assets to be retrieved
    constants.POPULAR_ASSET_COUNT=1;
    constants.DEFAULT_TIME_STAMP_FIELD='overview_createdtime';
    constants.SUBSCRIPTIONS_PATH = '/subscriptions';
    constants.APP_CONTEXT='rxt.app.context';
    constants.TAGS_QUERY_PATH='/_system/config/repository/components/org.wso2.carbon.registry/queries/allTags';

    /**
     * ES Feature Constants
     */
    
    /**
     * @constant The social feature name
     * @type {String}
     */
    constants.SOCIAL_FEATURE='social';
    constants.SOCIAL_FEATURE_SCRIPT_KEY='socialScriptSource';
    constants.SOCIAL_FEATURE_SCRIPT_TYPE_KEY='socialScriptType';
    constants.SOCIAL_FEATURE_APP_URL_KEY='socialAppUrl';
    constants.ASSET_DEFAULT_SORT='overview_createdtime';
    constants.Q_SORT='sortBy';
    constants.Q_TAG='tag';
    constants.Q_SORT_ORDER='sort';
    constants.ASSET_DEFAULT_SORT_ORDER='DESC';
    /**
     * URL Patterns
     */
    constants.APP_PAGE_URL_PATTERN = '/{context}/pages/{+suffix}';
    constants.ASSET_PAGE_URL_PATTERN = '/{context}/asts/{type}/{+suffix}';
    constants.ASSET_API_URL_PATTERN='/{context}/asts/{type}/apis/{+suffix}';
    /**
     * URLs
     */
    constants.ASSET_BASE_URL = '/asts/';
    constants.ASSET_API_URL = '/apis/';
    constants.APP_PAGE_URL = '/pages/';
    constants.APP_API_URL = '/apis/';

    /**
     * Pagin objects
     */
    constants.DEFAULT_RECENT_ASSET_PAGIN = {
        start: 0,
        count: 5,
        sortBy: '',
        sortOrder: 'DESC'
    };
    constants.DEFAULT_POPULAR_ASSET_PAGIN={
        start:0,
        count:1,
        sortBy:'',
        sortOrder:'asc'
    };
    constants.DEFAULT_TAG_PAGIN={
        start: 0,
        count: 10,
        sortBy: '',
        sortOrder: 'older'
    };
    constants.DEFAULT_ASSET_PAGIN={
        start:0,
        count:12,
        sortBy: '',
        sortOrder: 'ASC'
    };
}(constants));