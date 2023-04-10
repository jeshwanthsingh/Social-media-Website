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

    const imgTag = document.createElement("img");
    imgTag.setAttribute("class", "photo-img");
    imgTag.setAttribute("src", data.thumbnailUrl);

    const titleTag = document.createElement("p");
    titleTag.setAttribute("class", "photo-title");
    titleTag.appendChild(document.createTextNode(data.title));

    cardDiv.appendChild(imgTag);
    cardDiv.appendChild(titleTag);
    cardDiv.addEventListener("click", fadeOut);

  return cardDiv;
}

function fadeOut(event) {
    const target = event.currentTarget;
    let opacity = 1;

    const timer = setInterval(function () {
        if (opacity <= 0.1) {
          clearInterval(timer);
          target.remove();
          updatePhotoCount();
}
target.style.opacity = opacity;
opacity -= opacity * 0.1;
}, 50);
}

function updatePhotoCount() {
    const currentCount = document.getElementById("photo-container").childElementCount;
    const photoCount = document.getElementById("photo-count");
    photoCount.textContent = `Number of photos: ${currentCount}`;
  }
  
  fetchPhotos();