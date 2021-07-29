const { Builder, By, until } = require('selenium-webdriver')
module.exports = class BasePage {
    constructor() {
        this.driver = new Builder().forBrowser('chrome')
        this.By = By
        this.until = until
        this.get = function (url) {

            this.driver.get(url)
            return this
        }
        this.locate = async function (locator) {
            return await this.driver.wait(this.until.elementLocated(this.By.css(locator)), 10000)
    

        }
        this.click = async function (locator) {
            let element = this.locate(locator)
            const actions = this.driver.actions({ async: true });
            await actions.move({ origin: element }).click()
            await this.driver.executeScript("arguments[0].scrollIntoView(true);", element)
            actions.perform();
            return this
        }
        this.sendText = async function (locator, text) {
            let element = await this.locate(locator)
            element.click()
            element.sendKeys(text)
            return this
        }
    }
}
