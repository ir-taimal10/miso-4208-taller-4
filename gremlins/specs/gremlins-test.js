function loadScript(callback) {
    const s = document.createElement('script');
    s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
    if (s.addEventListener) {
        s.addEventListener('load', callback, false);
    } else if (s.readyState) {
        s.onreadystatechange = callback;
    }
    document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
    function stop() {
        horde.stop();
        callback();
    }

    let clicker = null;
    let formFiller = null;
    let toucher = null;
    let scroller = null;

    if (gremlins) {
        clicker = gremlins.species.clicker().clickTypes(['click']);
        clicker.canClick(function (element) {
            return (element.tagName === "A" || element.tagName === "BUTTON") && !element.hidden;
        });

        formFiller = gremlins.species.formFiller();
        formFiller.canFillElement(function (element) {
            console.log(element.type);
            return (
                element.tagName === "TEXTAREA" ||
                element.type === "text" ||
                element.type === "password" ||
                element.type === "email")
                && !element.hidden;
        });

        toucher = gremlins.species.toucher();
        toucher.canTouch(function (element) {
            return !element.hidden;
        });

        scroller = gremlins.species.scroller();

    }
    const horde = gremlins.createHorde()
        .gremlin(clicker)
        .gremlin(formFiller)
        .gremlin(toucher)
        .gremlin(scroller);

    horde.seed(1234);

    horde.strategy(gremlins.strategies.distribution()
        .delay(1)
        .distribution([0.7, 0.1, 0.1, 0.1])
    );

    horde.after(callback);
    window.onbeforeunload = stop;
    setTimeout(stop, ttl);
    horde.unleash();
}

browser.waitForReadyStateEx = function (state, timeout) {
    return browser.waitUntil(function () {
        return state === browser.execute(function () {
            return document.readyState;
        }).value;
    }, timeout);
};

describe('Monkey testing with gremlins ', function () {

    it('it should not raise any error', function () {
        browser.url('/');
        browser.click('button=Cerrar');

        browser.timeoutsAsyncScript(60000);
        browser.executeAsync(loadScript);

        browser.timeoutsAsyncScript(60000);
        browser.executeAsync(unleashGremlins, 50000);
    });

    afterAll(function () {
        browser.log('browser').value.forEach(function (log) {
            browser.logger.info(log.message.split(' ')[2]);
        });
    });

});
