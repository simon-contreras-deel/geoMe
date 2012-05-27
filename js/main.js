(function ($) {
	
	/*
	 * geoMe Object
	 */
	var geoMe = $.mobile.geoMe = {
			
		map : "",
		map2 : "",
		panorama : "",
		userPosition : "",
		
		init : 	function(){
			
			$(document).bind('pageinit', function() {
								
				$('#savePos').live('click', function(){
					geoMe.saveUserPosition();
					$().toastmessage('showSuccessToast', "Place saved!");
				});
				
				$('#toggleSV').live('click', function(){
					googleMap.toggleStreetView();
				});	
			});
			
			$('#save').live('pageshow',function(){
				googleMap.savePositionMap();
			});
			
			$('#see').live('pageshow',function(){
				geoMe.userPosition = storage.getData('posSaved');
				googleMap.loadPositionMap();
			});
		},
		
		saveUserPosition : function(){
			//save position
			var posCoords = { 	latitude: geoMe.userPosition.coords.latitude,
								longitude: geoMe.userPosition.coords.longitude }
			storage.setData('posSaved', posCoords);
		},
		
		getUserPosition : function() {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					geoMe.userPosition = position;
				});
			} else {
				$().toastmessage('showErrorToast', "Your browser doesn\'t support geolocation. You can\'t use geoMe. Sorry");
			}
		}
	};
	
		
	/*
	 * Google Map Object
	 */
	var googleMap = {
		
		savePositionMap : function(){
			var options = {
					zoom: 18,
					mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			geoMe.map = new google.maps.Map(document.getElementById('map_canvas'), options);

			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude,
													 position.coords.longitude);
					geoMe.userPosition = position;

					var marker = new google.maps.Marker({
						position: pos, 
						map: geoMe.map,
						icon: './css/images/person.png',
						animation: google.maps.Animation.DROP
					});

					geoMe.map.setCenter(pos);

				}, function() {
					googleMap.handleNoGeolocation(true);
				});
			} else {
				// Browser doesn't support Geolocation
				googleMap.handleNoGeolocation(false);
			}
		},
		
		
		loadPositionMap : function(){
			
			var options = {
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			geoMe.map2 = new google.maps.Map(document.getElementById('map_canvas2'),	options);
			
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos2 = new google.maps.LatLng(position.coords.latitude,
													  position.coords.longitude);
					geoMe.userPosition = position;

					var marker = new google.maps.Marker({
						position: pos2, 
						map: geoMe.map2,
						icon: './css/images/person.png',
						animation: google.maps.Animation.DROP
					});      
				}, function() {
					googleMap.handleNoGeolocation(true);
				});
			} else {
				// Browser doesn't support Geolocation
				googleMap.handleNoGeolocation(false);
			}

			if(storage.getData('posSaved') == null){
				$().toastmessage('showWarningToast', "You must to save a position before!!");
			} else {
				var pos = new google.maps.LatLng(geoMe.userPosition.latitude,
												geoMe.userPosition.longitude);
				var marker = new google.maps.Marker({
					position: pos, 
					map: geoMe.map2,
					icon: './css/images/car.png',
					animation: google.maps.Animation.DROP
				});

				panorama = geoMe.map2.getStreetView();
				var streetPos = pos;
				panorama.setPosition(streetPos);
				panorama.setPov({
					heading: 265,
					zoom:1,
					pitch:0}
				);
			}
			
			geoMe.map2.setCenter(pos);
		},
		
		handleNoGeolocation : function(errorFlag) {
			if (errorFlag) {
				var content = 'Error: The Geolocation service failed.';
				$().toastmessage('showErrorToast', "Error: The Geolocation service failed.");
			} else {
				var content = 'Error: Your browser doesn\'t support geolocation. You can\'t use geoMe. Sorry.';
				$().toastmessage('showErrorToast', "Your browser doesn\'t support geolocation. You can\'t use geoMe. Sorry");
			}
			var mapError;
			var options = {
					map: mapError,
					position: new google.maps.LatLng(60, 105),
					content: content
			};

			var infowindow = new google.maps.InfoWindow(options);
			mapError.setCenter(options.position);
		},
		
		toggleStreetView : function() {
			var toggle = panorama.getVisible();
			if (toggle == false) {
				panorama.setVisible(true);
			} else {
				panorama.setVisible(false);
			}
		}

	};
	
	
	/*
	 * Storage Object
	 */
	var storage = {
		setData : function(name, obj){
			window.localStorage.setItem(name, storage.doJSON(obj));
		},
		getData : function(name){
			return storage.parseJSON(window.localStorage.getItem(name));
		},
		
		doJSON : function(obj) {
			return JSON.stringify(obj);
		},
		
		parseJSON : function(data){
			return JSON.parse(data);
		}
	};
	
	geoMe.init();
	
})(jQuery);