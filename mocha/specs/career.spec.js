const { element, browser } = require('protractor')
const CareerPage = require('../../models/CareerPage.js')
const careerPageUrl = "https://careers.epam.hu/"
const expect = require('chai').expect;
const EC = protractor.ExpectedConditions;
const write = require('fs').writeFile
/*megpróbáltam kicsit saját elképzelés szerint POM-osra alakítani
  hááát... így sikerült*/
const datas = require('../datas/datas.json')
datas.forEach(data => {
    describe('Career page', function () {
        this.timeout(55000);
        before(function () {
            this.page = new CareerPage();
        })
        //after(function(){browser.close()})

        /* itt csak írtam egy kis függvényt hogy csináljon fotót
            majd a fájl útját meg a név megválasztást még át kell gondolni*/

        afterEach(async function () {
            if (this.currentTest.state == 'failed') {
                let image = await browser.takeScreenshot()
                write(`C:/api/out${Math.random()}.png`, image, 'base64', (err) => {
                    if (err) { console.log(err); };
                });
            }

        })
        it('should load', async function () {
            await browser.get(careerPageUrl);
            expect(await this.page.isLoaded()).to.be.true;
        });

        it('search form should be reachable', async function () {
            const page = this.page;
            const isFormPresent = await page.isCareerPresent("jobSearchForm")
            expect(isFormPresent).to.be.true;
        });

        it('The location filter box should contain City', async function () {
            const page = this.page;
            await page.click(page.locators.locationSearch);
            const isCityPresent = await page.isCareerPresent("citySelector", data.city)
            expect(isCityPresent).to.be.true;
            page.selectCity(data.city);
        });

        it('Should have a way to select a skill', async function () {
            const page = this.page;
            const isSkillSelectPresent = await page.isCareerPresent("skills")
            expect(isSkillSelectPresent).to.be.true;

        });

        it('Should be able to select a specific skill', async function () {
            const page = this.page;
            await page.selectSkill(data.skill)
            const findBtn = await element(this.page.locators.findBtn);
            findBtn.click();
        });

        it('Search result should contain the given position', async function () {
            const page = this.page;
            const resultList = await page.getResultList();
            this.matchedPositions = await page.getMatchedResults(resultList, data.position);
            expect(this.matchedPositions).has.length.greaterThan(0);
        });

        it('Every position should have correct location', async function () {
            const page = this.page;
            for (let element of this.matchedPositions) {
                const location = await page.getLocation(element);
                expect(location.toUpperCase()).to.include(data.city.toUpperCase());
            }
        });

        it('Every position should have an apply button', async function () {
            const page = this.page;
            for (let element of this.matchedPositions) {
                const applyButton = await page.hasElement(element, page.locators.applyBtn)
                expect(applyButton).to.be.true;
            }
        });
    });
});


