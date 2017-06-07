$(document).ready(function () {

  $('#submit-search').on("click", function(event){
    // event.preventDefault();

    const city =$("#city").val().trim(); // grab city from input
    const state = $("#state").val().trim();// grab stae from input
    doAjax(config, city, state)
      .then(getVenueInfo)
      .then(function (info) {
        return info.map(venue => venue.id)
      })
      .then(buildPhotoUrl)
      .then(requestPhotos)
      // Also puts shit on page
      .then(getPhotoUrls)
      .catch(console.error)

    // do your state/ui updates herej

    // 2. Dump that into a <pre></pre> tag on the page w/ JSON.stringify(mappedData, null, 4)
  })

  // ===

  // create a config object that holds all 'permanent' information
  const config = {
    base_url: 'https://api.foursquare.com/v2',
    endpoint: 'venues',
    functionality: 'explore',
    client_id: 'CVPNGFU3BS4QLSNJUYEITIUAXWU3BLCE3B3GZ30NBAPRQMS2',
    client_secret: 'RA4WQVHK330LFHQRYFSEO1C0M5KJONNZQ1XJFX0QXIIKBSIK',
    format: 'foursquare',
    version: '20170101',
    venuePhotos: 1
  };


  // API Call #1
  // use encodeURIComponent to 'encode city and state and return result'
  function buildLocation (city, state) {
    city = encodeURIComponent(city);
    state = encodeURIComponent(state);
    // Template Strings
    return `${city},${state}`;
  }
  // calls buildLocation function and grabs returned result
  // creates the full URL used to make the API call
  function buildUrl(config, city, state) {
  const {base_url, endpoint, functionality, client_id, client_secret, version, venuePhotos} = config
  const location = buildLocation(city, state)
  return `${base_url}/${endpoint}/${functionality}?near=${location}&client_id=${client_id}&client_secret=${client_secret}&v=${version}&venuePhotos=${venuePhotos}`
  }


  // API call using 'fetch'
  // calls buildUrl function and grabs returned URL
  function doAjax(config, city, state) {
    const url = buildUrl(config, city, state)
    return fetch(url).then(function(response){
      return response.json();
    });
  };
  // ===


  //store JSON object response in a variable
  var data = doAjax(config, city, state)
  //Get venue name and rating and push to objWeWant
  function getVenueInfo (data) {
   const venueWrapperList = data.response.groups[0].items
   return venueWrapperList
            .map(venueWrapper => venueWrapper.venue)
            .map(venue => {
              return { name: venue.name, rating: venue.rating}
            })
 }
  // 0. venue ids :: take response -> [venueIds]
  // get venue ID
  function getVenueId (data) {
    const venueWrapperList = data.response.groups[0].items
    return venueWrapperList
             .map(venueWrapper => venueWrapper.venue)
             .map(venue => venue.id)
  }
  //store JSON object response in a variable
  var venueId = getVenueId(data)

  // Build function that puts together correct URL for 'photos' endpoint
  function buildPhotoUrl (venueId) {
    const {base_url, endpoint, client_id, client_secret, version} = config
    return photoURL = venueId
              .map(venueId => `${base_url}/${endpoint}/'+ ${venueId} +'/photos?client_id=${client_id}&client_secret=${client_secret}&v=${version}`)
  }
  // API call #2
  var urls = buildPhotoUrl(venueId)


  // Build function to make 2nd API call to 'photos' URL
  function requestPhotos(urls) {
  // const photoList = urls.response.photos[1].items
  return urls
          .map(url => fetch(url))
          // pluck off photo information
          .map(promise =>
            promise
              .then(response => response.json()
           ))
  }

  var photoPromises = requestPhotos(urls);

  function getPhotoUrls (photoPromises) {
    photoPromises
      .map(promise => promise.json()).then(photo => {
          // Use this to figure out which properties to pull off
          const url = photo.prefix + photo.suffix
          return url
        }).then((photoUrls) => {
          // use urls to build images for page or whatever
          photoUrls.forEach((url) => {
            // replace with your HTML/jQuery logic :)
            $(".wellDivContainer").append()
          })
        })
     }

});
