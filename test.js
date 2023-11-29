const inputList =
    [
        {
            user: 'Haj',
            action: 'Pointage',
            restaurant: 'Walima Fribourg',
            time: '2023-11-23 15:31:29'
        },
        {
            user: 'Haj',
            action: 'Depointage',
            restaurant: 'Walima Fribourg',
            time: '2023-11-23 18:31:29'
        },
        {
            user: 'Khalil',
            action: 'Pointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-22 08:30:29'
        },
        {
            user: 'Khalil',
            action: 'Depointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-22 18:20:29'
        },
        {
            user: 'Khalil',
            action: 'Pointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-23 08:30:29'
        },
        {
            user: 'Khalil',
            action: 'Depointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-23 18:20:29'
        },
        {
            user: 'Khalil',
            action: 'Pointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-24 08:30:29'
        },
        {
            user: 'Khalil',
            action: 'Depointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-24 18:20:29'
        },
        {
            user: 'Khalil',
            action: 'Pointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-25 08:30:29'
        },
        {
            user: 'Khalil',
            action: 'Depointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-25 13:20:29'
        },
        {
            user: 'Khalil',
            action: 'Pointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-26 10:30:29'
        },
        {
            user: 'Khalil',
            action: 'Depointage',
            restaurant: 'Walima Payerne',
            time: '2023-11-26 15:20:29'
        },
        {
            user: 'Mourad',
            action: 'Pointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-22 08:30:29'
        },
        {
            user: 'Mourad',
            action: 'Depointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-22 18:20:29'
        },
        {
            user: 'Mourad',
            action: 'Pointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-23 08:30:29'
        },
        {
            user: 'Mourad',
            action: 'Depointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-23 18:20:29'
        },
        {
            user: 'Yakoub',
            action: 'Pointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-25 15:31:29'
        },
        {
            user: 'Yakoub',
            action: 'Depointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-25 15:32:21'
        },
        {
            user: 'Yakoub',
            action: 'Pointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-26 20:26:52'
        },
        {
            user: 'qsd',
            action: 'Pointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-25 15:43:44'
        },
        {
            user: 'qsd',
            action: 'Depointage',
            restaurant: 'Mio pizza Fribourg',
            time: '2023-11-25 17:30:47'
        }
    ]

//to do reduce records in case last not depointed ( currently working )
let parsedData = parseDataIntoNested(inputList);
let afterCalc = calculateTimeSpentForEach_User_Restaurant(parsedData);
let final = turnIntoDevelopedArray(afterCalc);
console.log(final);

function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}min ${remainingSeconds}sec`;
}

function parseDataIntoNested(inputList) {
    const nestedObject = {};
    inputList.forEach(item => {
        const { user, restaurant, action, time } = item;
        if (!nestedObject[user]) {
            nestedObject[user] = {};
        }
        if (!nestedObject[user][restaurant]) {
            nestedObject[user][restaurant] = {};
        }
        if (!nestedObject[user][restaurant][action]) {
            nestedObject[user][restaurant][action] = [];
        }
        nestedObject[user][restaurant][action].push(time);
    });
    return nestedObject;
}

function calculateTimeSpentForEach_User_Restaurant(allUsers) {
    Object.keys(allUsers).forEach(user => {
        let userRecord = allUsers[user];
        Object.keys(userRecord).forEach(restaurant => {

            let restaurantRecord = userRecord[restaurant];
            restaurantRecord.delayed = [];
            restaurantRecord.total = 0;

            checkingIn = restaurantRecord['Pointage']
            checkingOut = restaurantRecord['Depointage']

            let totalSeconds = 0;

            for (let i = 0; i < checkingIn.length; i++) {
                const checkInTime = checkingIn[i] ? new Date(checkingIn[i]) : undefined;
                const checkOutTime = checkingOut[i] ? new Date(checkingOut[i]) : undefined;

                if(!checkOutTime){
                    restaurantRecord.delayed.push(checkingIn[i] + ' - pas encore');
                    continue; // Skip this iteration
                }
                // Check if check-out is delayed by more than a day
                if (checkOutTime - checkInTime < 0 || checkOutTime - checkInTime > 24 * 60 * 60 * 1000) {
                    restaurantRecord.delayed.push(checkingIn[i] + ' - ' + checkingOut[i]);
                    continue; // Skip this iteration
                }

                const timeDiffInSeconds = (checkOutTime - checkInTime) / 1000;
                totalSeconds += timeDiffInSeconds;
            }
            totalString = formatTime(totalSeconds)
            restaurantRecord.total = totalString;
        });
    })
    return allUsers;
}

function turnIntoDevelopedArray(object) {
    let toret = [];
    Object.keys(object).forEach(userName => {
        let userObj = object[userName];
        Object.keys(userObj).forEach(restaurantName => {
            let restaurantObj = userObj[restaurantName];
            toPush = { user: userName, restaurant: restaurantName, time: restaurantObj.total, remarques: restaurantObj.delayed }
            toret.push(toPush);
        })
    })
    return toret;
}