const CareerPage = require('./CareerPage.js')
const { browser, element } = require('protractor');
const locators = require("../locators/locators.json")
module.exports = class JobListingPage extends CareerPage{
    constructor() {
        super()
    }
    getSearchResults = async function(){
        return await element.all(locators.searchResults)
    }
    getResultList = async function(){
        const resultList = await element(locators.searchResultList)
        return resultList
    }
    getMatchedResults = async (resultList, position) => {
        const matchedPositions = await resultList.all(by.cssContainingText('.search-result__item', position));
        return matchedPositions;
    }
}

