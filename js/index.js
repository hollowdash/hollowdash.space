function getRandomIntegerExclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const backgroundImages = [
    "assets/backgrounds/forest.jpg",
    "assets/backgrounds/japan.jpg",
    "assets/backgrounds/purple.jpg",
    "assets/backgrounds/japan2.jpg",
    "assets/backgrounds/aurora.jpg"
];
const titleTextOptions= [
    "hollow",
    "hollowhyphen",
    "hollowdash",
    "femboythug226",
    "aeryx",
    "Mak0o",
    "Macc0o",
    "MaccoWasTaken",
    "ce1este",
    "Ezekiel.Jenkins",
    "plungus24"
]

const backgroundImageObject = document.getElementById("body");
const randomIndex = getRandomIntegerExclusive(0, backgroundImages.length);
document.body.style.setProperty('--main-bg', `url("${backgroundImages[randomIndex]}")`);

for (let i = 0; i < 500; i++)
{
    setTimeout(() => {
        document.title = titleTextOptions[getRandomIntegerExclusive(0, titleTextOptions.length)];
    }, i * 2000);
}