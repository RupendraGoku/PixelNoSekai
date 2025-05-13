const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBox.value;

    const url = `http://localhost:3000/api/search?query=${encodeURIComponent(keyword)}&page=${page}&per_page=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            console.error("Invalid data format received:", data);
            searchResult.innerHTML = `<p style="color:red;">No results found or an error occurred.</p>`;
            return;
        }

        if (page === 1) {
            searchResult.innerHTML = "";
        }

        const results = data.results;
        results.forEach((result) => {
            const container = document.createElement("div");
            container.style.marginBottom = "20px";

            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = result.alt_description || "Image";
            image.style.display = "block";
            image.style.maxWidth = "100%";

            const imageLink = document.createElement("a");
            imageLink.href = result.urls.full;
            imageLink.target = "_blank";
            imageLink.appendChild(image);

            // Use your backend download proxy with direct image URL (not the Unsplash download endpoint)
            const downloadButton = document.createElement("a");
            downloadButton.href = `http://localhost:3000/download?url=${encodeURIComponent(result.urls.full)}`;
            downloadButton.textContent = "Download";
            downloadButton.style.display = "inline-block";
            downloadButton.style.marginTop = "8px";
            downloadButton.style.padding = "6px 12px";
            downloadButton.style.backgroundColor = "#007BFF";
            downloadButton.style.color = "#fff";
            downloadButton.style.textDecoration = "none";
            downloadButton.style.borderRadius = "4px";

            container.appendChild(imageLink);
            container.appendChild(downloadButton);
            searchResult.appendChild(container);
        });

        showMoreBtn.style.display = "block";
    } catch (err) {
        console.error("Error fetching images:", err);
        searchResult.innerHTML = `<p style="color:red;">Failed to fetch images.</p>`;
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});
