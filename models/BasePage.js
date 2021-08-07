const { Builder, By, until } = require('selenium-webdriver')
const EC = require('protractor').ExpectedConditions;
module.exports = class BasePage {
    constructor(url) {
        this.url=url
        this.get = function () {
            browser.get(this.url)
            return this
        }
        this.click = async function (locator) {
            await browser.executeScript(`document.querySelector("${locator.css}").scrollIntoView()`)
            element(locator).click()
            return this
        }
        this.sendText = async function (locator, text) {
            await browser.executeScript(`document.querySelector("${locator.css}").scrollIntoView()`)
            const input = await element(locator)
            input.click()
            await input.clear()
            await input.sendKeys(text)
            return this
        }
        this.getTitle=async function (){
            return await browser.getTitle()
        }
        this.scrollIntoView = async function(locator){
            await browser.executeScript(`document.querySelector("${locator.css}").scrollIntoView()`)
        }
        this.acceptCookie = async function(){
            await browser.wait(ec.presenceOf(element(by.css('.cookie-disclaimer__button'))))
           const button = element(by.css('.cookie-disclaimer__button'))
           button.click()
        }
    }
}
