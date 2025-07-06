// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get references to the date inputs, button, and gallery
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Your NASA API key
const API_KEY = 'gG8dDRZ2Yyg8WeZcUuWxCSZmqGYUEwp5gMe2wOXk';

// Function to fetch and display images for the selected date range
function fetchAndDisplayImages() {
  // Get the selected start and end dates
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    return; // Do nothing if dates are not set
  }

  // Build the API URL using template literals
  // Add &thumbs=true to get thumbnails for videos
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&thumbs=true`;

  // Show loading message
  gallery.innerHTML = '<div class="loading-message">🔄 Loading space photos…</div>';

  // Fetch data from NASA's API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Sort data by date descending (most recent first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Clear the gallery (removes the placeholder and old images)
      gallery.innerHTML = '';

      // Loop through each item in the data array
      data.forEach(item => {
        // Create a new div for each item
        const entryDiv = document.createElement('div');
        entryDiv.className = 'apod-item';

        if (item.media_type === 'image') {
          // Show image
          entryDiv.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>${item.date}</p>
          `;
          entryDiv.addEventListener('click', () => openModal(item));
        } else if (item.media_type === 'video') {
          // Show video thumbnail if available, else a link
          if (item.thumbnail_url) {
            entryDiv.innerHTML = `
              <img src="${item.thumbnail_url}" alt="${item.title}" />
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;
            // On click, open the video in a new tab
            entryDiv.addEventListener('click', () => {
              window.open(item.url, '_blank');
            });
          } else {
            entryDiv.innerHTML = `
              <a href="${item.url}" target="_blank" rel="noopener noreferrer">Watch Video</a>
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;
          }
        }

        // Add the new div to the gallery
        gallery.appendChild(entryDiv);
      });

      // If no items were found, show a message
      if (gallery.children.length === 0) {
        gallery.innerHTML = '<p>No images or videos found for this date range.</p>';
      }
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = '<p>Sorry, something went wrong. Please try again.</p>';
      console.error(error);
    });
}

// When the button is clicked, run this function
getImagesButton.addEventListener('click', fetchAndDisplayImages);

// Fetch and display images as soon as the date inputs are set (on page load)
window.addEventListener('DOMContentLoaded', () => {
  // If both dates are already set (by setupDateInputs), fetch images
  if (startDateInput.value && endDateInput.value) {
    fetchAndDisplayImages();
  }
});

// Array of fun space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has the shortest day of all the planets.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? Space is completely silent.",
  "Did you know? The Sun makes up 99.86% of the mass in the solar system.",
  "Did you know? There may be a planet made of diamonds."
];

// Function to show a random fact
function showRandomFact() {
  // Pick a random index
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  // Get the fact
  const fact = spaceFacts[randomIndex];
  // Find or create the fact section
  let factSection = document.getElementById('spaceFact');
  if (!factSection) {
    factSection = document.createElement('div');
    factSection.id = 'spaceFact';
    factSection.className = 'space-fact';
    // Insert above the gallery
    const container = document.querySelector('.container');
    const filters = document.querySelector('.filters');
    container.insertBefore(factSection, filters.nextSibling);
  }
  // Set the fact text
  factSection.textContent = fact;
}

// Show a random fact when the page loads
showRandomFact();

// Example function to display images and videos in the gallery
function displayGallery(items) {
  // Get the gallery element
  const gallery = document.getElementById('gallery');
  // Clear the gallery
  gallery.innerHTML = '';

  // Loop through each item (image or video)
  items.forEach(item => {
    // Create a container for each entry
    const entryDiv = document.createElement('div');
    entryDiv.className = 'gallery-entry';

    // Check if the item is an image or a video
    if (item.media_type === 'image') {
      // Create an image element
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      img.className = 'gallery-image';
      // Store details for the modal in data attributes
      img.setAttribute('data-image', item.hdurl || item.url);
      img.setAttribute('data-title', item.title);
      img.setAttribute('data-date', item.date);
      img.setAttribute('data-explanation', item.explanation);
      // Add the image to the entry
      entryDiv.appendChild(img);
    } else if (item.media_type === 'video') {
      // If it's a YouTube video, embed it
      if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Create an iframe for YouTube videos
        const iframe = document.createElement('iframe');
        iframe.src = item.url.replace('watch?v=', 'embed/'); // Convert to embed URL
        iframe.width = '100%';
        iframe.height = '315';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        entryDiv.appendChild(iframe);
      } else {
        // For other videos, show a clickable link
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Watch Video';
        link.style.display = 'block';
        link.style.margin = '1rem 0';
        entryDiv.appendChild(link);
      }
      // Add title and explanation for videos
      const title = document.createElement('h3');
      title.textContent = item.title;
      entryDiv.appendChild(title);

      const date = document.createElement('p');
      date.textContent = item.date;
      entryDiv.appendChild(date);

      const explanation = document.createElement('p');
      explanation.textContent = item.explanation;
      entryDiv.appendChild(explanation);
    }

    // Add the entry to the gallery
    gallery.appendChild(entryDiv);
  });
}

// Get modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.getElementById('closeModal');

// Function to open the modal with image details
function openModal(item) {
  modalImage.src = item.url;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;
  modal.style.display = 'block';
}

// Function to close the modal
function hideModal() {
  modal.style.display = 'none';
}

// Close modal when the close button is clicked
closeModal.addEventListener('click', hideModal);

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});
