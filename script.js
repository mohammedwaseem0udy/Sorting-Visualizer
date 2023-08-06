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
        arr.push(getRandomNumber(10, 375));
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

let animate = function(swaps, arr) {
    if(swaps.length === 0) {
        showBars(arr, true);
        fadeOut(document.getElementById("box-main"), "Sorting Completed");
        return;
    }
    let [i, j] = swaps.shift();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    showBars(arr, true, [i, j]);
    setTimeout(function() {
        animate(swaps, arr);
    }, 60);
}
 
let visualize = function() {
    let algorithm = document.getElementById("algo").value;
    let divs = document.getElementsByClassName("bar");
    let arr = getArrayToVisualize(divs);
    let copy = [...arr];
    let swaps;
    if(algorithm === "1") {
        swaps = bubbleSortReturnSwaps(copy);
    } else if(algorithm === "2") {
        swaps = selectionSortReturnSwaps(copy);
    } else {
        swaps = insertionSortReturnSwaps(copy);
    }
    if(swaps.length === 0) {
        fadeOut(document.getElementById("box-main"), "Array is already sorted.");
        return;
    }
    animate(swaps, arr);
    document.getElementById("box-main").style.visibility = "initial";
    
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

