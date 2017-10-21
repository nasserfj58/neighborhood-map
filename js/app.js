
var markers = [];
var infowindows = [];
var wantedMarkers = [];
var map;
var mapdiv = $('#map');

//hardcoded locations data
var locations = [
  new Location("King Saud University",24.716241,46.619108),
  new Location("King Fahad Library",24.685628,46.686504),
  new Location("Alhilal Football Club",24.605674,46.624572),
  new Location("King Khalid International Airport",24.959439,46.702620),
  new Location("Masmak Fort",24.631215,46.713380)
];

  // Create Location object by call new location(name,lat,lng);
   function Location(name,lat,lng){
        var self=this;

        self.name= name;
        self.lat = lat;
        self.lng = lng;
        self.show= ko.observable(true);
        self.info="";
  }

//this function is calledback when googlemaps is downloaded

ViewModel=function() {

  var self = this;

  self.filterInput = ko.observable();
  self.locations = ko.observable(locations);
  self.changeMarkers=function(location){
    //this will triger the click event on the marker without clicken it
      new google.maps.event.trigger( getMarker(location.lat), 'click' );
  };
  self.changeList = function(){
       var wantedMarker=null;
       self.locations().forEach(function(item){
         //check if thier is location with the same name or the user delete text
      if((item.name.toLocaleLowerCase().includes(self.filterInput().toLocaleLowerCase()))||(self.filterInput()==="")){

              item.show(true);

              wantedMarker = getMarker(item.lat);

              wantedMarkers.push(wantedMarker);

      }
      else {
          item.show(false);
      }
    });
    // in empty input case
    if(wantedMarkers.length === 0 && self.filterInput() === "" )
      wantedMarkers = markers;

    // set the shosen markers by the user
    setWantedMarkers();

  };
};

ko.applyBindings(new ViewModel());


// check lat and return index
  function getLocationIndex(lat){
    for(var i=0; i<locations.length; i++){
        if(locations[i].lat === lat)
          return i;
      }
  }

  // this method will get the data from foursquare api, params for api:lat,lng,clientId
  //clientSecret and v which is the date in (YYYYMMDD) format
  function getLoactionInfo(lat,lng){

    var clientId= "B0HPTMTZVY2KVHBWHY43WLKFUGDZQROSXVSF20SHHCFV01R4";
    var clientSecret= "N2TZ5PATB4FNEQLMO44JNYBYEKAM3IAPF5OOF0NQ15WUFXJE";
      //foursquare api needs YYYYMMDD as parameter
      var date = new Date();
      var day = date.getDate().toString();
      //+1 becuase months starts with 0
      var month = (date.getMonth()+1).toString();
      var year = date.getFullYear().toString();
      var url = "https://api.foursquare.com/v2/venues/search";
         url += "?ll="+lat+","+lng;
         url += "&client_id="+clientId;
         url += "&client_secret="+clientSecret;
         url+="&v="+year+month+day;

    $.getJSON( url, {
        format: "json"
    })
      //if sucsses request happen set object info
      .done(function( data ) {
          FormatInfo(lat,data);
      })
      //if fail request happen set object info to "Cannot retrive"
      .fail(function() {
        FormatInfo(lat,"Error");
  });
  }

  // format location information for infowindow and locationinfo
  function FormatInfo(lat,data){

    var index = getLocationIndex(lat);
    var info="";

    if(data !== "Error"){
      var name = (data.response.venues[0].name);
      var city = (data.response.venues[0].location.city);
      var category = (data.response.venues[0].categories[0].name);

          info = "<ul><li><strong>";
          info += "Name: "+locations[index].name+"</b></li>";
          info += "<li>City: "+city+"</li>";
          info += "<li>Category: "+category+"</li><ul>";
    }
    else {
      info = "<b>Cannot Retrive The Data</b>";
    }
    locations[index].info=info;
    infowindows[index].setContent(locations[index].info);
  }

  // Sets the map on all markers but the wanted one
  function setWantedMarkers() {

        for (var i = 0; i < markers.length; i++) {
          //hide all mrakers from the map
          markers[i].setMap(null);
        }
        wantedMarkers.forEach(function(item){
        if(item === null )
            return;
        //show the wanted markers in the map
          item.setMap(map);
        });
        //empty the wantedMarkers array, for the next filtering
        wantedMarkers.length=0;
   }
   //check the lat and return marker object
   function getMarker(lat){
     //console.log(markers[0]);
      if(typeof markers[0] ==='undefined')
          return null;

        for (var i = 0; i < markers.length; i++) {
             if(markers[i].getPosition().lat() === lat)
                return markers[i];
          }
}

// disapleInmation for all markers but the clicked one
function disapleInmation(){
  markers.forEach(function(element){
    if (element.getAnimation() !== null)
          element.setAnimation(null);
  });
}


function handleError(){

     mapdiv.text("");
     mapdiv.append('<div style=" margin:50px" class="alert alert-danger" role="alert"><strong>We are sorry!</strong> There is an Error with google map, Try Again Later.</div>');
}


function initMap() {

       // Create a map object and specify the DOM element for display
          map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: {lat: 24.713552, lng: 46.675296}
        });

        setMarkerInfoWindow();

}

function setMarkerInfoWindow(){
  var marker;
  for (var i = 0; i < locations.length; i++) {
      var lat= locations[i].lat;
      var lng= locations[i].lng;
      var info=locations[i].info;

     marker =  new google.maps.Marker({
             position: {lat,lng},
             map: map,
            animation: google.maps.Animation.DROP
          });
     markers.push(marker);
}(marker);

  markers.forEach(function(element) {
    var infowindow = new google.maps.InfoWindow({
    content:""
    });
    google.maps.event.addListener(infowindow,'closeclick',function(){
      //stop the marker if the info windo closed
      disapleInmation();
    });

    infowindows.push(infowindow);
    element.addListener('click', function() {
    infowindows.forEach(function(item){
        //close all infowindows if new marker clicked
      item.close();
    });
    disapleInmation();
    element.setAnimation(google.maps.Animation.BOUNCE);

    getLoactionInfo(element.getPosition().lat(),element.getPosition().lng());

   infowindow.open(map, element);
  });
});
}


$("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
