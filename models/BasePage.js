const { browser } = require("protractor")
const locators = require("../locators/locators.json")
module.exports = class BasePage {
    constructor(url) {
        this.url = url
    }
    get = function () {
        browser.get(this.url)
        return this
    }
    click = async function (locator) {
        await browser.actions().mouseMove(element(locator)).perform();
        await browser.sleep(300)
        await browser.wait(ec.elementToBeClickable(element(locator)))
        await element(locator).click()
        return this
    }
    sendText = async function (locator, text) {
        await browser.actions().mouseMove(element(locator)).perform();
        const input = await element(locator)
        input.click()
        await input.clear()
        await input.sendKeys(text)
        return this
    }
    getTitle = async function () {
        return await browser.getTitle()
    }
    scrollIntoView = async function (locator) {
        await browser.executeScript(`document.querySelector("${locator.css}").scrollIntoView()`)
    }
    acceptCookie = async function () {
        await browser.wait(ec.presenceOf(element(by.css('.cookie-disclaimer__button'))))
        const button = element(by.css('.cookie-disclaimer__button'))
        button.click()
    }

    hasElement = async (el, locator) => {
        return await el.element(locator).isPresent();
    }



    isLoaded = async function () {
        await browser.wait(ec.visibilityOf(element(locators.footerLinks)))
        return element(locators.footerLinks).isPresent()
    }



}
