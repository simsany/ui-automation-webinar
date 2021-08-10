const BasePage = require('./BasePage.js')
const { browser, element } = require('protractor');
const locators = require("../locators/locators.json")
module.exports = class CareerPage extends BasePage {
    constructor() {
        super("https://www.epam.com/careers/")
    }
    getSearchResults = async function () {
        return await element.all(locators.searchResults)
    }
    getResultList = async function () {
        const resultList = await element(locators.searchResultList)
        return resultList
    }
    selectCity = async (city) => {
        await element(this.citySelector(city)).click()
    }

    selectSkill = async function (skill) {
        await element(this.skillLocator(skill)).click()
    }

    getLocation = async function (result) {
        const location = await result.element(locators.searchResultLocation).getText()
        return location
    }

    countrySelector(country) {
        return { css: `li[aria-label*='${country}']` }
    }
    citySelector(city) {
        return { css: `li[id*=${city}]` }
    }
    skillLocator(skill) {
        return { xpath: `//label[input[@data-value='${skill}']]` }
    }
    cityListSelector(country) {
        return { css: `li[aria-label*="${country}"].select2-results__option.dropdown-cities ul` }
    }
    getCityListText(country) {
        return element(this.cityListSelector(country)).getText()
    }
    isLocationExpanded = async function () {
        const dropDown = await element(by.css(".select2-selection.select2-selection--single"))
        const isExpanded = await dropDown.getAttribute('aria-expanded')
        return isExpanded
    }
    getSelectionText = async function () {
        const selection = await element(by.css('.select2-selection__rendered'))
        return selection.getText()
    }
    isDepartmentChecked = async function (department) {
        const departmentCheckbox = await element(by.css(`input[type='checkbox'][data-value='${department}']`))
        const isChecked = await departmentCheckbox.getAttribute('checked')
        return isChecked
    }
}

