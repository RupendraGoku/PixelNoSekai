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

        // Check if results exist
        if (!data.results || !Array.isArray(data.results)) {
            console.error("Invalid data format received:", data);
            searchResult.innerHTML = `<p style="color:red;">No results found or an error occurred.</p>`;
            return;
        }

        if (page === 1) {
            searchResult.innerHTML = "";
        }

        const results = data.results;
console.log(results);
        results.map((result) => {
            
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            searchResult.appendChild(imageLink);
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
