const app = document.getElementById('app');
const inputLat = document.getElementById('input-lat');
const inputLon = document.getElementById('input-lon');
const showButton = document.getElementById('form');
const addButton = document.getElementById('add-button');
const blocks = document.getElementById('blocks');

let store = {
    name: 'Novouralsk',
    lat: 57.2472,
    lon: 60.0956,
    count: 0,
    yesCount: 0,
    noCount: 0
}

const getData = async () => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${store.lat}&lon=${store.lon}&appid=c2126dfc37ee01e6373b08c10ed0a515`);
    const data = await result.json();
    console.log(data);
    if (data.message !== undefined){
        alert(data.message.toUpperCase() + '\nEnter the correct data')
    }

    const {
        main: {temp: temperature, feels_like: feelsLike,},
        weather: {0 :{description: text, icon: image}},
        wind: {speed: windSpeed},
        name,
        dt: timeNow,
        coord: {lat, lon},
        visibility,
        sys: {sunrise, sunset},
        clouds: {all: cloudcover}
    } = data;

    store = {
        ...store,
        lat, lon, name, temperature, feelsLike, cloudcover, windSpeed,
        visibility, image, text, sunrise, sunset, timeNow
    }

    store.count += 1;

    renderBlock();
}

const renderBlock = () => {
    blocks.innerHTML += markupBlock();
    console.log(store);
    if (store.isDay === 'yes')
        curBlock = document.getElementById(`yes${store.yesCount}`);
    else {
        curBlock = document.getElementById(`no${store.noCount}`);
    }
    curBlock.appendChild(document.createElement('script'));
}

const renderMap = () => {
    function init(){
        let map = new ymaps.Map(`map__${store.count}`, {
            center: [store.lat, store.lon],
            zoom: 9
        });
        let placemark = new ymaps.Placemark([store.lat, store.lon])
        map.geoObjects.add(placemark);
        map.controls.remove('geolocationControl');
        map.controls.remove('searchControl');
        map.controls.remove('trafficControl');
        map.controls.remove('typeSelector');
        map.controls.remove('fullscreenControl');
        map.controls.remove('zoomControl');
        map.controls.remove('rulerControl');
        map.behaviors.disable(['scrollZoom']);
    }
    ymaps.ready(init);
}

const handleInputLat = (inputData) => {
    store = {
        ...store,
        lat: inputData.target.value
    }
}

const handleInputLon = (inputData) => {
    store = {
        ...store,
        lon: inputData.target.value
    }
}

const handleSubmit = (click) => {
    click.preventDefault();
    form.style.display = 'none';
    app.style.display = 'flex';
    getData();
}

const onClickAddButton = () => {
    app.style.display = 'none';
    form.style.display = 'block';
}

const markupBlock = () => {
    if (store.timeNow > store.sunrise && store.timeNow < store.sunset){
        store.yesCount += 1
        store = {
            ...store,
            isDay: 'yes',
            id: `yes${store.yesCount}`
        }
    }

    else{
        store.noCount += 1
        store = {
            ...store,
            isDay: 'no',
            id: `no${store.noCount}`
        }
    }


    return `<div class="block__${store.isDay}" id="${store.id}">
                <h3 class="city">${store.name}</h3>
                <div class="temp-image">
                    <p class="deg">${Math.round(store.temperature - 273)}°</p>
                    <img src="http://openweathermap.org/img/w/${store.image}.png" class="image" alt="weather-icon">
                </div>
                <p class="text">${store.text.toUpperCase()}</p>
                
                <div class="params">
                    <div class="param-ws">
                        <p class="param-value">${Math.round(store.windSpeed)} M/S</p>
                        <p class="param-name">WIND SPEED</p>
                    </div>
                    <div class="param-cc">
                        <p class="param-value">${store.cloudcover}%</p>
                        <p class="param-name">CLOUDCOVER</p>
                    </div>
                    <div class="param-fl">
                        <p class="param-value">${Math.round(store.feelsLike - 273)}°</p>
                        <p class="param-name">FEELS LIKE</p>
                    </div>
                    <div class="param-v">
                        <p class="param-value">${store.visibility} M</p>
                        <p class="param-name">VISIBILITY</p>
                    </div>
                </div>
                
                <div id="map__${store.count}" style="width: 350px; height: 250px; background-image: url('https://infobus.by/staticmap?zoom=9&width=360&height=185&markers=57.253323,60.1192'); margin: 0 auto; margin-top: 20px">
                </div>
            </div>`

}

const markupMap = () => {
    return `<script src=https://api-maps.yandex.ru/2.1/?apikey=853eb3a4-b086-4232-83be-d710420a1a92&lang=en_EN"></script>`
}

inputLat.addEventListener('input', handleInputLat);
inputLon.addEventListener('input', handleInputLon);
showButton.addEventListener('submit', handleSubmit)
addButton.addEventListener('click', onClickAddButton);