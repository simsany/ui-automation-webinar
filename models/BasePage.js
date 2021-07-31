const { Builder, By, until } = require('selenium-webdriver')
const EC = require('protractor').ExpectedConditions;
module.exports = class BasePage {
    constructor() {
        this.get = function (url) {
            browser.get(url)
            return this
        }
        this.click = async function (locator) {
            await browser.executeScript(`document.querySelector("${locator}").scrollIntoView()`)
            element(by.css(locator)).click()
            return this
        }
        this.sendText = async function (locator, text) {
            const element = await element(locator)
            element.click()
            element.clear()
            element.sendKeys(text)
            return this
        }
        this.getTitle=async function (){
            return await browser.getTitle()
        }
    }
}
