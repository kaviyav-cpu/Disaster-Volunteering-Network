// ==========================================
// Admin Dashboard Functions
// ==========================================

function filterLogs() {
    const input = document.getElementById("logSearch").value.toUpperCase();
    const rows = document.getElementById("logTable").getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let text = rows[i].textContent || rows[i].innerText;
        rows[i].style.display =
            text.toUpperCase().indexOf(input) > -1 ? "" : "none";
    }
}


// ==========================================
// Home Page Audio Control Functions
// ==========================================

function playAudio() {
    const audio = document.getElementById("homeAudio");

    if (audio) {
        audio.play();
    }
}

function pauseAudio() {
    const audio = document.getElementById("homeAudio");

    if (audio) {
        audio.pause();
    }
}


// ==========================================
// Login Page Functions
// ==========================================

function togglePasswordVisibility(checkbox) {
    const passInput = document.getElementById("password");

    if (passInput) {
        passInput.type = checkbox.checked ? "text" : "password";
    }
}


// ==========================================
// NGO Dashboard Functions
// ==========================================

function initNgoCanvas() {
    const canvas = document.getElementById("ngoCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#0d9488";

        ctx.fillRect(10, 20, 40, 80);
        ctx.fillRect(60, 40, 40, 60);
        ctx.fillRect(110, 10, 40, 90);
    }
}

function addNewDeployment() {

    const name = prompt(
        "Enter Task Title:",
        "Emergency Water Supply"
    );

    if (name) {

        const table = document
            .getElementById("deploymentTable")
            .getElementsByTagName("tbody")[0];

        const newRow = table.insertRow();

        newRow.innerHTML =
            `<td>${name}</td>
             <td>0 / 5 Assigned</td>
             <td>
                <button
                    onclick="removeRow(this)"
                    style="
                        background:#ef4444;
                        color:white;
                        border:none;
                        padding:2px 8px;
                        border-radius:4px;
                        cursor:pointer;
                    ">
                    Close
                </button>
             </td>`;
    }
}

function removeRow(btn) {

    const row = btn.parentNode.parentNode;

    row.parentNode.removeChild(row);
}


// ==========================================
// Profile Page Functions
// ==========================================

function addSkill() {

    const skill = prompt(
        "Enter new skill certification:",
        "Shelter Logistics"
    );

    if (skill) {

        const container =
            document.getElementById("badgeContainer");

        if (container) {

            const newBadge =
                document.createElement("span");

            newBadge.className = "badge";
            newBadge.innerText = skill;

            container.appendChild(newBadge);
        }
    }
}


// ==========================================
// Registration Page Functions
// ==========================================

function handleRoleChange(selectElement) {

    const ngoField =
        document.getElementById("ngoRegField");

    if (ngoField) {

        if (selectElement.value === "ngo") {
            ngoField.style.display = "block";
        } else {
            ngoField.style.display = "none";
        }
    }
}

function handleRegisterSubmit(event) {

    event.preventDefault();

    alert("Registration successful! Please login.");

    window.location.href = "login.html";
}


// ==========================================
// Skill Task Matching Functions
// ==========================================

function filterBySkill(skill) {

    const audio =
        document.getElementById("matchSound");

    if (audio) {

        audio.play().catch(function(e) {
            console.log("Audio autoplay prevented");
        });
    }

    const tasks =
        document.getElementsByClassName("task-card");

    for (let task of tasks) {

        if (
            skill === "all" ||
            task.getAttribute("data-skill") === skill
        ) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    }
}


// ==========================================
// Task Details Functions
// ==========================================

function applyForTask() {

    const btn =
        document.getElementById("applyBtn");

    if (btn) {

        btn.innerText =
            "Application Submitted ✓";

        btn.style.backgroundColor =
            "#166534";

        btn.disabled = true;
    }
}

function playSpeed(speed) {

    const audio =
        document.getElementById("fieldBriefing");

    if (audio) {

        audio.playbackRate = speed;

        alert(
            `Audio playback set to ${speed}x`
        );
    }
}


// ==========================================
// Upload Proof Functions
// ==========================================

function updateOutput(val) {

    const output =
        document.getElementById("hourOutput");

    if (output) {
        output.value = val;
    }
}

function previewImage(event) {

    const reader = new FileReader();

    reader.onload = function() {

        const output =
            document.getElementById("imgPreview");

        if (output) {

            output.src = reader.result;
            output.style.display = "block";
        }
    };

    if (
        event.target.files &&
        event.target.files[0]
    ) {

        reader.readAsDataURL(
            event.target.files[0]
        );
    }
}

