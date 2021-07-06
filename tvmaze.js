/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`);

  console.log(response.data)
  return response.data;

  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show in shows) {
    let imageFile = shows[show].show.image.original ? shows[show].show.image.original : "https://tinyurl.com/tv-missing"
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${shows[show].show.id}">
         <div class="card" data-show-id="${shows[show].show.id}">
         <img class="card-img-top" src="${imageFile}">
           <div class="card-body">
             <h5 class="card-title">${shows[show].show.name}</h5>
             <p class="card-text">${shows[show].show.summary}</p>
             <button onClick="handleClick(${shows[show].show.id})">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }))
  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(shows) {
  console.log(shows);
  let episodeArea = document.getElementById("episodes-area");
  episodeArea.style.display = "block";
  let episodeList = document.getElementById("episodes-list");
  episodeList.innerHTML = "";
  for (let episode of shows) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(episode.number + " - " + episode.name));
    episodeList.appendChild(li);
  }
}

async function handleClick(id) {
  let episodes = await getEpisodes(id);
  populateEpisodes(episodes);
}