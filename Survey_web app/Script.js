console.log("Opening database...");

// Check if the browser supports IndexedDB
if (!window.indexedDB) {
    console.error("Your browser doesn't support IndexedDB.");
} else {
    // Function to open or create the IndexedDB database
    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("UserData", 1);

            request.onerror = function(event) {
                console.error("An error occurred with IndexedDB:", event.target.error);
                reject(event.target.error);
            };

            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                console.log("Upgrading database...");
                // Create the "formData" object store if it doesn't already exist
                if (!db.objectStoreNames.contains('formData')) {
                    console.log("Creating 'formData' object store...");
                    db.createObjectStore('formData', { keyPath: 'id', autoIncrement: true });
                } else {
                    console.log("Object store 'formData' already exists.");
                }
            };

            request.onsuccess = function(event) {
                const db = event.target.result;
                console.log("Database opened successfully.");
                resolve(db);
            };
        });
    }

    // Helper function to get the checked values of checkboxes
    function getCheckedValues(name) {
        const checkboxes = document.querySelectorAll('input[name="' + name + '"]:checked');
        const values = Array.from(checkboxes).map(checkbox => checkbox.value);
        return values;
    }

    // Helper function to get the value of the selected radio button
    function getRadioValue(name) {
        const radio = document.querySelector('input[name="' + name + '"]:checked');
        return radio ? radio.value : null;
    }

    // Validation function for form data
    function validateFormData(formData) {
        const fullName = formData.full_name.trim();
        const email = formData.email.trim();
        const dob = formData.dob.trim();
        const age = parseInt(formData.age);
        const contactNumber = formData.contact_number.trim();
        const favoriteFood = formData.favorite_food;
        const movies = formData.movies;
        const radio = formData.radio;
        const eatOut = formData.eat_out;
        const watchTV = formData.watch_tv;

        // Check if any field is empty
        if (
            fullName === '' ||
            email === '' ||
            dob === '' ||
            isNaN(age) ||
            contactNumber === '' ||
            favoriteFood.length === 0 ||
            movies === null ||
            radio === null ||
            eatOut === null ||
            watchTV === null
        ) {
            alert('Please fill out all fields.');
            return false;
        }

        // Check age range
        if (age < 5 || age > 120) {
            alert('Please enter a valid age between 5 and 120.');
            return false;
        }

        return true;
    }

    // Function to store form data in IndexedDB
    async function storeFormData(formData) {
        try {
            // Open the database
            const db = await openDatabase();

            // Start a new transaction to write data to the object store
            const transaction = db.transaction(['formData'], 'readwrite');
            transaction.onerror = function(event) {
                console.error("Transaction error:", event.target.error);
            };

            // Get the object store
            const store = transaction.objectStore('formData');
            store.onerror = function(event) {
                console.error("Object store error:", event.target.error);
            };

            // Add the form data to the object store
            const addRequest = store.add(formData);
            addRequest.onsuccess = function(event) {
                console.log("Form data stored successfully:", formData);
                // Optionally, display a success message to the user or redirect to another page
            };
            addRequest.onerror = function(event) {
                console.error("Error storing form data:", event.target.error);
                // Optionally, display an error message to the user
            };
        } catch (error) {
            console.error("Error storing form data:", error);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const userForm = document.getElementById('userForm');

        if (!userForm) {
            console.error("User form element not found");
            return;
        }

        userForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the default form submission
            
            // Collect form data
            const formData = {
                full_name: document.getElementById('full_name').value,
                email: document.getElementById('email').value,
                dob: document.getElementById('dob').value,
                age: document.getElementById('age').value,
                contact_number: document.getElementById('contact_number').value,
                favorite_food: getCheckedValues('favorite_food'),
                movies: getRadioValue('movies'),
                radio: getRadioValue('radio'),
                eat_out: getRadioValue('eat_out'),
                watch_tv: getRadioValue('watch_tv')
            };

            // Validate form data
            if (!validateFormData(formData)) {
                // If validation fails, return without storing the form data
                return;
            }

            // Store form data in IndexedDB
            await storeFormData(formData);

            // Alert user that the form is submitted
            alert('Form submitted successfully!');
        });
    });
}
