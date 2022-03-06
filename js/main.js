//display assignments categorized by date
function get_home_assignments() {
  const name = $("#headerid").text();

  $.ajax({
    url: "/get_user_assignments",
    type: "POST",
    data: {
      name: name
    },
    datatype: "json",
    success: function(response) {
      var json = response;
      var parsed = JSON.parse(json);

      // loop through the assignments and add them to the table
      for (var i = 0; i < parsed.length; i++) {
        var date = parsed[i].date;
        var assignment = parsed[i].assignment;
        var courseID = parsed[i].courseID;

        //$("#" + date + "assignments").append("<td><input type='checkbox' id=" + assignment + "></td><td>" + courseID + " - " + assignment + "</td>");
        $("#" + date + "assignments").append("<td style='font-size: 20px'><input type='checkbox' id=" + assignment + " class=" + courseID + ">" + courseID + " - " + assignment + "</td>");
      }

      // delete td if checkbox is checked and remove the assignment from the database
      $("input[type=checkbox]").change(function() {
        var assignmentName = $(this).attr("id");
        //var date = $(this).parent().parent().attr("id");
        var courseID = $(this).attr("class");

        console.log(assignmentName);
        console.log(courseID);

        if ($(this).is(":checked")) {
          $.ajax({
            url: "/remove_assignment",
            type: "POST",
            data: {
              name: name,
              courseID: courseID,
              assignmentName: assignmentName,
            },
            datatype: "json",
            success: function(response) {
              //console.log("success");
            },
            error: function(response) {
              //console.log("error");
            },
          })
          //refresh page
          location.reload();
        }
      }
      );
    },
    error: function(response) {
      console.log("error")
    },
  })
}

// get the dates of the next seven days with zero in the date in YYYY-MM-DD format
function get_dates() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  
  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd;
  var dates = [];
  var datesWords = [];
  dates.push(today);

  for (var i = 1; i < 8; i++) {
    var date = new Date(today);
    date.setDate(date.getDate() + i);
    var dd = date.getDate();
    var mm = date.getMonth() + 1; 
    var yyyy = date.getFullYear();

    // convert month to string
    var monthString = mm;
    if (mm == 1) {
      monthString = "January";
    } else if (mm == 2) {
      monthString = "February";
    } else if (mm == 3) {
      monthString = "March";
    } else if (mm == 4) {
      monthString = "April";
    } else if (mm == 5) {
      monthString = "May";
    } else if (mm == 6) {
      monthString = "June";
    } else if (mm == 7) {
      monthString = "July";
    } else if (mm == 8) {
      monthString = "August";
    } else if (mm == 9) {
      monthString = "September";
    } else if (mm == 10) {
      monthString = "October";
    } else if (mm == 11) {
      monthString = "November";
    } else if (mm == 12) {
      monthString = "December";
    }

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    date = yyyy + '-' + mm + '-' + dd;
    dateWord = monthString + " " + dd;

    dates.push(date);
    datesWords.push(dateWord);
  }
  
  dates.shift();

  // add the dates to table as rows
  for (var i = 0; i < dates.length; i++) {
    var date = dates[i];
    var dateString = datesWords[i];
    $("#datesTable").append("<tr id=" + date + "><td>" + dateString + "</td></tr>");
    $("#datesTable").append("<tr id=" + date + "assignments" + "></tr>");
  }
}

function get_user_courses() {
  const name = $("#headerid").text();

  $.ajax({
    url: "/get_user_courses",
    type: "POST",
    data: {
      name: name
    },
    datatype: "json",
    success: function(response) {
      var json = response;
      var parsed = JSON.parse(json);

      var table = "<table class='table table-curved ui-helper-center' width='100%' align='center' id='courseTable'>";

      // loop through the courses and add them to the table
      for (var i = 0; i < parsed.length; i++) {
        var course = parsed[i];
        var courseID = course.courseID;

        table += "<tr id=" + courseID + "><td>" + courseID + "<button class='deletebtn btn btn-sm' style='background-color: Transparent' title='Delete' >" + "<img src='/images/trash.svg' alt='delete' width='16' height='16'>" + "</button>" + "</td></tr>";
        table += "<tr id=" + courseID + "assignments" + "></tr>";
        //table += "<table class='table table-curved ui-helper-center' width='90%' align='center' id="+ courseID +"><tr><th style='display:none;'scope='col'></th><th style='display:none;' scope='col'></th></tr>";
        //table += "<td id=" + courseID + "></td>";
      }

      table += "</table>"

      document.getElementById("coursesTable").innerHTML = table

      // Delete button function
      $(".deletebtn").click(function() {

        var row = $(this).closest("tr");
        var courseID = row.attr("id");

        const name = $("#headerid").text();

        var r = confirm("Are you sure you want to delete this course?");
        if (r == true) {
          $.ajax({
            url: "/remove_course",
            type: "POST",
            data: {
              name: name,
              courseID: courseID,
            },
            datatype: "json",
            success: function(response) {
              //console.log("success");
            },
            error: function(response) {
              //console.log("error");
            },
          })
          get_user_courses();
          get_user_assignments();
        }
      })

    },
    error: function(response) {
      console.log("error")
    },
  })
}

