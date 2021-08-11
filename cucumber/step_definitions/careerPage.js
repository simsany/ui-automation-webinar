'use strict';
const CareerPage = require("../../models/CareerPage.js")
const JobListingPage = require("../../models/JobListingPage.js")
const { Given, When, Then, setDefaultTimeout, BeforeAll, Before } = require('cucumber');
const { browser, element } = require('protractor');
const { expect } = require("chai");
const locators = require("../../locators/locators.json")
const careerPage = new CareerPage()
const jobListingPage = new JobListingPage()
let matchedPositions;
setDefaultTimeout(GLOBAL_TIMEOUT);

Given('I navigate to the career page',
  async (a) => {
    console.log(a.rows())
    careerPage.get();
    try {
      await browser.wait(ec.visibilityOf((element(by.css('.cookie-disclaimer__button')))), 5000);
      return await careerPage.acceptCookie();
    }
    catch (e) {
      return console.warn("No accept cookie button!");
    }
  });
Then('I want to see the career page', () => expect(careerPage.isLoaded()).eventually.to.be.true);

Then('I want to see the search form', () => expect(element(locators.jobSearchForm).isPresent()).eventually.to.be.true);

Given('I am on the career page', () => expect(careerPage.isLoaded()).eventually.to.be.true);
When('I click on the Location filter box', async () => await careerPage.click(locators.locationSearch));
Then('I want to see the country: {string} in the list', async (country) => {
    await browser.wait(ec.presenceOf(element(careerPage.countrySelector(country)), 5000));
    return expect(element(careerPage.countrySelector(country)).isPresent()).eventually.to.be.true;
  });

Then('I want to see the city: {string} in the list', async (city) => {
    await browser.wait(ec.presenceOf(element(careerPage.citySelector(city)), 5000));
    return expect(element(careerPage.citySelector(city)).isPresent()).eventually.to.be.true;
  });
When(/I click on the (country|city): \"(\w+)\"/, async (locationType,location) => await careerPage.click(careerPage[locationType+"Selector"](location)));
Then('the {string}\'s city list gets visible', (country) => expect(browser.wait(ec.visibilityOf(element(careerPage.cityListSelector(country))), 5000)).eventually.to.be.true);
Then('the {string}\'s city list contains {string}',(country, city) => {
  return expect(careerPage.getCityListText(country)).eventually.to.match(new RegExp(`${city}`))
});
Then('the dropdown menu closes', () => expect(careerPage.isLocationExpanded()).eventually.to.be.equal('false'));
Then('the {string} name is shown in the location field', async (city) => expect(careerPage.getSelectionText()).eventually.to.be.equal(city));
When('I click on the Skills filter box', async () => await careerPage.click(locators.skills));
Then('I want to see the available departments', () => expect(browser.wait(ec.visibilityOf(element(locators.departmentDropdown)))).eventually.to.be.true);
Then('I want to see the given department: {string}', (skill) => expect(browser.wait(ec.visibilityOf(element(careerPage.skillLocator(skill))))).eventually.to.be.true);
When('I click on the department: {string}\'s label', async (skill) => await careerPage.click(careerPage.skillLocator(skill)));
Then('I want the {string}\'s checkbox to be checked', department => expect(careerPage.isDepartmentChecked(department)).eventually.to.be.equal('true'));
When(/I click on the (find|apply) button/, async (button) => await careerPage.click(locators[button]));
Then('I want to see the job listing page', async () => {
    await browser.wait(ec.titleIs("Join our Team | EPAM Careers"));
    return expect(browser.getTitle()).eventually.to.be.equal("Join our Team | EPAM Careers");
  });

Given('I am on the job listing page', async () => {
    await browser.wait(ec.titleIs("Join our Team | EPAM Careers"));
    return expect(browser.getTitle()).eventually.to.be.equal("Join our Team | EPAM Careers");
  });
Then('I want {string} to be listed', async (position) => {
    await browser.wait(ec.presenceOf(element(locators.searchResultList)), 5000);
    const resultList = await jobListingPage.getResultList();
    matchedPositions = await jobListingPage.getMatchedResults(resultList, position);
    return expect(matchedPositions).has.length.greaterThan(0);
  });
Then('I want the position to have the location {string} and {string}',async (city, country) => {
    for (let element of matchedPositions) {
      const location = await careerPage.getLocation(element);
      expect(location.toUpperCase()).to.include(city.toUpperCase());
      expect(location.toUpperCase()).to.include(country.toUpperCase());
    }
  });
Then('I want the position to have apply button', async () => {
  for (let elem of matchedPositions) {
    expect(browser.wait(ec.visibilityOf(elem.element(locators.apply)))).eventually.to.be.true;
  }
});
Then('I want to see the job description page', () => expect(browser.wait(ec.titleContains("Apply Today"))).eventually.to.be.true);
Given('I am on the job description page', () => expect(browser.wait(ec.titleContains("Apply Today"))).eventually.to.be.true);
Then(/I want to see the (?:city|position): \"([\w\s]+)\" in the job description/, (example) => expect(element(by.css('h1')).getText()).eventually.to.include(example));