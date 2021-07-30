const { element, browser } = require('protractor')
const CareerPage = require('../../models/CareerPage.js')
const careerPageUrl = "https://careers.epam.hu/"
const expect = require('chai').expect;
const EC = protractor.ExpectedConditions;
const write = require('fs').writeFile
 /*megpróbáltam kicsit saját elképzelés szerint POM-osra alakítani
   hááát... így sikerült*/
   
describe('Career page',function(){
    this.timeout(55000);
    before(function(){
        this.page = new CareerPage();
        })
    //after(function(){browser.close()})
   
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
    it('should load',async function () {
        await browser.get(careerPageUrl);
        expect(await this.page.isLoaded()).to.be.true;
     });

    it('search form should be reachable', async function () {
        const page = this.page;
        expect(await page.isJobApplyFormPresent()).to.be.true;
     });

     it('The location filter box should contain City', async function () {
        const page = this.page;
        await page.click(page.locators.css.locationSearch);
        browser.wait(EC.presenceOf(element(by.css(page.getCitySelector("Debrecen")))), 5000);
        const isCityPresent = await element(by.css(page.getCitySelector("Debrecen"))).isPresent();
        expect(isCityPresent).to.be.true;
        page.selectCity('Debrecen');
     });

     it('Should have a way to select a skill', async function () {
        const page = this.page;
        const isSkillSelectPresent = await element(by.css(page.locators.css.skills)).isPresent();
        expect(isSkillSelectPresent).to.be.true;
        const findBtn = await element(by.css(this.page.locators.css.findBtn));
        findBtn.click();
     });

     it('Should be able to select a specific skill', async function () {
      const page = this.page;
      page.selectSkill('Software Test Engineering')
      const findBtn = await element(by.css(this.page.locators.css.findBtn));
      findBtn.click();
   });

     it('Search result should contain the given position', async function () {
        const page = this.page;
        const resultList = await page.getResultList();
        this.matchedPositions = await page.getMatchedResults(resultList,'Lead Test Automation Engineer');
        expect(this.matchedPositions).has.length.greaterThan(0);
     });
     it('Every position should have correct location', async function () {
      const page = this.page;
      for (let element of this.matchedPositions){
          const location = await page.getLocation(element);
          expect(location.toUpperCase()).to.include('Debrecen'.toUpperCase());
      }
   });

     it('Every position should have an apply button', async function () {
        const page = this.page;
        for (let element of this.matchedPositions){
            const applyButton = await element.element(by.css(page.locators.css.applyBtn)).isPresent();
            expect(applyButton).to.be.true;
        }
     });
});