function handleUploadSubmit(event) {

    event.preventDefault();

    alert(
        "Verification proof submitted to coordinator!"
    );

    window.location.href =
        "volunteer-dashboard.html";
}


// ==========================================
// AngularJS Module
// ==========================================

var app = angular.module("myApp", []);


// ==========================================
// CUSTOM ANGULARJS DIRECTIVE
// ==========================================
// task-status
//
// Pending   -> ⚠ Pending
// Accepted  -> ✔ Accepted
// Completed -> ✓ Completed
// ==========================================

app.directive("taskStatus", function() {

    return {

        restrict: "A",

        link: function(scope, element) {

            scope.$watch(
                "task.status",
                function(status) {

                    // Remove the original
                    // {{task.status}} content
                    element.empty();


                    // ==========================
                    // ACCEPTED
                    // ==========================

                    if (status === "Accepted") {

                        element.text(
                            "✔ Accepted"
                        );

                        element[0].style.setProperty(
                            "background-color",
                            "#d4edda",
                            "important"
                        );

                        element[0].style.setProperty(
                            "color",
                            "#155724",
                            "important"
                        );
                    }


                    // ==========================
                    // PENDING
                    // ==========================

                    else if (status === "Pending") {

                        element.text(
                            "⚠ Pending"
                        );

                        element[0].style.setProperty(
                            "background-color",
                            "#fff3cd",
                            "important"
                        );

                        element[0].style.setProperty(
                            "color",
                            "#856404",
                            "important"
                        );
                    }


                    // ==========================
                    // COMPLETED
                    // ==========================

                    else if (status === "Completed") {

                        element.text(
                            "✓ Completed"
                        );

                        element[0].style.setProperty(
                            "background-color",
                            "#dbeafe",
                            "important"
                        );

                        element[0].style.setProperty(
                            "color",
                            "#1e40af",
                            "important"
                        );
                    }


                    // ==========================
                    // COMMON BADGE STYLE
                    // ==========================

                    element[0].style.setProperty(
                        "padding",
                        "5px 10px",
                        "important"
                    );

                    element[0].style.setProperty(
                        "border-radius",
                        "5px",
                        "important"
                    );

                    element[0].style.setProperty(
                        "display",
                        "inline-block",
                        "important"
                    );
                }
            );
        }
    };
});


// ==========================================
// AngularJS VALUE
// ==========================================

app.value(
    "organizationName",
    "Disaster Volunteering Network"
);


// ==========================================
// VOLUNTEER SERVICE
// ==========================================

app.service(
    "VolunteerService",
    function() {

        this.getVolunteer = function() {

            return {

                name:
                    localStorage.getItem(
                        "userName"
                    ) || "",

                email:
                    localStorage.getItem(
                        "userEmail"
                    ) || "",

                location:
                    "California, USA",

                skills: []
            };
        };
    }
);


// ==========================================
// PROFILE FACTORY
// ==========================================

app.factory(
    "ProfileFactory",
    function() {

        return {

            getSkill: function(profile) {

                return profile.skill;
            },

            getExperience: function(profile) {

                return profile.experience;
            }
        };
    }
);


// ==========================================
// REWARD FACTORY
// ==========================================

app.factory(
    "RewardFactory",
    function() {

        return {

            calculatePoints: function() {

                return 100;
            },

            checkEligibility: function(points) {

                return points >= 100
                    ? "Eligible"
                    : "Not Eligible";
            },

            generateBadge: function() {

                return "🏅 Disaster Volunteer Badge Generated";
            }
        };
    }
);


// ==========================================
// TASK FACTORY
// ==========================================

app.factory(
    "TaskFactory",
    function() {

        return {

            getTaskDetails: function() {

                return [

                    {
                        name: "Flood Relief",
                        status: "Pending"
                    },

                    {
                        name: "Medical Camp Support",
                        status: "Completed"
                    }
                ];
            },

            getTaskStatus: function(task) {

                return task.status;
            },

            assignVolunteer: function() {

                return "Volunteer Assigned";
            }
        };
    }
);


// ==========================================
// PROFILE SERVICE
// ==========================================

app.service(
    "ProfileService",
    function() {

        this.saveProfile = function(profile) {

            localStorage.setItem(
                "profileData",
                JSON.stringify(profile)
            );
        };
    }
);


// ==========================================
// TASK SERVICE
// ==========================================

app.service(
    "TaskService",
    function() {

        this.updateTaskStatus = function() {

            return "Task Updated";
        };
    }
);


// ==========================================
// NOTIFICATION SERVICE
// ==========================================