function get_user_assignments() {
  const name = $("#headerid").text();

  $.ajax({
    url: "/get_user_assignments",
    type: "POST",
    data: {
      name: name
    },
    datatype: "json",
    success: function(response) {
      var json = response;
      var parsed = JSON.parse(json);
      
      // look through the assignments and add to the tr with the courseID
      for (var i = 0; i < parsed.length; i++) {
        var assignment = parsed[i];
        var courseID = assignment.courseID;
        var assignmentName = assignment.assignment;
        var dueDate = assignment.date;

        // change the date from YYYY-MM-DD to mm-dd
        var date = dueDate.split("-");
        var month = date[1];

        // convert month to string
        var monthString = month;
        if (month == 1) {
          monthString = "January";
        } else if (month == 2) {
          monthString = "February";
        } else if (month == 3) {
          monthString = "March";
        } else if (month == 4) {
          monthString = "April";
        } else if (month == 5) {
          monthString = "May";
        } else if (month == 6) {
          monthString = "June";
        } else if (month == 7) {
          monthString = "July";
        } else if (month == 8) {
          monthString = "August";
        } else if (month == 9) {
          monthString = "September";
        } else if (month == 10) {
          monthString = "October";
        } else if (month == 11) {
          monthString = "November";
        } else if (month == 12) {
          monthString = "December";
        }

        var day = date[2];
        var newDate = monthString + " " + day;
        
        // append the assignment to the tr with the courseID
        $("#" + courseID + "assignments").append("<tr id=" + assignmentName + " class=" + courseID + " style='font-size:20px'><td><td><td>" + newDate + "</td><td>" + assignmentName + "</td><td>" + "<button class='deletebtn btn btn-sm' style='background-color: Transparent' title='Delete' >" + "<img src='/images/trash.svg' alt='delete' width='16' height='16'>" + "</button>" + "</td></tr>");
        
      }

      // Delete button function
      $(".deletebtn").click(function() {

        var row = $(this).closest("tr");
        var assignmentName  = row.attr("id");

        // Find the courseID of current row
        var courseID = row.attr("class");

        const name = $("#headerid").text();

        var r = confirm("Are you sure you want to delete this assignment?");
        if (r == true) {
          $.ajax({
            url: "/remove_assignment",
            type: "POST",
            data: {
              name: name,
              assignmentName: assignmentName,
              courseID: courseID,
            },
            datatype: "json",
            success: function(response) {
              //console.log("success");
            },
            error: function(response) {
              //console.log("error");
            },
          })
          get_user_courses();
          get_user_assignments();
        }
      });
    },
    error: function(response) {
      console.log("error")
    },
  })
}

function fill_select_with_courses() {
  const name = $("#headerid").text();

  $.ajax({
    url: "/get_user_courses",
    type: "POST",
    data: {
      name: name
    },
    datatype: "json",
    success: function(response) {
      var json = response;
      var parsed = JSON.parse(json);

      // loop through the courses and add them to the table
      for (var i = 0; i < parsed.length; i++) {
        var course = parsed[i];
        var courseID = course.courseID;

        $("#courses").append("<option value=" + courseID + ">" + courseID + "</option>");
      }
    },
    error: function(response) {
      console.log("error")
    },
  })
}

$(function() {
  $('input[type=text]').on('keypress', function(e) {
      if (e.which == 32)
          return false;
  });
});

$(document).ready(function() {
  get_user_courses();
  get_user_assignments();
  fill_select_with_courses();
  get_dates();
  get_home_assignments();
})
