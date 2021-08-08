'use strict';
const CareerPage = require("../../models/CareerPage.js")
const { Given, When, Then, setDefaultTimeout, BeforeAll,Before } = require('cucumber');
const { browser, element } = require('protractor');
const { expect, assert } = require("chai");
const { pathExists } = require("fs-extra");

setDefaultTimeout(GLOBAL_TIMEOUT);
const page = new CareerPage()
let matchedPositions;
let applyBtn;

Given('I navigate to the career page', async () => {
  page.get();
  try{
  await browser.wait(ec.visibilityOf((element(by.css('.cookie-disclaimer__button')))),5000)
  return await page.acceptCookie()
  }
  catch(e){
    return console.warn("No accept cookie button!")
  }
  

});
Then(/I want to see the ([\w\s]+:?)\s\"?([\w\s]+)\"?(.*)/, async (a, b, c) => {
  
  switch (true) {
    case a.toUpperCase().includes("CAREER"):
      
      return expect(browser.getTitle()).eventually.to.be.equal("Explore Professional Growth Opportunities | EPAM Careers")
    
    case `${a} ${b}`.toUpperCase().includes("SEARCH FORM"):
      return expect(page.isCareerPresent("jobSearchForm")).eventually.to.be.true;
    
    case a.toUpperCase().includes("COUNTRY"):
      await browser.wait(ec.presenceOf(element(page.locators.countrySelector(b)), 5000))
      return expect(page.isCareerPresent("countrySelector", b)).eventually.to.be.true
    
    case a.toUpperCase().includes("CITY") && c.toUpperCase().includes("IN THE LIST"):
      return expect(page.isCareerPresent("citySelector", b)).eventually.to.be.true
    
    case b.toUpperCase().includes("DEPARTMENT"):
      const departmentList = await browser.wait(ec.visibilityOf(element(by.css('.multi-select-dropdown'))))
      return expect(departmentList).to.be.true
    
    case a.toUpperCase().includes("DEPARTMENT"):
      const foundDepartment = await browser.wait(ec.presenceOf(element(page.locators.skillLocator(b))))
      return expect(foundDepartment).to.be.true
    
    case a.toUpperCase().includes("JOB LISTING"):
      browser.wait(ec.titleIs("Join our Team | EPAM Careers"))
      const title = await browser.getTitle()
      return expect(title).to.be.equal("Join our Team | EPAM Careers")
    
    case a.toUpperCase().includes("POSITION") && !c:
      await browser.wait(ec.presenceOf(element(page.locators.searchResultList)), 5000);
      const resultList = await page.getResultList();
      matchedPositions = await page.getMatchedResults(resultList, b);
      return expect(matchedPositions).has.length.greaterThan(0);
    
    case a.toUpperCase().includes("JOB DESCRIPTION"):
      return expect(browser.wait(ec.titleContains("EPAM - Apply Today"))).eventually.to.be.true;
    
    case a.toUpperCase().includes("POSITION") && c.toUpperCase().includes("JOB DESCRIPTION"):
      return expect(element(by.css('h1')).getText()).eventually.to.include(b)
    
    case a.toUpperCase().includes("CITY") && c.toUpperCase().includes("JOB DESCRIPTION"):
      return expect(element(by.css('h1')).getText()).eventually.to.include(b)
    
    default:
      return assert.fail()
  }
});
Given('I am on the career page', () => {
  return expect(browser.getTitle()).eventually.to.be.equal("Explore Professional Growth Opportunities | EPAM Careers")
});
When(/I click on the (\w+:?)\s\"?([\w\s]+)\"?/, async (a, b) => {
  switch (true) {
    case a.toUpperCase().includes("LOCATION"):
      return await page.click(page.locators.locationSearch)
    case a.toUpperCase().includes("COUNTRY"):
      return await page.click(page.locators.countrySelector(b))
    case a.toUpperCase().includes("CITY"):
      return await page.selectCity(b);
    case a.toUpperCase().includes("SKILLS"):
      return await page.click(page.locators.skills)
    case a.toUpperCase().includes("DEPARTMENT"):
      return await page.click(page.locators.skillLocator(b))
    case b.toUpperCase().includes("FIND"):
      return await page.click(page.locators.findBtn)
    case b.toUpperCase().includes("APPLY"):
      return await applyBtn.click()
    default:
      return assert.fail()
  }
});

Then('the {string}\'s city list gets visible', function (country) {
  return expect(browser.wait(ec.visibilityOf(element(page.locators.cityListSelector(country))), 5000)).eventually.not.to.be.undefined
});

Then('the {string}\'s city list contains {string}', async (country, city) => {
  console.log(country)
  console.log(city)
  const cityListText = await element(page.locators.cityListSelector(country)).getText()
  return expect(cityListText).to.match(new RegExp(`${city}`))
});

Then('the dropdown menu closes', async () => {
  const dropDown = await element(by.css(".select2-selection.select2-selection--single"))
  const isExpanded = await dropDown.getAttribute('aria-expanded')
  return expect(isExpanded).to.be.equal('false');
});

Then('the {string} name is shown in the location field', async (city) => {
  const selection = await element(by.css('.select2-selection__rendered'))
  return expect(selection.getText()).eventually.to.be.equal(city)
});

Then('I want the {string}\'s checkbox to be checked', async (department) => {
  const departmentCheckbox = await element(by.css(`input[type='checkbox'][data-value='${department}']`))
  const isChecked = await departmentCheckbox.getAttribute('checked')
  return expect(isChecked).to.be.equal('true')
});

Then('I want the position to have the location {string} and {string}', async (city, country) => {
  for (let element of matchedPositions) {
    const location = await page.getLocation(element);
    expect(location.toUpperCase()).to.include(city.toUpperCase());
    expect(location.toUpperCase()).to.include(country.toUpperCase());
  }
});

Then('I want the position to have apply button', async () => {
  for (let elem of matchedPositions) {
    applyBtn = await elem.element(page.locators.applyBtn)
    expect(browser.wait(ec.visibilityOf(applyBtn))).eventually.to.be.true;
  }
});


