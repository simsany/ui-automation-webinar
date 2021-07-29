const BasePage = require('./BasePage.js')
const {By,until} = require('selenium-webdriver')
module.exports=class CareerPage extends BasePage {
    constructor() {
        super()
        this.driver = this.driver.build()
        this.locators = {
            css: {
                locationSearch: '.select2-selection__rendered',
                skills :'.multi-select-filter .selected-params',
                findBtn: '.recruiting-search__submit',
                keyword: '#new_form_job_search-keyword',
                jobSearchForm:'#jobSearchFilterForm',
                searchResults: '.search-result__item',
                searchItemName: '.search-result__item-name',
                searchResultLocation: '.search-result__location',
                applyBtn: '.search-result__item-apply',
                searchResultList: '.search-result__list'
            }
        }

    }
    getCountrySelector(counry){
        return `li[aria-label='${counry}']`
    }
    getCitySelector(city){
        return `li[id$='${city}']`
    }
    getSkillLocator(skill){
        return `input[data-value='${skill}']`
    }
    getSearchResults = async function (page){
        const searchResults =await page.driver.wait(until.elementsLocated(By.css(this.locators.css.searchResults)),10000)
        return searchResults
    }
    getResultList = async function(page){
        const resultList = await page.driver.wait(until.elementLocated(By.css(this.locators.css.searchResultList)),10000)
        return resultList
    }
 
    getMatchedResults = async function(resultList,position){
        const matchedPositions = await resultList.findElements(By.xpath(`//li[contains(@class, search-result__item) and contains(string(),"${position}") ]`))
        return matchedPositions
    }
    getLocation=async function(result){
        const location = await result.findElement(By.css(this.locators.css.searchResultLocation)).getText()
        return location
    }

}

