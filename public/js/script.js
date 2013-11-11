var latitude = 34.041195
  , longitude = -118.331518;

$(document).ready(function() {
   if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    }

  $('input').typeahead([
    {
      name: 'places'
    , valueKey: 'id'
    , remote: {
        url: '/autocomplete/'
      , replace: function(url, uriEncodedQuery) {
          return url + uriEncodedQuery + '?lat=' + latitude + '&lng=' + longitude;
        }
      }
    , template: [
        '<p class="distance">{{distance}}</p>'
      , '<p class="title">{{name}}</p>'
      , '<p class="description">{{address}}</p>'
      ].join('')
    , engine: Hogan 
    }
  ]);
});