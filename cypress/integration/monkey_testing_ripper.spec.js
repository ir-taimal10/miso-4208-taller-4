describe('Los estudiantes under monkeys', function () {
    it('visits los estudiantes and survives monkeys', function () {
        cy.visit('https://losestudiantes.co');
        cy.contains('Cerrar').click();
        cy.wait(1000);
        randomEvent(15);
        // randomClick(10);
    })
});


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function randomClick(monkeysLeft) {
    if (monkeysLeft > 0) {
        cy.get('a').then($links => {
            const randomLink = $links.get(getRandomInt(0, $links.length));
            if (!Cypress.dom.isHidden(randomLink)) {
                cy.wrap(randomLink).click({force: true});
                monkeysLeft = monkeysLeft - 1;
            }
            setTimeout(randomClick, 1000, monkeysLeft);
        });
    }
}

function randomEvent(monkeysLeft) {
    if (monkeysLeft > 0) {
        console.log(`monkeysLeft : ${monkeysLeft}`);
        const randomEventId = getRandomInt(0, 4);
        let event;
        console.log(`randomEventId : ${randomEventId}`);
        switch (randomEventId) {
            case 0:
                event = randomLinkClickEvent(monkeysLeft);
                break;
            case 1:
                event = randomTypeEvent(monkeysLeft);
                break;
            case 2:
                event = randomSelectEvent(monkeysLeft);
                break;
            case 3:
                event = randomButtonClickEvent(monkeysLeft);
                break;
        }

        event.then(ml => {
            cy.wait(1000);
            randomEvent(ml);
        }).catch(err => console.log(err));
    }
}


function randomSelectEvent(monkeysLeft) {
    return new Promise((resolve, reject) => {
       // it('Link Click Event', function () {
            try {
                cy.get('select')
                    .then($selects => {
                        const randomSelect = $selects[getRandomInt(0, $selects.length)];
                        const randomOption = randomSelect.options[getRandomInt(0, randomSelect.options.length)].value;

                        if (!Cypress.dom.isHidden(randomSelect)) {
                            console.log(`-> Selected option = ${randomOption}`);
                            cy.wrap(randomSelect).select(randomOption, {force: true});
                            monkeysLeft = monkeysLeft - 1;
                        }
                        resolve(monkeysLeft);
                    });
            } catch (err) {
                resolve(monkeysLeft);
            }
        //});
    });
}

function randomButtonClickEvent(monkeysLeft) {
    return new Promise((resolve, reject) => {
       // it('Link Type Event', function () {
            cy.get('button').then($buttons => {
                const randomButton = $buttons.get(getRandomInt(0, $buttons.length));
                if (!Cypress.dom.isHidden(randomButton)) {
                    cy.wrap(randomButton).click({force: true});
                    monkeysLeft = monkeysLeft - 1;
                }
                resolve(monkeysLeft);
            });
        //});
    });
}

function randomTypeEvent(monkeysLeft) {
    return new Promise((resolve, reject) => {
        //it('Select Event', function () {
            try {
                cy.get('input[type="text"]')
                    .then($inputs => {
                        const randomInput = $inputs.get(getRandomInt(0, $inputs.length));

                        cy.wrap(randomInput).type('Pruebas Automáticas', {force: true});
                        monkeysLeft = monkeysLeft - 1;

                        resolve(monkeysLeft);
                    });
            } catch (err) {
                resolve(monkeysLeft);
            }
        //});
    });
}


function randomLinkClickEvent(monkeysLeft) {
    return new Promise((resolve, reject) => {
        //it('Button Click Event', function () {
            cy.get('a').then($links => {
                const randomLink = $links.get(getRandomInt(0, $links.length));
                if (!Cypress.dom.isHidden(randomLink)) {
                    cy.wrap(randomLink).click({force: true});
                    monkeysLeft = monkeysLeft - 1;
                }
                resolve(monkeysLeft);
            });
        //});
    });
}