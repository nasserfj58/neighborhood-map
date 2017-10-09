// function locationInfo(name,city,address,category){
//   this.name=name;
//   this.city=city;
//   this.address=address;
//   this.category=category;
// }

// this method will get the data from foursquare api, params for api:lat,lng,clientId
//clientSecret and v which is the date in (YYYYMMDD) format
function getLoactionInfo(lat,lng){
    var info="";
    //4
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
(function() {
  $.getJSON( url, {
      format: "json"
  })
    //if sucsses request happen return info object
    .done(function( data ) {
          //  console.log(data);
            var name = (data.response.venues[0].name).toString();
            var city = (data.response.venues[0].location.city).toString();
            var category = (data.response.venues[0].categories[0].name).toString();
            var address = (data.response.venues[0].location.address).toString();
            info="Name: "+name.toString();
            info+="City: "+city.toString();
            info+="Category: "+category.toString();
            info+="Address: "+address.toString();
           return info.toString();
    })
    .fail(function() {
      console.log("Cannot retrive the data");
      //info= "Cannot retrive the data ";
      return info.toString();
});
console.log(info.toString());

})();
  // console.log(info.toString());
  // return info.toString();
}
// Create Location object by call new location(name,lat,lng);
 function Location(name,lat,lng,info){
      var self=this;
      var info = await getLoactionInfo(lat,lng);
      self.name= name;
      self.lat = lat;
      self.lng = lng;
      self.show= ko.observable(true);
      self.info=info;
//       function(){
//         return
// };
}
//hardcoded locations which contain Latitude and Longitude for my fafuorite locations in Ryiadh
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
function initMap() {
        // Create a map object and specify the DOM element for display

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: {lat: 24.713552, lng: 46.675296}

        });
        var marker;
        for (var i = 0; i < locations.length; i++) {
              console.log(locations[i].info);
              var lat= locations[i].lat;
              var lng= locations[i].lng;
              var info=locations[i].info;

             marker =  new google.maps.Marker({
                     position: {lat,lng},
                     map: map,
                    animation: google.maps.Animation.DROP
                   });
            console.log(info);
             markers.push(marker);
            //var marker = new Marker(locations[i].lat,locations[i].lng,map);
        }(marker);
        console.log(markers);
    //
      // for(var i=0; i< markers.length; i++){
      //   markers[i].addListener('click', function() {
      //     var infowindow = new google.maps.InfoWindow({
      //         content: "what ever"
      //       });
      //     infowindow.open(map, markers[i]);
      //   });
      // }(markers[i]);
        markers.forEach(function(element) {
          var infowindow = new google.maps.InfoWindow({
            content:"what ever"
            });
            infowindows.push(infowindow);
            element.addListener('click', function() {
            infowindows.forEach(function(item){
              item.close();
            });
            disapleInmation();
            element.setAnimation(google.maps.Animation.BOUNCE);
           infowindow.open(map, element);
          });
    });

  }

 Marker = function(lat,lng,map){
   new google.maps.Marker({
          position: {lat, lng},
          map: map
        });
}
infowindow=function(info){

  var infowindow = new google.maps.InfoWindow({
      content: info
    });

}
function disapleInmation(){
  markers.forEach(function(element){
    if (element.getAnimation() !== null)
          element.setAnimation(null);
  });
}
// format location information for infowindow
function formatInfo(infoObject){

    var info="Name: "+infoObject.name+"</br>";
    info+="City: "+infoObject.city+"</br>"
    info+="Category: "+infoObject.category+"</br>"
    info+="Address: "+infoObject.address+"</br>"
}


ViewModel=function() {
  var self = this;
  //this.map = ko.observable(new map(-25.363,131.044));
  self.locations=ko.observableArray(
    );
  //self.autoLocationComplete=

  this.setNewMarker = function(){

 };
 this.render = function(vm) {
      ko.applyBindings(vm);
       //Here is my logic now

  //  self.map.render();


};
}
//var vm = new ViewModel();
//vm.render();
ko.applyBindings(new ViewModel());
//getLoactionInfo();
