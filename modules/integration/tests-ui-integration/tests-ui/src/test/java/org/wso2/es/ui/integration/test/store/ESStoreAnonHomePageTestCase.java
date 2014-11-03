/*
 * Copyright (c) WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.wso2.es.ui.integration.test.store;

import static org.testng.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.wso2.es.integration.common.utils.ESIntegrationUITest;
import org.wso2.es.ui.integration.util.ESWebDriver;

public class ESStoreAnonHomePageTestCase extends ESIntegrationUITest {
    private ESWebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;
    private StringBuffer verificationErrors = new StringBuffer();

    @BeforeClass(alwaysRun = true)
    public void setUp() throws Exception {
        super.init();
        driver = new ESWebDriver();
        wait = new WebDriverWait(driver, 30);
        baseUrl = getWebAppURL();
    }

    @Test(groups = "wso2.es", description = "Test Anonymous User Home Page")
    public void testAnonHomePage() throws Exception {
        driver.get(baseUrl + "/store");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a.brand")));
        try {
            assertTrue(isElementPresent(By.cssSelector("a.brand")), "Home Page error: Logo missing");
            assertEquals("Sign in", driver.findElement(By.linkText("Sign in")).getText(),
                    "Home Page error: Sign in button missing");
            assertTrue(isElementPresent(By.id("btn-register")), "Home Page error: Register button missing");
            assertEquals("Gadget", driver.findElement(By.xpath
                    ("//div[@id='container-search']/div/div/div/div/a[1]/li")).getText(),
                    "Home Page error: Gadget menu missing");
            assertEquals("Site", driver.findElement(By.xpath("//div[@id='container-search']/div/div/div/div/a[2]/li")
            ).getText(), "Home Page error: Site menu missing");
            assertEquals("Recent Gadgets", driver.findElement(By.linkText("Recent Gadgets")).getText(),
                    "Home Page error: Recent Gadgets links missing");
            assertEquals("Recent Sites", driver.findElement(By.linkText("Recent Sites")).getText(),
                    "Home Page error: Recent Sites links missing");
            assertTrue(isElementPresent(By.id("search")), "Home Page error: Search missing");
            assertTrue(isElementPresent(By.cssSelector("div.span3.store-right > div.row > div.span3")),
                    "Home Page error: Recent Added side list missing");
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
    }

    @Test(groups = "wso2.es", description = "Test Anonymous User Recent sliding")
    public void testSliding() throws Exception {
        //TODO how to detect sliding is successful?
    }

    @Test(groups = "wso2.es", description = "Test Anonymous Navigation from top menu")
    public void testAnonNavigationTop() throws Exception {
        driver.get(baseUrl + "/store");
        driver.findElement(By.xpath("//div[@id='container-search']/div/div/div/div/a[1]/li")).click();
        try {
            assertEquals("Line Plus Bar Chart", driver.findElement(By.cssSelector("h4")).getText(),
                    "Gadgets Menu not working");
            driver.findElement(By.xpath("//div[@id='container-search']/div/div/div/div/a[2]/li")).click();
            assertEquals("Amazon", driver.findElement(By.xpath
                    ("//div[@id='assets-container']/div/div[1]/div/div/a/h4")).getText(), "Sites Menu not working");
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.cssSelector("a.brand")).click();
    }

    @Test(groups = "wso2.es", description = "Test Anonymous Navigation page links")
    public void testAnonNavigationLinks() throws Exception {
        driver.findElement(By.cssSelector("a.brand")).click();
        driver.findElement(By.linkText("Recent Gadgets")).click();
        try {
            assertEquals("Line Plus Bar Chart", driver.findElement(By.cssSelector("h4")).getText(),
                    "Recent Gadgets link not working");
            driver.findElement(By.cssSelector("a.brand")).click();
            driver.findElement(By.linkText("Recent Sites")).click();
            assertEquals("Amazon", driver.findElement(By.xpath("//div[@id='assets-container']/div/div[1]/div/div/a/h4"))
                    .getText(),
                    "Recent Sites link not working");
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() throws Exception {
        driver.quit();
        String verificationErrorString = verificationErrors.toString();
        if (!"".equals(verificationErrorString)) {
            fail(verificationErrorString);
        }
    }

    private boolean isElementPresent(By by) {
        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

}