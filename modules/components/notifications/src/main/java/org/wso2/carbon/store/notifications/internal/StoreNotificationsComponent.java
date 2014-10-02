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
package org.wso2.carbon.store.notifications.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.registry.eventing.services.EventingService;
import org.wso2.carbon.store.notifications.management.Utils;
import org.wso2.carbon.store.notifications.service.StoreNotificationService;

/**
 * @scr.component name="org.wso2.carbon.store.notifications" immediate="true"
 * @scr.reference name="registry.service"
 * interface="org.wso2.carbon.registry.core.service.RegistryService" cardinality="1..1"
 * policy="dynamic" bind="setRegistryService" unbind="unsetRegistryService"
 * @scr.reference name="registry.eventing.service"
 * interface="org.wso2.carbon.registry.eventing.services.EventingService" cardinality="1..1"
 * policy="dynamic" bind="setRegistryEventingService" unbind="unsetRegistryEventingService"
 */

public class StoreNotificationsComponent {

    private static Log log = LogFactory.getLog(StoreNotificationsComponent.class);

    protected void activate(ComponentContext context) {
        BundleContext bundleContext = context.getBundleContext();
        bundleContext.registerService(StoreNotificationService.class,
                new StoreNotificationService(), null);
        log.info("Store Notification service is activated");
    }

    protected void setRegistryEventingService(EventingService eventingService) {
        Utils.setRegistryEventingService(eventingService);
        log.debug("Successfully set registry eventing service");
    }

    protected void unsetRegistryEventingService(EventingService eventingService) {
        Utils.setRegistryEventingService(null);
    }

    protected void setRegistryService(RegistryService registryService) {
        Utils.setRegistryService(registryService);
        log.debug("Successfully set registry service");
    }

    protected void unsetRegistryService(RegistryService registryService) {
        Utils.setRegistryService(null);
    }

}
