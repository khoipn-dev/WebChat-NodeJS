import moment from "moment";

export let bufferToBase64 = (buffer) => {
    return Buffer.from(buffer).toString("base64");
};

export let getLastItemOfArray = (arr) => {
    if ( arr.length === 0 ) {
        return [];
    }
    return arr[arr.length -1];
};

export let timeStampToHumanTime = (timeStamp) => {
    if (!timeStamp) {
        return "";
    }

    return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
};