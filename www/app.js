console.log("geht ja");

$(document).ajaxError(function(e, jqxhr, settings, exception){
    alert(settings.url, " nicht erreichbar");
    console.log(e, exception);
});

var domistda = 0;
var linien = {};

var ladeLinien = function(){
    domistda++;
    if (domistda < 2) {return};
    console.log("lade linien first time")
    $.ajax({
        url:'http://wifi.1av.at/527/ubahnen.php',
        method:'POST',
        contentType: 'application/text',
        data:{},
        dataType:'json',
        success:function(result){
            linien = result;
            setLinien();
        }
   })
}

var ladeEchtZeit = function(rbl){
    var rbls = ""
    for (i in rbl){
        rbls+= "rbl=" + rbl[i] + "&"
    }
    //console.log("rbls = ", rbls);


    $.ajax({
        url:"https://www.wienerlinien.at/ogd_realtime/monitor?" + rbls + "sender=LndqkyecPrAmUu5Q",
        method:'get',
        contentType: 'application/text',
        data:{},
        dataType:'json',
        success:function(result){
//            console.log(result);
            var data = result.data;
            // console.log("monitor" + data.monitors.length)
            // for (i=0;i<data.monitors.length;i++){
            //     console.log("lindes" + data.monitors[i].lines.length)
            //     for (j=0;j<data.monitors[i].lines.length;j++){
            //         console.log(data.monitors[i].lines[j])
            //     }
            // }
            //.lines[0].departures.departure[0].debpartureTime);
            //console.log(data.monitors[0].lines);
            // .monitors[i].lines[0].departures.departure[0].debpartureTime);

             // console.log(data.monitors[0].lines[0].departures.departure[0].departureTime)
             // console.log(data.monitors[0].lines[0].departures.departure[1].departureTime)
            // console.log(data);

        }
   })
}

//https://www.wienerlinien.at/ogd_realtime/monitor?rbl=4623&sender=LndqkyecPrAmUu5Q

var setLinien = function()
{
    var linie = '';
    for (i in linien){
        var haltestellen = [];
        linie = i;
        var ucolor;
        switch (linie){
            case 'U6':
                ucolor = '#9d6930';
                break;
            case 'U4':
                ucolor = '#009540';
                break;
            case 'U3':
                ucolor = '#ee7d00';
                break;
            case 'U2':
                ucolor = '#a762a3';
                break;
            case 'U1':
                ucolor = '#e20613';
                break;
        }
        //if (linie != "U6") {continue};
        //console.log(linien[i].id);
        for (j=0;j<linien[i].haltestellen.length;j++){
            setMarker(i, linien[i].haltestellen[j].lat, linien[i].haltestellen[j].lng, linien[i].haltestellen[j].name)

            var haltestelle = {lat : linien[i].haltestellen[j].lat, lng: linien[i].haltestellen[j].lng}
            haltestellen.push(haltestelle);
        }

        var UbahnPath = new google.maps.Polyline({
            path: haltestellen,
            geodesic: true,
            strokeColor: ucolor,
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        UbahnPath.setMap(karte);
    }
}

var setMarker = function(ubahn, steglat, steglon, halteort){
    var ort = {lat:steglat, lng:steglon}

    var image = {
        url:"../" + ubahn + ".jpg",
        size: new google.maps.Size(16, 16)
    }
    var marker = new google.maps.Marker({
        position: ort,
        map:karte,
        icon:image,
        label:halteort
    })

    marker.addListener('click', function() {
        console.log("click");
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        var clickHaltestellen = [];
        for (var i in linien){
            for (j=0;j<linien[i].haltestellen.length;j++){
                if (lat == linien[i].haltestellen[j].lat || lng == linien[i].haltestellen[j].lng){
                    clickHaltestellen.push(linien[i].haltestellen[j].steigH);
                    clickHaltestellen.push(linien[i].haltestellen[j].steigR);
                }
            }
        }
        showAbfahrten(clickHaltestellen);
    });
};

var showAbfahrten = function(rbl){
    ladeEchtZeit(rbl);
}



kartenoption = {
    center:{lat:48.1738010728644, lng:16.3898072745249},
    zoom:10
}
var karte;
var initMap = function(){
    karte = new google.maps.Map(document.getElementById("meineKarte"), kartenoption);
    ladeLinien();
}


document.addEventListener('deviceready', function(){

ladeLinien();

$('#get').on('click', function(){
    ladeEchtZeit("4625")
});


})
