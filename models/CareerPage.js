const BasePage = require('./BasePage.js')
const {By,until} = require('selenium-webdriver')
const EC = protractor.ExpectedConditions;
module.exports=class CareerPage extends BasePage {
    constructor() {
        super()
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
    isLoaded = async function(){
            const isFindBtnDisplayed = await element(by.css(this.locators.css.findBtn)).isPresent()
            return isFindBtnDisplayed
    }

    isJobApplyFormPresent = async function(){
       const isApplyFormPresent= await element(by.css(this.locators.css.jobSearchForm)).isPresent()
        return isApplyFormPresent
    }
    getCountrySelector(counry){
        return `li[aria-label='${counry}']`
    }
    getCitySelector(city){
        return `option[value='${city}']`
    }
    getSkillLocator(skill){
        return `input[data-value='${skill}']`
    }
    getSearchResults = async function (){
        return await element.all(by.css(this.locators.css.searchResults))
    }
    getResultList = async function(){
        await browser.wait(EC.presenceOf(element(by.css(this.locators.css.searchResultList))), 5000);
        const resultList = await element(by.css(this.locators.css.searchResultList))
        return resultList
    }
 
    getMatchedResults = async function(resultList,position){
        const matchedPositions = await resultList.all(by.xpath(`//li[contains(@class, search-result__item) and contains(string(),"${position}") ]`))
        return matchedPositions
    }
    getLocation=async function(result){
        const location = await element(by.css(this.locators.css.searchResultLocation)).getText()
        return location
    }

}

