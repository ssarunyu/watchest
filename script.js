// I don't even care what this but i almost reach 2 days about talk with chatGPT to get all this💀
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    const closeModal = document.getElementById("closeModal");

    if (modal) {
        // Show the modal when the page loads
        modal.style.display = "block";

        // Close the modal when the close button is clicked
        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    const csvFileInput = document.getElementById("csvFileInput");
    const loadCSV = document.getElementById("loadCSV") // CSV upload button
    let csvData = [];

    // Function to parse CSV data and populate the movie list
    function loadCSVData() {
        const movieList = document.getElementById("movieList");
        movieList.innerHTML = ""; // Clear existing content
    
        const groupedData = groupByTitle(csvData);
        const sortedData = sortData(groupedData);
    
        // Display only the top 3 titles
        const top3Titles = Object.keys(sortedData).slice(0, 3);
    
        // Initialize a movie counter
        let movieCounter = 1;
    
        for (const title of top3Titles) {
            const episodes = sortedData[title];
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");
            movieItem.innerHTML = `
                <h3>${movieCounter}. ${title}</h3>
                <p>${episodes.length} episode${episodes.length > 1 ? "s" : " long"}</p>
            `;
            movieList.appendChild(movieItem);
    
            // Increment the movie counter
            movieCounter++;
        }
        loadCSV.style.display = "none" // remove CSV upload button after upload file
    }

    // Event listener for file input change
    csvFileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;
            csvData = parseCSV(contents); // Parse the CSV data
            loadCSVData();
        };
        reader.readAsText(file);
    });

    // Function to parse CSV data
    function parseCSV(csv) {
        // Implement your CSV parsing logic here
        // You can use libraries like Papaparse or write your own parser
        // For simplicity, we'll split by lines and then split each line by commas
        return csv.split('\n').map(row => row.split(','));
    }

    // Function to group data by title
    function groupByTitle(data) {
        const groupedData = {};

        for (const row of data) {
            let title = row[0].trim(); // Remove leading and trailing spaces
            if (title.charAt(0) === '"') {
                title = title.substring(1); // Remove the starting double quote
            }

            // Remove the trailing double quote, if present
            if (title.charAt(title.length - 1) === '"') {
                title = title.substring(0, title.length - 1);
            }

            title = title.split(":")[0].trim();

            if (groupedData[title]) {
                groupedData[title].push(row);
            } else {
                groupedData[title] = [row];
            }
        }

        return groupedData;
    }

    // Function to sort data in descending order by the number of episodes
    function sortData(data) {
        const sortedData = {};

        // Filter out titles that are numbers
        const titles = Object.keys(data).filter(title => isNaN(title));

        // Sort the titles by the number of episodes
        titles.sort((a, b) => {
            const episodesA = data[a].length;
            const episodesB = data[b].length;
            return episodesB - episodesA;
        });

        // Add titles back to the sorted data
        for (const title of titles) {
            sortedData[title] = data[title];
        }

        return sortedData;
    }
});
