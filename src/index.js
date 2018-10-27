class SmallData {

    constructor() {
        this.enableSelector();
        this.getEvents();
    }

    enableSelector() {
        document.addEventListener('DOMContentLoaded', function() {
            let elems = document.querySelectorAll('select');
            let instances = M.FormSelect.init(elems);
        });
    }

    httpGet(url) {
        return new Promise(function(resolve, reject) {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);

            xhr.onload = function() {
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    let error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.send();
        });
    }

    getList(response) {
        const template = document.querySelector('.event-list');
        const ul = document.createElement('ul');
        const data = JSON.parse(response);
        const fragment = document.createDocumentFragment();

        if (data.type === 'flat') {
            data.events.forEach(item => {
                let li = document.createElement('li');
                li.classList.add('event-list-item');
                li.innerHTML = `<a class="event-list-item-text">${item}</a>`;
                fragment.appendChild(li);
                return fragment;
            });
        } else {
            for (let firstLevel of data.events) {
                let li1 = document.createElement('li');
                li1.classList.add('event-list-item');
                li1.innerHTML = `<a class="event-list-item-text">${firstLevel.name}</a>`;
                ul.appendChild(li1);

                if (firstLevel.list) {
                    const ul2 = document.createElement('ul');

                    ul2.classList.add('second-level');
                    for (let secondLevel of firstLevel.list) {
                        let li2 = document.createElement('li');
                        li2.classList.add('event-list-item');
                        li2.innerHTML = `<a class="event-list-item-text">${secondLevel.name}</a>`;
                        ul2.appendChild(li2);
                        li1.appendChild(ul2);

                        if (secondLevel.list) {
                            const ul3 = document.createElement('ul');
                            ul3.classList.add('third-level');

                            for (let thirdLevel of secondLevel.list) {
                                let li3 = document.createElement('li');
                                li3.classList.add('event-list-item');
                                li3.innerHTML = `<a class="event-list-item-text">${thirdLevel}</a>`;
                                ul3.appendChild(li3);
                                li2.appendChild(ul3);
                            }
                        }
                    }
                }
            }
        }

        ul.appendChild(fragment);
        template.innerHTML = ul.innerHTML;

    }

    getEvents() {
        document.getElementById('source-choice').addEventListener('change', e => {
            const target = e.target;
            const option = target.options[target.selectedIndex].text.toLowerCase();
            const searchingBlock = document.querySelector('.searching-block');
            const template = document.getElementById('template');

            this.httpGet(`./${option}.json`)
                .then(response => {
                    this.getList(response);
                    template.style.visibility = 'inherit';
                    searchingBlock.style.display = 'block';
                })
                .catch(error => console.log(`Rejected: ${error}`));
        });

        document.getElementById('template').addEventListener('click', e => {
            const target = e.target;
            const resultBlock = document.querySelector('.result-block');
            const eventName = document.querySelector('.result-block-event');

            if (target.classList.contains('event-list-item-text')) {
                eventName.innerText = target.innerText;
                resultBlock.style.display = 'block';
            }
        });

        document.addEventListener('keyup', () => {
            const input = document.getElementById("search-input").value.toUpperCase();
            const ul = document.getElementById("search-list");
            const li = ul.getElementsByTagName("li");

            for (let i = 0; i < li.length; i++) {
                const a = li[i].getElementsByTagName("a")[0];
                if (a.innerHTML.toUpperCase().indexOf(input) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        });
    }

}

let smallData = new SmallData();