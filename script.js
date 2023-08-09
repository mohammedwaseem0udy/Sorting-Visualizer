let getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

window.addEventListener("load", (event) => {
    init();
  });

let init = function() {
    let arr = [];
    let N = 30;
    for(let i = 0; i < N; i++) {
        arr.push(getRandomNumber(50, 375));
    }
    showBars(arr);
}

let getArrayToVisualize = function(divs) {

    let divsArr = Array.prototype.slice.call( divs )
    let arr = divsArr.map(function(divsArr) {
        return Number(divsArr.attributes.numval.value)
    })
    return arr;
}

let bubbleSortReturnSwaps = function(arr) {
    let swaps = [];
    for(let i = 0; i < arr.length; i++) {
        for(j = 0; j < arr.length - i; j++) {
            if(arr[j] > arr[j + 1]) {
                swaps.push([j, j + 1])
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return swaps;
}

let insertionSortReturnSwaps = function(arr) {
    let swaps = [];
    for(let i = 1; i < arr.length; i++) {
        for(let j = i - 1; j >= 0; j--) {
            if(arr[j] > arr[j + 1]) {
                swaps.push([j, j + 1]);
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            } else {
                break;
            }
        }
    }
    return swaps;
}

let selectionSortReturnSwaps = function(arr) {
    let swaps = [];
    for(let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if(i != minIdx) {
            swaps.push([minIdx, i]);
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
    return swaps;
}

let sleepAndAnimate = function(arr, swaps) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            showBars(arr, true, swaps);
            return resolve();
        }, 30);
    })
}

let swapByIdx = function(arr, i , j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
 
let mergeTwoSortedList = async function(arr, start, mid, end) {

    let left = start;
    let right = mid + 1;
    let temp = [];
    let oarr = [...arr];
    while(left <= mid && right <= end) {
        if(arr[left] < arr[right]) {
            temp.push(arr[left]);
            left += 1;
        } else {
            temp.push(arr[right]);
            right += 1;
        }
    }

    while(left <= mid) {
        temp.push(arr[left]);
        left += 1;
    }

    while(right <= end) {
        temp.push(arr[right]);
        right += 1;
    }
    for(let i = start; i <= end; i++) {
        arr[i] = temp[i - start];
        await sleepAndAnimate(arr, [i, i]);
    }
}


let mergeSort = async function(arr, start, end) {
    if(start >= end) {
        return;
    }
    let mid = parseInt((start + end) / 2);
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid + 1, end);
    await mergeTwoSortedList(arr, start, mid, end);
}

let mergeSortReturnSwaps = async function(arr) {
    let swaps = [];
    await mergeSort(arr, 0, arr.length - 1);
    console.log(arr);
    showBars(arr, true);
    return swaps;
}

let fadeOutRecursive = function(element) {
    if(Number(element.style.opacity) <= 0) {
        element.style.opacity = 0;
        return;
    }

    setTimeout(function() {
        element.style.opacity -= 1;
        fadeOutRecursive(element);
    }, 1000);
}

let fadeOut = function(element, text = "Hello") {
    element.textContent = text;
    element.style.opacity = 1;
    fadeOutRecursive(element);
}

let animate = function(swaps, arr, cb) {
    if(swaps.length === 0) {
        showBars(arr, true);
        fadeOut(document.getElementById("box-main"), "Sorting Completed");
        cb(false);
        return;
    }
    cb(true);
    let [i, j] = swaps.shift();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    showBars(arr, true, [i, j]);
    setTimeout(function() {
        animate(swaps, arr, cb);
    }, 30);
}

let enableDisableButtons = function(isDisabled = true) {
    console.log(isDisabled);
    console.log(document.getElementById("add-bars"));
    document.getElementById("add-bars").disabled = isDisabled;
    document.getElementById("visualize").disabled = isDisabled;
    document.getElementById("algo").disabled = isDisabled;
}
 
let visualize = async function() {
    enableDisableButtons(true);
    let algorithm = document.getElementById("algo").value;
    let divs = document.getElementsByClassName("bar");
    let arr = getArrayToVisualize(divs);
    let ALGORITHM_VIS_SWAPS = ["1", "2", "3"];
    let copy = [...arr];
    let swaps = [];
    if(algorithm === "1") {
        swaps = bubbleSortReturnSwaps(copy);
    } else if(algorithm === "2") {
        swaps = selectionSortReturnSwaps(copy);
    } else if(algorithm === "3") {
        swaps = insertionSortReturnSwaps(copy);
    } else {
        let testSortedCopy = [...copy];
        swaps = insertionSortReturnSwaps(testSortedCopy);
        if(swaps.length === 0) {
            fadeOut(document.getElementById("box-main"), "Array is already sorted.");
            return;
        }
        await mergeSortReturnSwaps(copy);
        enableDisableButtons(false);
    }
    if(ALGORITHM_VIS_SWAPS.includes(algorithm)) {
        if(swaps.length === 0) {
            fadeOut(document.getElementById("box-main"), "Array is already sorted.");
            return;
        }
        animate(swaps, arr, enableDisableButtons);
        document.getElementById("box-main").style.visibility = "initial";
    }
}

let showBars = function(arr, clearContainer = false, swappedPair = []) {

    let container = document.getElementById("container");
    if(clearContainer) {
        container.innerHTML = "";
    }
    for(let i = 0; i < arr.length; i++) {
        let divTag = document.createElement("div");
        divTag.style.height = arr[i] + "px";
        divTag.classList.add("bar");
        divTag.setAttribute("numVal", arr[i]);

        if(swappedPair && swappedPair.length > 0 && swappedPair.includes(i)) {
            divTag.style.backgroundColor = "#F31559";
        }
        container.appendChild(divTag);
    }
    let divs = document.getElementsByClassName("bar");
    let divTags = getArrayToVisualize(divs);
    if(divTags.length <= 30) {
        let i = 0;
        for(let div of divs) {
            div.textContent = divTags[i];
            i += 1;
        }
    } else {
        for(let div of divs) {
            div.textContent = "";
        }
    }
}

