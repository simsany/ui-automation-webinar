const { WebElement,By } = require('selenium-webdriver')
const CareerPage = require('../models/CareerPage.js')
const careerPageUrl = "https://careers.epam.hu/"
const expect = require('chai').expect;
const write = require('fs').writeFile
 /*megpróbáltam kicsit saját elképzelés szerint POM-osra alakítani
   hááát... így sikerült*/
   
describe('Career page',function(){
    this.timeout(55000);
    before(function(){
        this.page = new CareerPage()
        this.driver = this.page.driver
        })
    after(function(){this.driver.close()})
   
    /* itt csak írtam egy kis függvényt hogy csináljon fotót
        majd a fájl útját meg a név megválasztást még át kell gondolni*/

    // afterEach(async function(){
    //     if(this.currentTest.state == 'failed'){
    //     let image = await this.driver.takeScreenshot()
    //     write(`C:/api/out${Math.random()}.png`, image, 'base64', (err) => {
    //             if (err) { console.log(err); };
    //         });
    //     }
        
    // })

    // itt az első verzió ahol kis lépésenként jönnek a tesztek
    it('should load',async function () {
        
        await this.driver.get(careerPageUrl)
        const findBtn = await this.page.locate(this.page.locators.css.findBtn)
        expect(findBtn).to.be.instanceOf(WebElement);
     });
    

    it('search form should be reachable', async function () {
        const page = this.page
        const form = await page.locate(page.locators.css.jobSearchForm)
        expect(form).to.be.instanceOf(WebElement);
     });

     it('The location filter box should contain City', async function () {
        const page = this.page
        const driver = this.driver
        await driver.get(careerPageUrl)
        page.click(page.locators.css.locationSearch)
        const city = await page.locate(page.getCitySelector("Debrecen"))
        expect(city).to.be.instanceOf(WebElement);
        city.click()
     });

     it('Should have a way to select a skill', async function () {
        const page = this.page
        const skills = await page.locate(page.locators.css.skills)
        expect(skills).to.be.instanceOf(WebElement);
        page.driver.executeScript(`document.querySelector("${page.getSkillLocator('Software Test Engineering')}").click()`)
        const findBtn = await this.page.locate(this.page.locators.css.findBtn)
        findBtn.click()
      
     });

     it('Search result should contain the given position', async function () {
        const page = this.page
        const resultList = await page.getResultList(page)
        this.matchedPositions = await page.getMatchedResults(resultList,'Lead Test Automation Engineer')
        expect(this.matchedPositions).has.length.greaterThan(0)
     });

     it('Every position should have an apply button', async function () {
        const page = this.page
        for (let element of this.matchedPositions){
            const location = await page.getLocation(element)
            const applyButton = await element.findElement(By.css(page.locators.css.applyBtn))
            expect(location.toUpperCase()).to.include('Debrecen'.toUpperCase())
            expect(applyButton).not.to.be.undefined
        }
     });



     // itt meg egyben elejétől végéig ez nem tűnik olyan szerencsésnek
     // de működik
     it.skip('End to end',async function(){
        const page = this.page
        const driver = this.driver
        await driver.get(careerPageUrl)
        const searchBtn = await page.locate(page.locators.css.findBtn)
        expect(searchBtn).to.be.instanceOf(WebElement);
        const form = await page.locate(page.locators.css.jobSearchForm)
        expect(form).to.be.instanceOf(WebElement);
        page.click(page.locators.css.locationSearch)
        const city = await page.locate(page.getCitySelector("Debrecen"))
        expect(city).to.be.instanceOf(WebElement);
        city.click()
        const skills = await page.locate(page.locators.css.skills)
        expect(skills).to.be.instanceOf(WebElement);
        page.driver.executeScript(`document.querySelector("${page.getSkillLocator('Software Test Engineering')}").click()`)
        searchBtn.click()
        const resultList = await page.getResultList(page)
        const matchedPositions = await page.getMatchedResults(resultList,'Lead Test Automation Engineer')
        expect(matchedPositions).has.length.greaterThan(0)
        for (let element of matchedPositions){
            const location = await page.getLocation(element)
            const applyButton = await element.findElement(By.css(page.locators.css.applyBtn))
            expect(location.toUpperCase()).to.include('Debrecen'.toUpperCase())
            expect(applyButton).not.to.be.undefined
        }
     })
});

    