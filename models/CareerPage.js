const BasePage = require('./BasePage.js')
const { By, until } = require('selenium-webdriver');
const { browser, element } = require('protractor');
const { protractor } = require('protractor/built/ptor');
const EC = protractor.ExpectedConditions;
module.exports = class CareerPage extends BasePage {
    constructor() {
        super("https://www.epam.com/careers/")
        this.locators = {

            locationSearch: { css: '.select2-selection__rendered' },
            skills: { css: '.multi-select-filter .selected-params' },
            findBtn: { css: '.recruiting-search__submit' },
            keyword: { css: '#new_form_job_search-keyword' },
            jobSearchForm: { css: '#jobSearchFilterForm' },
            searchResults: { css: '.search-result__item' },
            searchItemName: { css: '.search-result__item-name' },
            searchResultLocation: { css: '.search-result__location' },
            applyBtn: { css: '.search-result__item-apply' },
            searchResultList: { css: '.search-result__list' },
            countrySelector: function(country){
                    return { css: `li[aria-label*='${country}']` }
            },
            citySelector: function(city){
                 return { css: `li[id*=${city}]` }
            },
            skillLocator: function(skill){
                return { xpath: `//li[descendant::span[contains(text(),"${skill}")]]`
                 }
            },
            cityListSelector: function(country){
                return {css: `li[aria-label*="${country}"].select2-results__option.dropdown-cities ul`}
            }

        }
    }

    isLoaded = async function(){
        const isFindBtnDisplayed = await element(this.locators.findBtn).isPresent()
        return isFindBtnDisplayed
    }
    isCareerPresent = async function(locatorName, attribute){
        const locator = this.locators[locatorName]
        const careerPresent = attribute ? await element(locator(attribute)).isPresent() :
        await element(locator).isPresent()

        return careerPresent
    }


    getSearchResults = async function(){
        return await element.all(this.locators.searchResults)
    }
    getResultList = async function(){
        const resultList = await element(this.locators.searchResultList)
        return resultList
    }
    selectCity = async (city) => {
        await element(this.locators.citySelector(city)).click()
    }

    selectSkill = async function(skill){
        browser.executeScript(`document.querySelector("${this.locators.skillLocator(skill).css}").click()`);
    }


    getMatchedResults = async (resultList, position) => {
        const matchedPositions = await resultList.all(by.cssContainingText('.search-result__item', position));
        return matchedPositions;
    }
    getLocation = async function(result){
        const location = await result.element(this.locators.searchResultLocation).getText()
        return location
    }
    hasElement = async (el, locator) => {
        const containsElement = await el.element(locator).isPresent();
        return containsElement;
    }
}

