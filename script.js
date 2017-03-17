/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var studentArray=[];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds="";
/**
 * addClicked - Event Handler when user clicks the add button // function is executed when add button is clicked..it will call addStudent and UpdatetudentList will also call clearAddStudentFOrm
 */
function addClicked(div){

}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form//calls clearAddStudentForm eh
 */

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */

/**
 * updateData - centralized function to update the average and call student list update // prob wanna call updateAvg
 */

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */ //this one calls addStudent, it cycles thru the list for new student, calls addStudent2Dom, adds to Dom...studentLsit knows how many students need to be added eh

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */


/**
 * Listen for the document to load and reset the data to the initial state
 */