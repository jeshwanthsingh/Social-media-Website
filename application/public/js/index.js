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
  
  
    } catch (error) {
      console.log(error);
    }
}
