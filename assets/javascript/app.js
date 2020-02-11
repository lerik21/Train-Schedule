$(document).ready(function () {

  

    var firebaseConfig = {
        apiKey: "AIzaSyBvF00UrHFujqLov2D8aUTLmXxLeV8C42Q",
        authDomain: "click-counter-f668d.firebaseapp.com",
        databaseURL: "https://click-counter-f668d.firebaseio.com",
        projectId: "click-counter-f668d",
        storageBucket: "",
        messagingSenderId: "64085530920",
        appId: "1:64085530920:web:56b0193e7973eb03e5981d"
    };

    firebase.initializeApp(firebaseConfig);

    

    var database = firebase.database();
    var trainName = "";
    var trainDestination = "";
    var trainArrival = "";
    var trainFrequency = 0;

    

    function currentTime() {
        var current = moment().format('HH:mm');
        $("#current-time").html(current);
        setTimeout(currentTime, 1000);
    };

   

    $(".form-control").on("keyup", function () {
        var sSname = $("#train-name").val().trim();
        var sSdestination = $("#destination").val().trim();
        var sSarrival = $("#train-time").val().trim();
        var sSfrequency = $("#frequency").val().trim();

        sessionStorage.setItem("train", sSname);
        sessionStorage.setItem("desti", sSdestination);
        sessionStorage.setItem("time", sSarrival);
        sessionStorage.setItem("freq", sSfrequency);
    });

    $("#train-name").val(sessionStorage.getItem("train"));
    $("#destination").val(sessionStorage.getItem("desti"));
    $("#train-time").val(sessionStorage.getItem("time"));
    $("#frequency").val(sessionStorage.getItem("freq"));

    

    $("#submit").on("click", function (event) {

        event.preventDefault();


        if ($("#train-name").val().trim() === "" ||
            $("#destination").val().trim() === "" ||
            $("#train-time").val().trim() === "" ||
            $("#frequency").val().trim() === "") {

            alert("Please Finish The Form");

        } else {

            trainName = $("#train-name").val().trim();
            trainDestination = $("#destination").val().trim();
            trainArrival = $("#train-time").val().trim();
            trainFrequency = $("#frequency").val().trim();

            $(".form-control").val("");

           

            database
                .ref()
                .push({
                    trainName: trainName,
                    trainDestination: trainDestination,
                    trainArrival: trainArrival,
                    trainFrequency: trainFrequency
                });

           

            sessionStorage.clear();
        }

    });


    // Pull Info From Firebase And Display On Screen //
    database
        .ref()
        .on("child_added", function (snapshot) {

            let snapshotValue = snapshot.val();
            console.log(snapshotValue);

            var arrivalConverted = moment(snapshotValue.trainArrival, "HH:mm").subtract(1, "years");
            var timeDiff = moment().diff(moment(arrivalConverted), "minutes");
            var timeRemain = timeDiff % snapshotValue.trainFrequency;
            var minToArrival = snapshotValue.trainFrequency - timeRemain;
            var nextTrain = moment().add(minToArrival, "minutes");
            var key = snapshotValue.key;

            // Add New Row To Schedule //

            var newrow = $("<tr>");
            newrow.append($("<td>" + snapshotValue.trainName + "</td>"));
            newrow.append($("<td>" + snapshotValue.trainDestination + "</td>"));
            newrow.append($("<td class='text-center'>" + snapshotValue.trainFrequency + "</td>"));
            newrow.append($("<td class='text-center'>" + moment(nextTrain).format("HH:mm") + "</td>"));
            newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
            newrow.append($("<td class='text-center'><button class='delete btn btn-warning btn-xs' data-key='" + key + "'>	&#128465;</button></td>"));

            if (minToArrival < 6) {
                newrow.addClass("info");
            }

            $("#trainData").append(newrow);

        });

        
    $(document).on("click", function () {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();
    });

    currentTime();

    setInterval(function () {
        window.location.reload();
    }, 50000);

});