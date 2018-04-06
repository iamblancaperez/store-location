var marker, map, infoWindow;
var iconUser = "https://cdn.iconscout.com/public/images/icon/free/png-32/google-logo-pin-social-media-395f8c930e3a9697-32x32.png";
var storeIcon = "https://cdn.iconscout.com/public/images/icon/free/png-32/google-my-business-shop-store-suit-service-marketplace-3fa051fbea573e9a-32x32.png"

function initMap() {
  var santiago = {
    lat: -33.4489,
    lng: -70.6693
  };

  infoWindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: santiago,
    zoom: 15,
    mapTypeId: 'roadmap',
    styles: styles
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: map,
        icon: iconUser,
        animation: google.maps.Animation.DROP
      });
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
  initSearch();
}

function displayStores() {
  var i;
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
      icon: storeIcon,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infoWindow.setContent(locations[i].name);
        infoWindow.open(map, marker);
      }
    })(marker, i));
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
