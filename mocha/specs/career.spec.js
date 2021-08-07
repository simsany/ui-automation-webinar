const { element, browser } = require('protractor')
const CareerPage = require('../../models/CareerPage.js')
const page = new CareerPage()
const expect = require('chai').expect;
const EC = protractor.ExpectedConditions;
const fs = require('fs-extra')
const write = require('fs').writeFile
/*megpróbáltam kicsit saját elképzelés szerint POM-osra alakítani
  hááát... így sikerült*/
const datas = require('../datas/datas.json')
describe('Pages', () => {
    before(() => {fs.emptyDirSync('screenshots');})
    //after(async ()=> await browser.close())
    datas.forEach(data => {
        
        describe('Career page', function () {
            this.timeout(55000);
            before(function () {
                this.data = data
                page.get();

            })
            afterEach(async function(){
                if (this.currentTest.state == 'failed') {
                    await browser.executeScript("document.body.style.zoom='30%'");
                    let image = await browser.takeScreenshot()
                    write(`screenshots/${new Date().toISOString().split('T')[0]}__${this.test.parent.title}__${this.currentTest.title}__${this.data.city}.png`, image, 'base64', (err) => {
                        if (err) { console.log(err); };
                    });
                }
            })
            it('should load', async () => {
                    expect(page.isLoaded()).eventually.to.be.true;
                });

            it('search form should be reachable', async () => {

                    expect(page.isCareerPresent("jobSearchForm")).eventually.to.be.true;
                });

            it('The location filter box should contain City', async()=>{
                    await browser.wait(EC.presenceOf(element(page.locators.locationSearch)), 5000);
                    await page.click(page.locators.locationSearch);
                    expect(page.isCareerPresent("citySelector", data.city)).eventually.to.be.true;
                    page.selectCity(data.city);
                });

            it('Should have a way to select a skill', async()=>{
                    expect(page.isCareerPresent("skills")).eventually.to.be.true;
                });

            it('Should be able to select a specific skill', async () => {

                    await page.selectSkill(data.skill);
                    const findBtn = await element(page.locators.findBtn);
                    findBtn.click();
                });

            it('Search result should contain the given position', async function(){
                await browser.wait(EC.titleIs("Join our Team | EPAM Careers"), 5000);
                await browser.wait(EC.presenceOf(element(page.locators.searchResultList)), 5000);
                const resultList = await page.getResultList();
                this.matchedPositions = await page.getMatchedResults(resultList, data.position);
                expect(this.matchedPositions,`${data.city}\n${this.matchedPositions.length}`).has.length.greaterThan(0);
            });

            
            it('Every position should have correct location', async function(){
                for (let element of this.matchedPositions) {
                    const location = await page.getLocation(element);
                    expect(location.toUpperCase()).to.include(data.city.toUpperCase());
                }
            });

            it('Every position should have an apply button', async function(){
                for (let element of this.matchedPositions){
                    expect(page.hasElement(element, page.locators.applyBtn)).eventually.to.be.true;
                }
            });

        });
       
    });
})



