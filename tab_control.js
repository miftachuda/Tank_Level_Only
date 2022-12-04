const tabGroup = document.querySelector("tab-group");
tabGroup.on("ready", () => console.info("TabGroup is ready"));

tabGroup.setDefaultTab({
    title: "Wikipedia",
    src: "https://www.wikipedia.org/",
    active: true,
    closable: false
});
tabGroup.addTab({
    title: "Vibrasi Data",
    src: "tanklevelapp.html",
    active: true,
    closable: false,
    ready: function (tab) {
        tab.element.classList.add("my-custom-tab");
    }
});
tabGroup.addTab({
    title: "PLN & STG",
    src: "http://loc2power.surge.sh",
    closable: false,
    ready: function (tab) {
        tab.element.classList.add("my-custom-tab");
    }
});

tabGroup.addTab({
    title: "Vibrasi Data",
    src: "http://vibrator.surge.sh",
    closable: false,
    ready: function (tab) {
        tab.element.classList.add("my-custom-tab");
    }
});

