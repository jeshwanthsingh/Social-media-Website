async function fetchPhotos() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/albums/2/photos");
      const data = await response.json();
      const photoContainer = document.getElementById("photo-container");
      const photoCount = document.getElementById("photo-count");
  
      data.forEach((photo) => {
        const photoCard = buildCard(photo);
        photoContainer.appendChild(photoCard);
      });
  
        photoCount.textContent = `Number of photos: ${data.length}`;

    } catch (error) {
      console.log(error);
    }
}

function buildCard(data) {
    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "photo-card");


    const titleTag = document.createElement("p");
    titleTag.setAttribute("class", "photo-title");
    titleTag.appendChild(document.createTextNode(data.title));