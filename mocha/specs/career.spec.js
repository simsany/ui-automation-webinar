const { element, browser } = require('protractor')
const CareerPage = require('../../models/CareerPage.js')
const JobListingPage = require('../../models/JobListingPage.js')
const DatabaseMethods = require('../../database_scripts/database_methods.js')
const locators = require("../../locators/locators.json")
const expect = require('chai').expect;
const EC = protractor.ExpectedConditions;
const fs = require('fs-extra')
const write = require('fs').writeFile
const careerPage = new CareerPage()
const jobListingPage = new JobListingPage()
const dataBase = new DatabaseMethods()
let data 


//require('../datas/datas.json')
describe('Pages', () => {
    before(async() => {fs.emptyDirSync('screenshots');
    
    console.log("dsdsds")
    })
    //after(async ()=> await browser.close())
    
        data.forEach(data => {
        
            describe('Career page', function () {
                this.timeout(55000);
                before(async function () {
                    this.data = data
                    careerPage.get();
                    try {
                        await browser.wait(ec.visibilityOf((element(by.css('.cookie-disclaimer__button')))), 5000);
                        return await careerPage.acceptCookie();
                      }
                      catch (e) {
                        return console.warn("No accept cookie button!");
                      }
    
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
                        expect(careerPage.isLoaded()).eventually.to.be.true;
                    });
    
                it('search form should be reachable', async () => {
    
                        expect(element(locators.jobSearchForm).isPresent()).eventually.to.be.true;
                    });
    
                it('The location filter box should contain City', async()=>{
                        await browser.wait(EC.presenceOf(element(locators.locationSearch)), 5000);
                        await careerPage.click(locators.locationSearch);
                        expect(element(careerPage.citySelector(data.city)).isPresent()).eventually.to.be.true;
                        await careerPage.click(careerPage.countrySelector(data.country))
                        await careerPage.click(careerPage.citySelector(data.city))
                    });
    
                it('Should have a way to select a skill', async()=>{
                        expect(element(locators.skills).isPresent()).eventually.to.be.true;
                    });
    
                it('Should be able to select a specific skill', async () => {
                        await careerPage.click(locators.skills)
                        await careerPage.click(careerPage.skillLocator(data.skill));
                        const findBtn = await element(locators.find);
                        findBtn.click();
                    });
    
                it('Search result should contain the given position', async function(){
                    await browser.wait(EC.titleIs("Join our Team | EPAM Careers"), 5000);
                    await browser.wait(EC.presenceOf(element(locators.searchResultList)), 5000);
                    await browser.wait(EC.visibilityOf(element(by.cssContainingText('.search-result__item',data.position))),5000)
                    const resultList = await jobListingPage.getResultList();
                    this.matchedPositions = await jobListingPage.getMatchedResults(resultList, data.position);
                    expect(this.matchedPositions,`${data.city}\n${this.matchedPositions.length}`).has.length.greaterThan(0);
                });
    
                
                it('Every position should have correct location', async function(){
                    for (let element of this.matchedPositions) {
                        const location = await jobListingPage.getLocation(element);
                        expect(location.toUpperCase()).to.include(data.city.toUpperCase());
                    }
                });
    
                it('Every position should have an apply button', async function(){
                    for (let element of this.matchedPositions){
                        expect(jobListingPage.hasElement(element, locators.apply    )).eventually.to.be.true;
                    }
                });
    
            });
           
        });
    
    
   
})