app.service(
    "NotificationService",
    function() {

        this.getNotification = function() {

            let notification =
                localStorage.getItem(
                    "notification"
                );

            return notification
                ? notification
                : "No new notifications";
        };


        this.sendNotification = function() {

            localStorage.setItem(
                "notification",
                "New task assigned successfully"
            );
        };
    }
);


// ==========================================
// PROFILE CONTROLLER
// ==========================================

app.controller(
    "ProfileController",
    function(
        $scope,
        organizationName,
        ProfileFactory,
        RewardFactory,
        TaskFactory,
        ProfileService,
        NotificationService
    ) {

        $scope.organizationName =
            organizationName;


        $scope.volunteer = {

            name:
                localStorage.getItem(
                    "userName"
                ),

            email:
                localStorage.getItem(
                    "userEmail"
                ),

            location: "",

            skill: "",

            experience: ""
        };


        // ==========================
        // EDIT PROFILE
        // ==========================

        $scope.editMode = false;


        $scope.editProfile = function() {

            $scope.editMode = true;
        };


        // ==========================
        // UPDATE PROFILE
        // ==========================

        $scope.updateProfile = function() {

            ProfileService.saveProfile(
                $scope.volunteer
            );

            $scope.editMode = false;

            alert(
                "Profile Updated Successfully"
            );
        };


        // ==========================
        // PROFILE FACTORY
        // ==========================

        $scope.getSkill = function() {

            return ProfileFactory.getSkill(
                $scope.volunteer
            );
        };


        $scope.getExperience = function() {

            return ProfileFactory.getExperience(
                $scope.volunteer
            );
        };


        // ==========================
        // REWARD FACTORY
        // ==========================

        $scope.points =
            RewardFactory.calculatePoints();


        $scope.eligibility =
            RewardFactory.checkEligibility(
                $scope.points
            );


        $scope.generateBadge = function() {

            $scope.badge =
                RewardFactory.generateBadge();
        };


        // ==========================
        // TASK FACTORY
        // ==========================

        $scope.tasks =
            TaskFactory.getTaskDetails();


        // ==========================
        // NOTIFICATION
        // ==========================

        $scope.checkNotification = function() {

            $scope.notification =
                NotificationService.getNotification();
        };


        // ==========================
        // ADD SKILL
        // ==========================

        $scope.addSkill = function() {

            var skill =
                prompt("Enter New Skill");

            if (skill) {

                if (!$scope.volunteer.skills) {
                    $scope.volunteer.skills = [];
                }

                $scope.volunteer.skills.push(
                    skill
                );
            }
        };

    }
);


// ==========================================
// TASK CONTROLLER
// ==========================================

app.controller(
    "TaskController",
    function(
        $scope,
        organizationName,
        TaskFactory,
        TaskService,
        NotificationService
    ) {

        $scope.organizationName =
            organizationName;


        // ==========================
        // TASK DATA
        // ==========================

        $scope.tasks = [

            {
                name: "Flood Relief",
                location: "Chennai",
                status: "Pending",
                button: "Accept Task"
            },

            {
                name: "Medical Support",
                location: "Coimbatore",
                status: "Pending",
                button: "Accept Task"
            },

            {
                name: "Food Distribution",
                location: "Madurai",
                status: "Completed",
                button: "Completed"
            }
        ];


        // ==========================
        // ACCEPT TASK
        // ==========================

        $scope.acceptTask = function(task) {

            task.status = "Accepted";

            task.button = "Accepted";


            // Task Service
            TaskService.updateTaskStatus();


            // Notification Service
            NotificationService.sendNotification();


            // Notification Sound
            let audio =
                document.getElementById(
                    "notificationSound"
                );

            if (audio) {

                audio.play().catch(
                    function(error) {

                        console.log(
                            "Audio playback prevented:",
                            error
                        );
                    }
                );
            }
        };


        // ==========================
        // CHECK NOTIFICATION
        // ==========================

        $scope.checkNotification = function() {

            $scope.notification =
                NotificationService.getNotification();
        };

    }
);


// ==========================================
// LOGIN CONTROLLER
// ==========================================

app.controller(
    "LoginController",
    function($scope) {

        $scope.email = "";

        $scope.password = "";

        $scope.message = "";


        $scope.login = function() {

            localStorage.setItem(
                "userEmail",
                $scope.email
            );


            localStorage.setItem(
                "userName",
                $scope.email.split("@")[0]
            );


            $scope.message =
                "Login Successful";


            const toast =
                document.getElementById("toast");


            if (toast) {

                toast.className = "show";
            }


            setTimeout(
                function() {

                    window.location.href =
                        "volunteer-dashboard.html";

                },
                1500
            );
        };

    }
);
