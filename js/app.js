
//hardcoded locations data
var locations = [
  new Location("King Saud University",24.716241,46.619108),
  new Location("King Fahad Library",24.685628,46.686504),
  new Location("Alhilal Football Club",24.605674,46.624572),
  new Location("King Khalid International Airport",24.959439,46.702620),
  new Location("Masmak Fort",24.631215,46.713380)
];

var markers=new Array();
var infowindows=new Array();
var map;

//Set All locations info from foursquare api at the begning
for(var i = 0; i<locations.length; i++){
  getLoactionInfo(locations[i].lat,locations[i].lng);
}

function initMap() {
        // Create a map object and specify the DOM element for display
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: {lat: 24.713552, lng: 46.675296}
        });
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
            infowindows.push(infowindow);
            element.addListener('click', function() {
            infowindows.forEach(function(item){
              item.close();
            });
            disapleInmation();
            element.setAnimation(google.maps.Animation.BOUNCE);
            //if(infowindow.getContent === "Cannot retrive the data")
              getLoactionInfo(element.getPosition().lat(),element.getPosition().lng());
           infowindow.open(map, element);
          });
    });

  }


ViewModel=function() {
  var self = this;
  self.filterInput = ko.observable();
  self.locations = ko.observable(locations);
  self.changeList = function(){
    if(self.filterInput())
    self.locations.forEach(function(item){
      if(!item.name.includes(self.filterInput())){
        item.show(false);
      }
      else {
          item.show(true);
      }
    });

  };

}


ko.applyBindings(new ViewModel());


// Create Location object by call new location(name,lat,lng);
 function Location(name,lat,lng){
      var self=this;

      self.name= name;
      self.lat = lat;
      self.lng = lng;
      self.show= ko.observable(true);
      self.info="";
}

// check lat and return index
  function getLocationIndex(lat){
    for(var i=0; i<locations.length; i++){
        if(locations[i].lat === lat)
          return i;
      }
  }
  // disapleInmation for all markers but the clicked one
  function disapleInmation(){
    markers.forEach(function(element){
      if (element.getAnimation() !== null)
            element.setAnimation(null);
    });
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
      //if sucsses request happen return info object
      .done(function( data ) {
          FormatInfo(lat,data);
      })
      .fail(function() {
        FormatInfo(lat,"Error");
        console.log("Cannot retrive the data");
        //info= "Cannot retrive the data ";
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
     // var address = (data.response.venues[0].location.address).toString();
      var info = "<ul><li><strong>";
          info += "Name: "+locations[index].name+"</b></li>";
          info += "<li>City: "+city+"</li>";
          info += "<li>Category: "+category+"</li><ul>";
          //  info+="<li>Address: "+address.toString()+"</li></ul>";
    }
    else {
      info = "Cannot retrive the data";
    }
    locations[index].info=info;
    infowindows[index].setContent(locations[index].info);
  }
