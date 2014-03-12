var gadgetRxtPath = '/gadgets/';
var siteRxtPath = '/sites/';

var repoPath = '/gadgets';
var repoSitePath = '/sites';

var lastUpdated = 0;

var DEPLOYING_INTERVAL = 10000;

var caramel = require('caramel');
require('/app.js');

var store = require('/store.js').config();


var deployer = require('/modules/deployer.js'),
    context = caramel.configs().context,
    log = new Log('store.deployer');

//var log = new Log();

var populate = function () {
    var i, name, length, gadgets, file, path, xml,
    repo = new File(repoPath),
    base = store.server.http + context + gadgetRxtPath;

    if (repo.isDirectory()) {
        gadgets = repo.listFiles();
        length = gadgets.length;
        for (i = 0; i < length; i++) {
            name = gadgets[i].getName();
            if (skipGadgets(name))
                continue;
            file = new File(repoPath + '/' + name + '/' + name + '.xml');
            if (file.getLastModified() > lastUpdated) {
                var existingSession = Session["started"];
                if (existingSession) {
                    log.info('Deploying Gadget : ' + name);
                }
                path = base + name + '/';

                file.open('r');
                var fileContent = file.readAll();
                fileContent = fileContent.replace(/^\s*<\?.*\?>\s*/, "");
                xml = new XML(fileContent);
                file.close();
                deployer.gadget({
                    name: xml.*::ModulePrefs.@title,
                    tags: (String(xml.*::ModulePrefs.@tags)).split(','),
                    rate: Math.floor(Math.random() * 5) + 1,
                    provider: store.user.username,
                    version: '1.0.0',
                    description: xml.*::ModulePrefs.@description,
                    url: path + name + '.xml',
                    thumbnail: path + 'thumbnail.jpg',
                    banner: path + 'banner.jpg',
                    status: 'PUBLISHED'
                });
            }
        }
        if (typeof(Session["started"]) == "undefined") {
            log.info('Default gadgets deployed');
        }
    }
};

var skipGadgets = function (name) {
    if (name === 'agricultural-land' ||
        name === 'wso2-carbon-dev' ||
        name === 'intro-gadget-1' ||
        name === 'intro-gadget-2' ||
        name === 'show-assets' ||
        name === 'co2-emission' ||
        name === 'electric-power' ||
        name === 'energy-use' ||
        name === 'greenhouse-gas') return true;
};

var addSSOConfig = function () {
    var deployer = require('/modules/deployer.js');
    //Adding SSO Configs
    deployer.sso({'issuer': 'store',
        'consumerUrl': store.ssoConfiguration.storeAcs,
        'doSign': 'true',
        'singleLogout': 'true',
        'useFQUsername': 'true',
        'issuer64': 'c3RvcmU'});
};

var logstoreUrl = function () {
    log.info("UES store URL : " + store.server.http + caramel.configs().context);
};

var populateSites = function () {
    var i, name, length, sites,siteJson, file, path, xml,temp,
        repo = new File(repoSitePath),
        base = store.server.http + context + siteRxtPath;

        if (repo.isDirectory()) {
        sites = repo.listFiles();
        length = sites.length;
        for (i = 0; i < length; i++) {
            name = sites[i].getName();
            var siteJson = require('/sites/'+ name + '/site.json');

                var path = base + name + '/';
                deployer.site({
                    name: siteJson.name,
                    tags: siteJson.tags.split(','),
                    rate: siteJson.rate,
                    provider: siteJson.attributes.overview_provider,
                    version: siteJson.attributes.overview_version,
                    description: siteJson.attributes.overview_description,
                    url: siteJson.attributes.overview_url,
                    thumbnail: base + siteJson.attributes.images_thumbnail,
                    banner: base + siteJson.attributes.images_banner,
                    status: siteJson.attributes.overview_status
                });

                if (typeof(Session["started"]) == "undefined") {
                    log.info('Default sites deployed');
                }
                Session["started"] = true;

        }
    }
    lastUpdated = new Date().getTime();
};

populate();
populateSites();
addSSOConfig();
/*
 setInterval(function () {
 //TEMP fix for task not clearing properly during server shutdown
 try {
 populate();
 } catch (e) {
 }
 }, DEPLOYING_INTERVAL);
 setTimeout(logstoreUrl, 5000);
 */