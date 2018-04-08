var marker, map, infoWindow;
var iconUser = "https://cdn.iconscout.com/public/images/icon/free/png-32/google-logo-pin-social-media-395f8c930e3a9697-32x32.png";
var storeIcon = "https://cdn.iconscout.com/public/images/icon/free/png-32/google-my-business-shop-store-suit-service-marketplace-3fa051fbea573e9a-32x32.png"
var user = {lat: -33.4489, lng: -70.6693} //Centered in Santiago, Chile
var key = 'AIzaSyBjKxnR3xzWWbL2yLALThtyXP9cg-WphwQ';

function initMap() {
  infoWindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: user,
    zoom: 13,
    mapTypeId: 'roadmap',
    styles: styles
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      user.lat = position.coords.latitude;
      user.lng = position.coords.longitude;

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(user.lat, user.lng),
        map: map,
        icon: iconUser,
        animation: google.maps.Animation.DROP
      });
      map.setCenter(user);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
  initSearch();
}

function findNearestStores(){
  var destinations = 'destinations';
  var origins = `origins=${user.lat},${user.lng}`
  for (var i = 0; i < locations.length; i++) {
    destinations += `${locations[i].lat},${locations[i].lng}`
    if (i < locations.length - 1){
      destinations += '|'
    }
  }
  var url = `https://maps.googleapis.com/maps/api/distancematrix/json?${origins}&${destinations}&key=${key}`;

  $.ajax({
    url: url,
    dataType: 'jsonp'
    data:{
      format: 'json'
    }
  }).done(function(res) {
    console.log(res);
  });
}

function displayStores() {
  var i;
  var origins = '';
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
      icon: storeIcon,
      animation: google.maps.Animation.DROP
    });

    origins += `${locations[i].lat},${locations[i].lng}`
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infoWindow.setContent(locations[i].name);
        infoWindow.open(map, marker);
      }
    })(marker, i));

    if (i < locations.length - 1){
      origins += '|'
    }
  }
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function initSearch(){
  document.getElementById('show-stores-btn').onclick = displayStores;
}
