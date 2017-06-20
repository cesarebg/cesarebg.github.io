var map;
//map function
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(25, 25),
        scrollwheel: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
    });
    var button = document.getElementById("sendinfo");
    button.addEventListener('click', function() {
        var getcountrycode = document.getElementById('country');
        var countrycode = getcountrycode.value;
        var getyear = document.getElementById('year');
        var year = getyear.value;
        var getindicator = document.getElementById('indicator');
        var indicator = getindicator.value;
        var url = 'https://api.worldbank.org/countries/' + countrycode + '/indicators/' + indicator + '?date=' + year + '&per_page=264&format=jsonp&prefix=Getdata';
        var query_url = url;

        var script = document.createElement('script');
        script.src = query_url;
        document.getElementsByTagName('head')[0].appendChild(script);
    });
}
//this function obtains GDP value and country ID
window.Getdata = function(data) {
    var country_gdp = data[1].map(function(item) {
        return {
            country: item.country.value,
            value: item.value,
            countryid: item.country.id
        }
    });

    for (i = 0; i < country_gdp.length; i++) {
        (function(country_info) {
            setTimeout(function() {
                processCountry(country_info);
            }, i);
        })(country_gdp[i])
    }
}

function processCountry(GDP_country_growth) {
    var getyear = document.getElementById('year');
    var year = getyear.value;
    var getindicator = document.getElementById('indicator');
    var indicator = getindicator.value;
    if (indicator === 'NY.GDP.MKTP.KD.ZG') {
        var contentString = '<h5>' + GDP_country_growth.country + '</h5>' + '<p>' + 'The GDP of ' + GDP_country_growth.country + ' grew ' + GDP_country_growth.value + '% ' + ' in ' + year + '</p>';

    } else if (indicator === 'DT.DOD.DECT.GN.ZS') {
        var contentString = '<h5>' + GDP_country_growth.country + '</h5>' + '<p>' + 'The total external debt stocks of ' + GDP_country_growth.country + ' was ' + GDP_country_growth.value + '% ' + ' of GNI in ' + year;
    }
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    var url_countries = 'https://api.worldbank.org/countries/' + GDP_country_growth.countryid + '?' + 'format=jsonp&prefix=Getdata1';
    var query_url_countries = url_countries;
    var script = document.createElement('script');
    script.src = query_url_countries;
    document.getElementsByTagName('head')[0].appendChild(script);
    Getdata1 = function(data) {
        var country_data = data[1].map(function(item) {
            return {
                country: item.name,
                longitude: item.longitude,
                latitude: item.latitude,
            }
        });
        var latLng = new google.maps.LatLng(country_data[0].latitude, country_data[0].longitude);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            contentString: contentString
        });
        marker.addListener('mouseover', function() {
            infowindow.setContent(this.contentString);
            infowindow.open(map, this);
            map.setCenter(this.getPosition());
        });
    }
}

function openmenu() {
    var topnavigation = document.getElementById("myTopnav");
    if (topnavigation.className === "topnav") {
        topnavigation.className += " responsive";
    } else {
        topnavigation.className = "topnav";
    }
}
