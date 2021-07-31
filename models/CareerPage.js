const BasePage = require('./BasePage.js')
const {By,until} = require('selenium-webdriver');
const { browser } = require('protractor');
const EC = protractor.ExpectedConditions;
module.exports=class CareerPage extends BasePage {
    constructor() {
        super()
        this.locators = {
            
                locationSearch:{css:'.select2-selection__rendered'},
                skills :{css:'.multi-select-filter .selected-params'},
                findBtn: {css:'.recruiting-search__submit'},
                keyword: {css:'#new_form_job_search-keyword'},
                jobSearchForm:{css:'#jobSearchFilterForm'},
                searchResults: {css:'.search-result__item'},
                searchItemName: {css:'.search-result__item-name'},
                searchResultLocation: {css:'.search-result__location'},
                applyBtn: {css:'.search-result__item-apply'},
                searchResultList: {css:'.search-result__list'},
                countrySelector:     function(counry){
                    return {css:`li[aria-label='${counry}']`}
                },
                citySelector: function(city){
                    return {css:`option[value='${city}']`}
                },
                skillLocator: function(skill){
                    return {css:`input[data-value='${skill}']`}
                }
            }
        }
    
    isLoaded = async function(){
            const isFindBtnDisplayed = await element(this.locators.findBtn).isPresent()
            return isFindBtnDisplayed
    }
    isCareerPresent = async function(locatorName,attribute){
        const locator= this.locators[locatorName]
        const careerPresent =  attribute ? await element(locator(attribute)).isPresent():
                                await element(locator).isPresent()
        
        return careerPresent
    }
    

    getSearchResults = async function (){
        return await element.all(this.locators.searchResults)
    }
    getResultList = async function(){
        await browser.wait(EC.presenceOf(element(this.locators.searchResultList)), 5000);
        const resultList = await element(this.locators.searchResultList)
        return resultList
    }
    selectCity = async function(city){
        await browser.executeScript(`document.querySelector('option[value*="${city}"]').selected = true`)
    }

    selectSkill = async function(skill){
        browser.executeScript(`document.querySelector("${this.locators.skillLocator(skill).css}").click()`);
    }
    
 
    getMatchedResults = async function(resultList,position){
        const matchedPositions = await resultList.all(by.xpath(`//li[contains(@class, search-result__item) and contains(string(),"${position}") ]`))
        return matchedPositions
    }
    getLocation=async function(result){
        const location = await element(this.locators.searchResultLocation).getText()
        return location
    }
    hasElement = async function(el,locator){
        const containsElement = await el.element(locator).isPresent()
        return containsElement
    }
}

