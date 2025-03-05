function handleFormSubmit(event) {
    event.preventDefault();
    
    const userDetails = {
        username: event.target.username.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
    };

    // Check if we're editing an existing user
    if (event.target.dataset.userId) {
        // Update user if it's an edit (POST request)
        const userId = event.target.dataset.userId;
        axios
            .put(
                `https://crudcrud.com/api/5519d12fca344fd6b10665aea264519d/appointmentData/${userId}`,
                userDetails
            )
            .then((response) => {
                // After the update, display updated user on screen
                displayUserOnScreen(response.data);
                // Reset form after submission
                resetForm();
            })
            .catch((error) => console.log(error));
    } else {
        // Create new user (POST request)
        axios
            .post(
                "https://crudcrud.com/api/5519d12fca344fd6b10665aea264519d/appointmentData",
                userDetails
            )
            .then((response) => {
                displayUserOnScreen(response.data);
                resetForm();
            })
            .catch((error) => console.log(error));
    }
}

window.addEventListener("DOMContentLoaded", () => {
    // Fetch all users from the server when the page loads
    axios
        .get(
            "https://crudcrud.com/api/5519d12fca344fd6b10665aea264519d/appointmentData"
        )
        .then((response) => {
            // Display all users fetched from the server
            response.data.forEach((user) => displayUserOnScreen(user));
        })
        .catch((error) => console.log(error));
});

function deleteUser(userId, userElement) {
    axios
        .delete(
            `https://crudcrud.com/api/5519d12fca344fd6b10665aea264519d/appointmentData/${userId}`
        )
        .then((response) => {
            // After successful deletion from the server, remove from the screen
            userElement.remove();
            console.log("User deleted successfully");
        })
        .catch((error) => console.log(error));
}

function displayUserOnScreen(userDetails) {
    const userItem = document.createElement("li");
    userItem.setAttribute("data-id", userDetails._id); // Store the unique user ID

    userItem.appendChild(
        document.createTextNode(
            `${userDetails.username} - ${userDetails.email} - ${userDetails.phone}`
        )
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.appendChild(document.createTextNode("Delete"));
    userItem.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.appendChild(document.createTextNode("Edit"));
    userItem.appendChild(editBtn);

    const userList = document.querySelector("ul");
    userList.appendChild(userItem);

    // Event listener for the delete button
    deleteBtn.addEventListener("click", function (event) {
        const userId = userItem.getAttribute("data-id");
        deleteUser(userId, userItem); // Delete user from server and screen
    });

    // Event listener for the edit button
    editBtn.addEventListener("click", function (event) {
        const userId = userItem.getAttribute("data-id");
        document.getElementById("username").value = userDetails.username;
        document.getElementById("email").value = userDetails.email;
        document.getElementById("phone").value = userDetails.phone;

        // Set the user ID as a data attribute on the form for later reference
        document.getElementById("expense-form").dataset.userId = userDetails._id;

        // Remove the user from the screen (since we're editing)
        userItem.remove();

        // Make a DELETE request to remove the user from the server (old data)
        deleteUser(userDetails._id, userItem);
    });
}

// Function to reset the form after submit
function resetForm() {
    document.getElementById("expense-form").reset();
    delete document.getElementById("expense-form").dataset.userId; // Remove userId data attribute after reset
}

// Do not touch code below
module.exports = handleFormSubmit;
